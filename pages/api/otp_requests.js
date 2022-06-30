import { default as sessionConfig } from '../../config/session'
import { getListOtpRequest, createOtpRequest } from '../../services/user_services'
import { withIronSessionApiRoute } from 'iron-session/next'

const get = async (req, res) => {
  const page = req.query.page
  const size = req.query.size
  const { token, operatorId } = req.session.user

  const getListOtpRequestResponse = await getListOtpRequest(
    token,
    operatorId,
    {
      page,
      size,
    })

  const getListOtpRequestResponseBody = await getListOtpRequestResponse.json()

  if (getListOtpRequestResponse.status != 200) {
    return res.status(getListOtpRequestResponse.status).json(getListOtpRequestResponseBody)
  }

  res.send({ data: getListOtpRequestResponseBody })
}

const post = async (req, res) => {
  const { email, phone } = req.body

  const payload = {};

  if (email) {
    payload.email = email
  } else {
    payload.phoneNumber = phone
  }

  const { token, operatorId } = req.session.user

  const response = await createOtpRequest(token, operatorId, payload)

  const responseBody = await response.json()

  if (response.status != 200) {
    return res.status(response.status).json(responseBody)
  }

  console.log(response.status, responseBody)

  return res.send({ ok: true })
}

export default withIronSessionApiRoute(
  async (req, res) => {
    switch (req.method) {

      case 'GET' :

        get(req, res)
        break

      case 'POST' :

        post(req, res)
        break
    }
  },
  sessionConfig,
)