const environment = process.env.NODE_ENV
console.log(environment)

const services = {
  local: {
    url: 'localhost:3000'
  },
  users: {
    url: 'https://apiusers-dev.moservice.id'
  },
}

if (environment == 'production') {
  services.local.url = 'localhost:3000'
  services.users.url = 'https://apiusers.moservice.id'
}

module.exports = {
  local: services.local,
  users: services.users,
}