let localStream;

async function startCamera(){

  // Activar cámara en alta calidad
  localStream = await navigator.mediaDevices.getUserMedia({
    video:{ width:1920, height:1080, frameRate:30 },
    audio:true
  });

  document.getElementById("localVideo").srcObject = localStream;

  // Crear QR
  createQR();

  // Activar modo vigilancia silenciosa
  stealthMode();
}

function viewerMode(){
  alert("Escanea el QR del móvil cámara");
}

function createQR(){
  const room = Math.floor(Math.random()*100000);
  const url = window.location.href + "?room=" + room;
  QRCode.toCanvas(document.getElementById("qr"), url);
}

function stealthMode(){
  document.body.style.background="black";
  document.getElementById("menu").style.display="none";
}
