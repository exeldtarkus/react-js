import React, { useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'

import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

let easing = [0.6, -0.05, 0.01, 0.99]
const animate = {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: easing,
    delay: 0.16,
  },
}

const OTPRequestForm = ({ doRequest, doCheck, incrementCounter }) => {

  const [isDisabled, setIsDisabled] = useState(false)

  const RequestOTPSchema = Yup.object().shape()

  // const RequestOTPSchema = Yup.object().shape({
  //   email: Yup.string().ensure().when('isEmail', {
  //     is: '1',
  //     then: Yup.string()
  //       .email('Email tidak valid')
  //       .required('No HP/Email tidak boleh kosong'),
  //     otherwise: Yup.string()
  //       .min(8, 'No HP minimal 8 digit')
  //       .required('No HP/Email tidak boleh kosong')
  //   }).test(
  //     'exist',
  //     'Tidak ditemukan OTP dengan No HP/Email tersebut',
  //     async (value) => {
  //       if (value.length > 3) {
  //         const check = await doCheck(value)
  //         setIsDisabled(!check)
  //         return check
  //       }
  //       return true
  //     }
  //   )
  // })

  const formik = useFormik({
    initialValues: {
      isEmail: 0,
      email: '',
    },
    validationSchema: RequestOTPSchema,
    onSubmit: ({ email }, { setSubmitting }) => {

      if (email == "") {
        alert('No HP/Email tidak boleh kosong')
        setSubmitting(false)
        return
      }

      console.log('submitting... ', email)
      setTimeout(async () => {
        const responseCheck = await doCheck(email)
        console.log(responseCheck)

        if (responseCheck == false) {
          alert('Tidak ditemukan OTP dengan No HP/Email tersebut')
          setSubmitting(false)
          return
        }

        const response = await doRequest(email)

        if (response == false) {
          alert('Request gagal tolong cek kembali inputan anda')
          setSubmitting(false)
          return
        }

        setSubmitting(false)
        incrementCounter()

      }, 2000)
    },
  })

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, handleChange, handleBlur } =
    formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box
          component={motion.div}
          animate={{
            transition: {
              staggerChildren: 0.55,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={animate}
          >
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="No HP / Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              onChange={(event) => {
                handleChange('email')(event)
                if (Number(values.email)) {
                  handleChange('isEmail')('0')
                } else {
                  handleChange('isEmail')('1')
                }
              }}
              value={values.email}
            />

          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={animate}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={isDisabled}
            >
              {isSubmitting ? 'loading...' : 'Request OTP'}
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  )
}

export default OTPRequestForm
