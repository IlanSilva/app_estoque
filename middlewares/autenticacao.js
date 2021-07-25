module.exports = {
    autenticado: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash("msg_erro", "Você precisa realizar login!")
        res.redirect("/autenticacao/login")
    },
    verificaLogin: function(req, res, next){
        if(req.isAuthenticated()){
            req.flash("msg_erro", "Você já está logado!")
            res.redirect("/")
        }
        next()
    }
}