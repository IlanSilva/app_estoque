const localStrategy = require("passport-local").Strategy
const db = require("../database/conexao")
const bcrypt = require("bcrypt")
const passport = require("passport")
module.exports = function(){
    passport.use(new localStrategy({usernameField: "usuario", passwordField: "senha"}, async (usuario, senha, done) => {
        const client = await db.connect()
        const txt_busca_usuario = "SELECT * FROM CONTAS.OPERADORES WHERE USUARIO = $1;"
        const valores_busca_usuario = [usuario]
        const query_busca_usuario = await client.query(txt_busca_usuario, valores_busca_usuario)

        if (query_busca_usuario.rowCount === 0){
            client.release()
            return done(null, false, {message: "Usuário ou senha incorretos!"})
        }
        const match = await bcrypt.compare(senha, query_busca_usuario.rows[0].senha)
        if (match){
            client.release()
            return done(null, query_busca_usuario.rows[0])
        }else{
            client.release()
            return done(null, false, {message: "Usuário ou senha incorretos!"})
        }
        
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.codigo)
    })
    passport.deserializeUser(async (codigo, done) => {
        const client = await db.connect()
        try{
            const localiza_cliente = await client.query("SELECT * FROM CONTAS.OPERADORES WHERE CODIGO = $1;", [codigo])
            done(null, localiza_cliente.rows[0])
        }catch(err){
            console.log(err)
        }finally{
            client.release()
        }
    })
}
