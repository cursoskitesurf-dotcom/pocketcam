let localStream;

async function startCamera(){

  // Activar cámara en alta calidad
  localStream = await navigator.mediaDevices.getUserMedia({
    video:{ width:1920, height:1080, frameRate:30 },
    audio:true
  });

  document.getElementById("localVideo").srcObject = localStream;

  // Activar modo vigilancia silenciosa primero
  stealthMode();

  // Generar QR después de 500ms para asegurar que Safari renderiza bien
  setTimeout(() => {
    createQR();
  }, 500);
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
  // ocultamos botones pero dejamos QR visible
  document.getElementById("menu").style.display="none";
  const qrDiv = document.getElementById("qr");
  qrDiv.style.display="block";
  qrDiv.style.marginTop="50px";
}
