const express = require('express')
const app= express()
const server= require('http').Server(app)
const io= require('socket.io')(server)
const {v4: uuidV4} = require('uuid')
const { Socket } = require('dgram')
const { ExpressPeerServer, PeerServer }= require('peer');
const peerServer = ExpressPeerServer(server,{
    debug: true
})
app.set ('view engine' , 'ejs')
app.use (express.static('public'))

app.use('/peerjs', PeerServer)

app.get("/",(req, res)=>{
    res.redirect(`/${uuidV4()}`)


})

app.get('/:room',(req, res)=>{
    res.render('room', {roomid: req.params.room})
})

io.on('connection', Socket=>{
    Socket.on('join-room',(roomid,userid)=>
    {
        console.log( roomid, userid)
        Socket.join(roomid)
        Socket.to(roomid).broadcast.emit('user-connected',userid)
    })
})

server.listen(80)