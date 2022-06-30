const querystring = require('querystring')

const login = (data) => {

  return fetch(`/api/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }
  })

}

const logout = () => {

  return fetch(`/api/logout`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

}

const getListOtpRequest = (query) => {

  const queryString = querystring.stringify(query)

  return fetch(`/api/otp_requests?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

}

const checkOtpNumberOrEmail = (data) => {

  return fetch(`/api/otp_requests_check`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }
  })

}

const createOtpRequest = (data) => {

  return fetch(`/api/otp_requests`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }
  })

}

module.exports = {
  login,
  logout,
  getListOtpRequest,
  checkOtpNumberOrEmail,
  createOtpRequest
}