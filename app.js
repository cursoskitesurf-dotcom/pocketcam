let localStream;
let peer;
const ROOM_SECRET = "MIROOMSECRETO123"; // Cambia esto si quieres otra clave
const URL_SIGNAL = "wss://demo.piesocket.com/v3/channel_12345?api_key=demo"; // WebSocket para señalización demo

const btnCamera = document.getElementById("btnCamera");
const btnViewer = document.getElementById("btnViewer");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

// Función modo cámara
btnCamera.onclick = async () => {
  await startCamera();
  startPeer(true);
  stealthMode();
};

// Función modo visor
btnViewer.onclick = () => {
  startPeer(false);
};

// Activar cámara
async function startCamera() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: { width:1920, height:1080, frameRate:30 },
    audio:true
  });
  localVideo.srcObject = localStream;
}

// Configuración WebRTC usando Simple-Peer
function startPeer(isInitiator) {
  peer = new SimplePeer({
    initiator: isInitiator,
    trickle: true,
    stream: isInitiator ? localStream : null
  });

  // Enviar señal a WebSocket
  const ws = new WebSocket(URL_SIGNAL);
  ws.onopen = () => {
    console.log("Conectado al servidor de señalización");
  };

  ws.onmessage = async (msg) => {
    const data = JSON.parse(msg.data);
    if (data.room !== ROOM_SECRET) return; // solo aceptar nuestro room
    if (data.signal) peer.signal(data.signal);
  };

  peer.on("signal", data => {
    // enviar señal al servidor
    ws.send(JSON.stringify({ room: ROOM_SECRET, signal: data }));
  });

  peer.on("stream", stream => {
    // mostrar vídeo remoto
    remoteVideo.srcObject = stream;
  });
}

// Modo vigilancia silenciosa
function stealthMode(){
  document.body.style.background="black";
  document.getElementById("menu").style.display="none";
}
