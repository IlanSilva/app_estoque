const express = require("express")
const db = require("../database/conexao")
const funcoesAutenticacao = require("../tools/funcoesAutenticacao")
const bcrypt = require("bcrypt")
const Router = express.Router()
const passport = require("passport")
const { verificaLogin } =  require("../middlewares/autenticacao")

// POST
Router.post("/cadastro", async (req, res) => {
    const client = await db.connect()
    const val = req.body
    try{
        bcrypt.hash(val.senha, 14)
        .then(async hash => {
            const txt_cria_usuario = "INSERT INTO CONTAS.OPERADORES(NOME, USUARIO, EMAIL, SENHA) VALUES ($1, $2, $3, $4);"
            const valores_cria_usuario = [val.nome.toUpperCase(), val.usuario, val.email.toLowerCase(), hash]
            await client.query(txt_cria_usuario, valores_cria_usuario)
            res.status(201).json({mensagem: "Usuário criado com sucesso!"})
        })
        .catch(erro => {
            throw new Error(erro)
        })
    }catch(err){
        res.status(404).json({mensagem: "Houve um erro! " + err, erro: true})
    }finally{
        client.release()
    }
})

Router.post("/login", verificaLogin, (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/gestao/empresa",
        failureRedirect: "/autenticacao/login",
        failureFlash: true
    })(req, res, next)
})


// GET
Router.get("/logout", (req, res) =>{
    req.logout()
    req.flash("msg_sucesso", "Usuário desconectado com sucesso!")
    res.redirect("/")
})

Router.get("/login", verificaLogin, (req, res) =>{
    res.render("pages/auth")
})

// PUT

// DELETE

module.exports = Router