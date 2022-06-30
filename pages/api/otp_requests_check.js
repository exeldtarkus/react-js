import { default as sessionConfig } from '../../config/session'
import { checkOtpExistByPhoneOrEmail } from '../../services/user_services'
import { withIronSessionApiRoute } from 'iron-session/next'

const post = async (req, res) => {
  const { email, phone } = req.body
  const { token, operatorId } = req.session.user

  const reqResponse = await checkOtpExistByPhoneOrEmail(
    token,
    operatorId,
    {
      phoneNumber: phone,
      email,
    })

  const reqResponseBody = await reqResponse.json()

  if (reqResponse.status != 200) {
    return res.status(reqResponse.status).json(reqResponseBody)
  }

  return res.send({ data: reqResponseBody })
}

export default withIronSessionApiRoute(
  async (req, res) => {
    switch (req.method) {

      case 'POST' :

        post(req, res)

        break

    }

  },
  sessionConfig,
)