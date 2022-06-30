export default {
  cookieName: "MOSERVICECOOKIE",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false
  },
  password: process.env.APPLICATION_SECRET || "293db720-deae-46b1-8747-9b6a4b1f0950"
}