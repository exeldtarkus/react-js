import { withIronSessionApiRoute } from 'iron-session/next'
import { default as sessionConfig } from '../../config/session'
import { operatorSignIn } from '../../services/user_services'

export default withIronSessionApiRoute(
  async function loginRoute (req, res) {
    if (req.method === 'POST') {

      const { email, password } = req.body

      const loginResponse = await operatorSignIn({
        email,
        password
      })

      console.log('email', email)
      console.log('password', password)
      const loginResponseBody = await loginResponse.json()

      if (loginResponse.status == 200) {

        req.session.user = {
          token: loginResponseBody.data.token,
          operatorId: loginResponseBody.data.operatorId,
        }

        await req.session.save()

      } else {
        return res.status(loginResponse.status).json(loginResponseBody)
      }

      return res.send({ ok: true })

    }
  },
  sessionConfig
)