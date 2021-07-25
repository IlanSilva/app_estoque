const { Pool } = require("pg")

const pool = new Pool({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "323232",
    database: "sismax"
})


module.exports = pool