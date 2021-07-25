function nova_notificacao(texto){
    const data = new Date(Date.now())
    console.log(`${data.toISOString()} | ${texto} |`)
}

module.exports = {
    nova_notificacao
}