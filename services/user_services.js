const querystring = require('querystring')
const { users } = require('../config/services')

const operatorSignIn = (data) => {

  return fetch(`${users.url}/api/operators/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }
  })

}

const getListOtpRequest = (token, operatorId, query) => {

  const queryString = querystring.stringify(query)
  const url = `${users.url}/api/operators/${operatorId}/otp-requests?${queryString}`

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token
    }
  })

}

const createOtpRequest = (token, operatorId, data) => {
  return fetch(`${users.url}/api/operators/${operatorId}/otp-requests`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token
    }
  })

}

const checkOtpExistByPhoneOrEmail = (token, operatorId, data) => {
  return fetch(`${users.url}/api/operators/${operatorId}/check-phone-or-email`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token
    }
  })
}

module.exports = {
  operatorSignIn,
  getListOtpRequest,
  createOtpRequest,
  checkOtpExistByPhoneOrEmail
}