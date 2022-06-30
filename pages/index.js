import Head from 'next/head'

import React from 'react'
import { Container, Typography, Box, Divider } from '@mui/material'
import styled from '@emotion/styled'
import LoginForm from '../components/LoginForm'
import Logo from '../components/Logo'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { login } from '../services/api'
import { withIronSessionSsr } from 'iron-session/next'
import { default as sessionConfig } from '../config/session'

const RootStyle = styled('div')({
  background: 'rgb(249, 250, 251)',
  height: '100vh',
  display: 'grid',
  placeItems: 'center',
})

const HeadingStyle = styled(Box)({
  textAlign: 'center',
})

const ContentStyle = styled('div')({
  maxWidth: 480,
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

export default function Home () {

  const router = useRouter()

  const doLogin = async (email, password) => {
    const loginResponse = await login({
      email, password
    })

    const loginResponseBody = await loginResponse.json()

    if (loginResponse.status == 200) {

      return router.push('dashboard')

    }

    return false

  }

  return (
    <Container maxWidth="sm">
      <ContentStyle>
        <HeadingStyle component={motion.div} {...fadeInUp}>
          <Logo/>
          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
            Login to your account
          </Typography>
        </HeadingStyle>

        <LoginForm doLogin={doLogin}/>

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
    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: '/dashboard'
        }
      }
    }
    return {
      props: {}
    }
  }
  , sessionConfig
)