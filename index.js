const express = require("express")
const app = express()
const aux_console = require("./tools/funcoesConsole")

// CONFIGURACOES
const helmet = require("helmet")
const morgan = require("morgan")
const handlebars = require("express-handlebars")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
require("./guard/auth")(passport)

app.use(express.json())
app.use(express.urlencoded({extended:"false"}))
app.use(session({
    secret: "avdkavnaovnav",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")
app.use(express.static(path.join(__dirname + "/public")))

app.use(morgan("dev"))

// MIDDLEWARE
const { autenticado } = require("./middlewares/autenticacao")
// --- GUARDA ---

// --------------

// VARIAVEIS GLOBAIS
app.use((req, res, next) => {
    res.locals.msg_sucesso = req.flash("msg_sucesso")
    res.locals.msg_erro = req.flash("msg_erro")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})
// ROTAS
const rotaAutenticacao = require("./routes/auth")
const rotaGestao = require("./routes/gestao/index")

app.use("/autenticacao", rotaAutenticacao)

app.get("/", (req, res) => {
    res.render("pagina_principal")
})

app.use("/gestao", autenticado, rotaGestao)


// OUTROS
const porta = 8000
app.listen(porta, () => {
    aux_console.nova_notificacao(`SERVIDOR EXECUTANDO NA PORTA ${porta}`)
})