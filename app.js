let localStream;
let peer;
const ROOM_SECRET = "MIROOMSECRETO123"; // tu clave secreta
const URL_SIGNAL = "wss://demo.piesocket.com/v3/channel_12345?api_key=demo"; // servidor de señalización demo

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

(async function init() {
  // Intentamos activar cámara (primer iPhone)
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { width:1920, height:1080, frameRate:30 },
      audio:true
    });
    localVideo.srcObject = localStream;
    stealthMode();
    startPeer(true); // primer iPhone como cámara
  } catch(e) {
    console.log("No se pudo activar la cámara, quizá este es el segundo iPhone visor");
    startPeer(false); // segundo iPhone como visor
  }
})();

function startPeer(isInitiator) {
  peer = new SimplePeer({
    initiator: isInitiator,
    trickle: true,
    stream: isInitiator ? localStream : null
  });

  const ws = new WebSocket(URL_SIGNAL);
  ws.onopen = () => console.log("Conectado al servidor de señalización");
  ws.onmessage = msg => {
    const data = JSON.parse(msg.data);
    if(data.room !== ROOM_SECRET) return;
    if(data.signal) peer.signal(data.signal);
  };

  peer.on("signal", data => ws.send(JSON.stringify({ room: ROOM_SECRET, signal: data })));
  peer.on("stream", stream => remoteVideo.srcObject = stream);
}

function stealthMode(){
  document.body.style.background="black";
  localVideo.style.width="100%";
  remoteVideo.style.width="100%";
}
