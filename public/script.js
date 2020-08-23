const Socket = io('/')
const videoGrid = document.getElementById('video-grid')
const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
const myvideo = document.createElement('video')
myvideo.muted = true;
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addvideostream(myvideo, stream)

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideostream => {
            addvideostream(video, userVideostream)
        })
    })

    Socket.on('user-connected', userid => {
        connecttoNewUser(userid, stream)
    })
})

Socket.on('user-disconnected', userid => {
    if (peers[userid]) peers[userid].close()
})

peer.on('open', id => {
    Socket.emit('join-room', Room_id, id)
})

function connecttoNewUser(userid, stream) {
    const call = peer.call(userid, stream)
    const video = document.createElement('video')
    call.on('stream', userVideostream => {
        addvideostream(video, userVideostream)
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userid] = call
}


function addvideostream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })

    videoGrid.append(video)
}


