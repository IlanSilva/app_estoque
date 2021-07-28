const express = require("express")
const Router = express.Router()

// ROTAS

Router.use("/", (req, res) => {
    res.render("pages/gestao")
})

// IMPORTAÇÃO DE MODULOS
const rotaEmpresa = require("./empresa")
const rotaEstoque = require("./estoque")
Router.use("/", rotaEmpresa)
Router.use("/", rotaEstoque)


module.exports = Router