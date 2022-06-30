import { default as sessionConfig } from '../../config/session'

import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
  function logoutRoute (req, res, session) {
    req.session.destroy()
    res.send({ ok: true })
  },
  sessionConfig,
)