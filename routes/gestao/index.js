const express = require("express")
const Router = express.Router()

// IMPORTAÇÃO DE MODULOS
const rotaEmpresa = require("./empresa")
const rotaEstoque = require("./estoque")
Router.use("/", rotaEmpresa)
Router.use("/", rotaEstoque)


module.exports = Router