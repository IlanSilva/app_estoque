const express = require("express")
const Router = express.Router()
const db = require("../../database/conexao")

// POST
Router.post("/empresa", async (req, res) => {
    const client = await db.connect()
    const val = req.body
    try{
        const txt_cria_empresa = "INSERT INTO GESTAO.EMPRESAS(NOME) VALUES($1) RETURNING *;"
        const values_cria_empresa = [val.nome.toUpperCase()]
        const query_cria_empresa = await client.query(txt_cria_empresa, values_cria_empresa)

        res.status(201).json({
            mensagem: `Empresa ${query_cria_empresa.rows[0].nome} criada com sucesso com o id ${query_cria_empresa.rows[0].codigo}`,
        })
    }catch(err){
        res.status(404).json({mensagem: "Houve um erro! ", erro: true})
    }finally{
        client.release()
    }
})
// GET

Router.get("/empresa", async (req, res) => {
    const client = await db.connect()
    try{
        const txt_busca_empresa = "SELECT * FROM GESTAO.EMPRESAS"
        const query_busca_empresa = await client.query(txt_busca_empresa)
        res.render("pages/empresa.handlebars")
    }catch(err){
        res.status(404).json({mensagem: "Houve um erro! ", erro: true})
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