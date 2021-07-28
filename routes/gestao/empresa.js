const express = require("express")
const Router = express.Router()
const db = require("../../database/conexao")

// POST
Router.post("/empresa/novo", async (req, res) => {
    const client = await db.connect()
    const val = req.body
    try{
        if (!val.nomeempresa || typeof val.nomeempresa == undefined){
            throw new Error("Nome da empresa não informado!")
        }
        const verifica_empresa = await client.query("SELECT * FROM GESTAO.EMPRESAS WHERE NOME ILIKE $1", [val.nomeempresa])
        if (verifica_empresa.rowCount > 0){
            throw new Error("Já existe uma empresa com este nome!")
        }
        const txt_cria_empresa = "INSERT INTO GESTAO.EMPRESAS(NOME) VALUES($1) RETURNING *;"
        const values_cria_empresa = [val.nomeempresa.toUpperCase()]
        const query_cria_empresa = await client.query(txt_cria_empresa, values_cria_empresa)

        req.flash("msg_sucesso", "Sucesso na criação da empresa!")
        res.status(201).redirect("/gestao/empresa/novo")
    }catch(err){
        req.flash("msg_erro", "Houve um erro! " + err)
        res.status(404).redirect("/gestao/empresa/novo")
    }finally{
        client.release()
    }
})
// GET

Router.get("/empresa", (req, res) => {
    res.status(200).render("pages/empresa/empresa.handlebars")
})

Router.get("/empresa/novo", (req, res) => {
    res.status(200).render("pages/empresa/novo")
})

Router.get("/empresa/visualizar",async (req, res) => {
    const client = await db.connect()
    try{
        const query_busca_empresas = await client.query("SELECT * FROM GESTAO.EMPRESAS;")
        console.log(query_busca_empresas.rows)
        res.status(200).render("pages/empresa/visualizar", {empresas: query_busca_empresas.rows})
    }catch(err){
        req.flash("msg_erro", "Houve um erro! " + err)
        res.status(404).render("pages/empresa/visualizar")
    }finally{
        client.release()
    }
})
// PUT
Router.put("/empresa/:id", async (req, res) => {
    const client = await db.connect()
    const val = req.body
    try{
        // VERIFICA SE EXISTE EMPRESA
        const verifica_empresa = await client.query("SELECT * FROM GESTAO.EMPRESAS WHERE CODIGO = $1", [req.params.id])
        if (verifica_empresa.rowCount === 0){
            throw new Error("Não foi localizada nenhuma empresa com esse código.")
        }
        const txt_atualiza_empresa = "UPDATE GESTAO.EMPRESAS SET NOME=$1 WHERE CODIGO = $2;"
        const valores_atualiza_empresa = [val.nome, req.params.id]
        await client.query(txt_atualiza_empresa, valores_atualiza_empresa)
        res.status(201).json({mensagem: `Empresa ${req.params.id} atualizada com sucesso.`})
    }catch(err){
        res.status(404).json({mensagem: "Houve um erro! ", erro: true})
    }finally{
        client.release()
    }
})


// DELETE


module.exports = Router