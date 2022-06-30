import { withIronSessionSsr } from 'iron-session/next'
import { default as sessionConfig } from '../config/session'
import { createOtpRequest } from '../services/api'
import { checkOtpNumberOrEmail } from '../services/api'

import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, LinearProgress, Button } from '@mui/material'
import styled from '@emotion/styled'
import Logo from '../components/Logo'
import { motion } from 'framer-motion'
import { DataGrid } from '@mui/x-data-grid'

import { getListOtpRequest, logout, checkOtpNumber } from '../services/api'
import { useRouter } from 'next/router'
import OTPRequestForm from '../components/OTPRequestForm'

const HeadingStyle = styled(Box)({
  textAlign: 'center',
})

const ContentStyle = styled('div')({
  maxWidth: 800,
  padding: 25,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  background: '#fff',
})

let easing = [0.6, -0.05, 0.01, 0.99]
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
}

const Dashboard = () => {

  const router = useRouter()

  const [rows, setRows] = useState([])
  const [counter, setCounter] = useState(0)

  const [columns, setColumns] = useState([
    { field: 'id', hide: true, sortable: false },
    { field: 'col1', minWidth: 250, headerName: 'Tanggal', sortable: false },
    { field: 'col2', minWidth: 200, headerName: 'Nomor HP / Email', sortable: false },
    { field: 'col3', minWidth: 200, headerName: 'OTP', sortable: false }
  ])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [rowCount, setRowCount] = useState(0)

  useEffect(async () => {
    const resultRetrieveData = await retrieveData(1, pageSize)
    setRows(resultRetrieveData.data)
    setRowCount(resultRetrieveData.totalData)
  }, [])

  useEffect(async () => {
    const resultRetrieveData = await retrieveData(1, pageSize)
    setRows(resultRetrieveData.data)
    setRowCount(resultRetrieveData.totalData)
    console.log('counter', counter)
  }, [counter])

  const incrementCounter = () => {
    setCounter(counter+1)
  }

  const retrieveData = async (localPage, localPageSize) => {

    const result = {
      data: [],
      totalData: 0
    }

    const responseGetListOtpRequest = await getListOtpRequest({
      size: localPageSize,
      page: localPage
    })

    const responseGetListOtpRequestResponseBody = await responseGetListOtpRequest.json()
    if (responseGetListOtpRequest.status == 200) {

      let tempRows = responseGetListOtpRequestResponseBody.data.data.content

      tempRows = await Promise.all(tempRows.map((row) => {
        return {
          id: row.id,
          col1: row.createdAt,
          col2: row.phoneNumber || row.email,
          col3: row.otp ? row.otp.code : 'PENDING'
        }
      }))
      console.log('tempRows', tempRows)

      result.data = tempRows
      result.totalData = responseGetListOtpRequestResponseBody.data.data.totalElements
    }
    return result

  }

  const doCheck = async (username) => {
    let result = false
    const data = {}

    if (Number(username)) {
      data.phone = username
    } else {
      data.email = username
    }

    const response = await checkOtpNumberOrEmail(data)

    if (response.status == 200) {
      result = true
    }

    return result
  }

  const doRequest = async (username) => {
    let result = false
    const data = {}

    if (Number(username)) {
      data.phone = username
    } else {
      data.email = username
    }

    const response = await createOtpRequest(data)

    if (response.status == 200) {
      result = true
    }

    return result
  }

  const localLogout = async () => {
    const responseLogoutRequest = await logout()
    if (responseLogoutRequest.status == 200) {
      return true
    }
    return false
  }

  const onPageChange = async (page) => {
    setPage(page)
    const resultRetrieveData = await retrieveData(page + 1, pageSize)
    // setRows(rows + resultRetrieveData.data)
    const newRows = rows.concat(resultRetrieveData.data)
    console.log('onPageChange.resultRetrieveData.data', resultRetrieveData.data)
    console.log('onPageChange.rows', rows)
    console.log('onPageChange.rows', JSON.stringify(newRows))
    setRows(newRows)
    setRowCount(resultRetrieveData.totalData)
  }

  const onPageSizeChange = async (newPageSize) => {
    setPageSize(newPageSize)
    setPage(0)
    const resultRetrieveData = await retrieveData(1, newPageSize)
    setRows(resultRetrieveData.data)
    setRowCount(resultRetrieveData.totalData)
    setPage(1)
  }

  const doLogout = async () => {
    const logoutResult = await localLogout()
    if (logoutResult == true) {
      return router.push('/')
    }
  }

  return (
    <Container maxWidth="md">
      <ContentStyle>
        <HeadingStyle component={motion.div} {...fadeInUp}>
          <Logo/>
          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
            OTP Request
          </Typography>
          <Button
            onClick={() => {
              doLogout()
            }}
            variant="outlined"
            style={{ marginTop: 20, marginBottom: 20, float: 'right' }}
          >Logout</Button>
        </HeadingStyle>

        <OTPRequestForm
          doCheck={doCheck}
          doRequest={doRequest}
          incrementCounter={incrementCounter}
        ></OTPRequestForm>

        <div style={{ height: 500, width: '100%', marginTop: 20 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnFilter={true}
            disableColumnMenu={true}
            disableColumnReorder={true}
            disableMultipleColumnsSorting={true}
            disableSelectionOnClick={true}
            onPageChange={onPageChange}
            page={page}
            rowsPerPageOptions={[10]}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            components={{
              LoadingOverlay: LinearProgress,
            }}
            rowCount={rowCount}
          />
        </div>

        <Typography
          component={motion.p}
          {...fadeInUp}
          variant="body2"
          align="center"
          sx={{ mt: 3 }}
        >
        </Typography>
      </ContentStyle>
    </Container>
  )
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res }) => {
    const user = req.session.user
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: '/'
        }
      }
    }

    return {
      props: {
        user: user || null,
      }
    }
  }
  , sessionConfig
)

export default Dashboard