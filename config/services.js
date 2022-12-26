const environment = process.env.NODE_ENV
console.log(environment)

const services = {
  local: {
    url: 'https://operator-dev.moservice.id/'
  },
  users: {
    url: 'https://apiusers2-dev.moservice.id'
  },
}

if (environment == 'production') {
  services.local.url = 'https://operator.moservice.id/'
  services.users.url = 'https://apiusers.moservice.id'
}

module.exports = {
  local: services.local,
  users: services.users,
}

