const express = require("express")
const Router = express.Router()
const db = require("../../database/conexao")

// POST
Router.post("/estoque/:empresa", async (req, res) => {
    const client = await db.connect()
    const val = req.body
    try{
        // VALIDAÇÕES
        const verifica_existe_empresa = await client.query("SELECT * FROM GESTAO.EMPRESAS WHERE CODIGO = $1;", [req.params.empresa])
        if (verifica_existe_empresa.rowCount === 0){
            throw new Error("Não foi localizada nenhuma empresa com esse código.")
        }
        const verifica_existe_estoque = await client.query("SELECT * FROM GESTAO.ESTOQUES WHERE NOME ILIKE $1;", [val.nome])
        if (verifica_existe_estoque.rowCount > 0){
            throw new Error("Já existe um estoque com este nome!")
        }
        const txt_cria_estoque = "INSERT INTO GESTAO.ESTOQUES(NOME, CD_EMPRESA) VALUES($1, $2) RETURNING *;"
        const valores_cria_estoque = [val.nome.toUpperCase(), req.params.empresa]
        const query_cria_estoque =  await client.query(txt_cria_estoque, valores_cria_estoque)
        res.status(201).json({
            mensagem: `Estoque ${query_cria_estoque.rows[0].codigo} cadastrado com sucesso para a empresa ${req.params.empresa}.`,
            dados: query_cria_estoque.rows[0]
        })
    }catch(err){
        res.status(404).json({mensagem: "Houve um erro! " + err, erro: true})
    }finally{
        client.release()
    }
})
// GET

Router.get("/estoque", async (req, res) => {
    const client = await db.connect()
    try{
        const txt_busca_estoque = "SELECT * FROM GESTAO.ESTOQUES WHERE NOME ILIKE $1;"
        const valores_busca_estoque = [`${req.query.nome ? req.query.nome : ''}%`]
        const query_busca_estoque = await client.query(txt_busca_estoque, valores_busca_estoque)
        res.status(200).json({
            mensagem: `Localização feita com sucesso, foram encontrados ${query_busca_estoque.rowCount} registros.`,
            dados: query_busca_estoque.rows
        })
    }catch(err){
        res.status(404).json({mensagem: "Houve um erro! " + err, erro: true})
    }finally{
        client.release()
    }
})

// PUT

// DELETE

module.exports = Router