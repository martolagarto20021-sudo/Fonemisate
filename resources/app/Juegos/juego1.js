const palabras = [
    { nombre: "manzana", imagen: "palabras/manzana.png"},
    { nombre: "perro", imagen: "palabras/perro.png" },
    { nombre: "sol", imagen: "palabras/sol.png" },
    { nombre: "lapiz", imagen: "palabras/lapiz.png" },
    { nombre: "oso", imagen: "palabras/oso.png" },
    { nombre: "gato", imagen: "palabras/gato.png" },
    { nombre: "nube", imagen: "palabras/nube.png" },
    { nombre: "flor", imagen: "palabras/flor.png" },
    { nombre: "camion", imagen: "palabras/camion.png" },
    { nombre: "zapato", imagen: "palabras/zapato.png" },
    { nombre: "pez", imagen: "palabras/pez.png" },
    { nombre: "silla", imagen: "palabras/silla.png" },
    { nombre: "arco", imagen: "palabras/arco.png" },
    { nombre: "leon", imagen: "palabras/leon.png" },
    { nombre: "rana", imagen: "palabras/rana.png" },
    { nombre: "vaca", imagen: "palabras/vaca.png" },
    { nombre: "tren", imagen: "palabras/tren.png" },
    { nombre: "yoyo", imagen: "palabras/yoyo.png" },
    { nombre: "uvas", imagen: "palabras/uvas.png" },
    { nombre: "queso", imagen: "palabras/queso.png" }
];

let palabraActual = null;
let totalJugadas = 0;
let puntos = 0;
let timerInterval = null;
let tiempo = 60;

function cargarPalabra() {
    if (totalJugadas >= 20) {
        document.getElementById("juego-contenido").innerHTML = `
            <h2>¡Juego terminado!</h2>
            <p>Tu nota: ${puntos} / 20</p>
            <button onclick="reiniciarJuego()" class="boton-grande">Jugar de nuevo</button>
        `;
        return;
    }

    totalJugadas++;
    tiempo = 60;

    const indice = Math.floor(Math.random() * palabras.length);
    palabraActual = palabras[indice];
    
    document.getElementById("imagen-palabra").src = palabraActual.imagen;
    document.getElementById("mensaje").textContent = "";
    document.getElementById("nota").textContent = `Puntaje: ${puntos} / 20`;

    const letraCorrecta = palabraActual.nombre.charAt(0).toUpperCase();
    const opciones = generarOpciones(letraCorrecta);

    const contenedorOpciones = document.getElementById("opciones");
    contenedorOpciones.innerHTML = "";

    opciones.forEach(letra => {
        const boton = document.createElement("button");
        boton.textContent = letra;
        boton.className = "letra";
        boton.onclick = () => verificarRespuesta(letra, letraCorrecta);
        contenedorOpciones.appendChild(boton);
    });

    iniciarTemporizador();
}

function generarOpciones(correcta) {
    const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const opciones = new Set([correcta]);

    while (opciones.size < 4) {
        const aleatoria = abecedario[Math.floor(Math.random() * abecedario.length)];
        opciones.add(aleatoria);
    }

    return Array.from(opciones).sort(() => Math.random() - 0.5);
}

function lanzarConfeti() {

  const confetiContainer = document.createElement('div');
  confetiContainer.style.position = 'fixed';
  confetiContainer.style.left = 0;
  confetiContainer.style.top = 0;
  confetiContainer.style.width = '100vw';
  confetiContainer.style.height = '100vh';
  confetiContainer.style.pointerEvents = 'none';
  confetiContainer.style.zIndex = 9999;
  for (let i = 0; i < 12; i++) {
    const emoji = document.createElement('span');
    emoji.textContent = ['🎉','✨','⭐','🎈','🥳'][Math.floor(Math.random()*5)];
    emoji.style.position = 'absolute';
    emoji.style.left = Math.random()*100 + 'vw';
    emoji.style.top = '-40px';
    emoji.style.fontSize = (Math.random()*2+2)+'em';
    emoji.style.transition = 'top 1.5s cubic-bezier(.4,2,.6,1), transform 1.5s';
    setTimeout(() => {
      emoji.style.top = (Math.random()*80+10)+'vh';
      emoji.style.transform = `rotate(${Math.random()*360}deg)`;
    }, 10);
    confetiContainer.appendChild(emoji);
  }
  document.body.appendChild(confetiContainer);
  setTimeout(()=>confetiContainer.remove(), 1700);
}

function verificarRespuesta(elegida, correcta) {
    const mensaje = document.getElementById("mensaje");
    if (elegida === correcta) {
        mensaje.textContent = `¡Correcto! La letra ${correcta} es de la palabra ${palabraActual.nombre}`;
        mensaje.style.color = "green";
        puntos++;
        const notaDiv = document.getElementById("nota");
        notaDiv.textContent = `⭐ Puntaje: ${puntos} / 20`;
        notaDiv.classList.add("puntaje-animado");
        setTimeout(() => notaDiv.classList.remove("puntaje-animado"), 600);
        // Reproducir el sonido del fonema correcto
        const audio = new Audio(`../audio/${correcta}.mp3`);
        audio.play();
        // Sonido divertido
        setTimeout(()=>{
          const audioWin = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3');
          audioWin.play();
        }, 400);
        // Confeti
        lanzarConfeti();
    } else {
        mensaje.textContent = `Incorrecto. Era "${correcta}". ❌`;
        mensaje.style.color = "red";
        // Carita triste animada
        const sad = document.createElement('span');
        sad.textContent = '😢';
        sad.style.fontSize = '2em';
        sad.style.display = 'inline-block';
        sad.style.animation = 'shake 0.7s';
        mensaje.appendChild(sad);
    }


    bloquearOpciones();

    clearInterval(timerInterval);
    setTimeout(cargarPalabra, 1500);
}

function bloquearOpciones() {
    const botones = document.querySelectorAll("#opciones button");
    botones.forEach(boton => {
        boton.disabled = true;
    });
}

function iniciarTemporizador() {
    clearInterval(timerInterval);
    actualizarTemporizadorVisual(tiempo);

    timerInterval = setInterval(() => {
        tiempo--;
        actualizarTemporizadorVisual(tiempo);
        if (tiempo <= 0) {
            clearInterval(timerInterval);
            bloquearOpciones();
            document.getElementById("mensaje").textContent = `Se acabó el tiempo. Era "${palabraActual.nombre.charAt(0).toUpperCase()}"`;
            document.getElementById("mensaje").style.color = "red";
            setTimeout(cargarPalabra, 1500);
        }
    }, 1000);
}

function actualizarTemporizadorVisual(tiempoRestante) {
    const tiempoDiv = document.getElementById("tiempo");
    tiempoDiv.textContent = `⏳ ${tiempoRestante}s`;

    if (tiempoRestante > 30) {
        tiempoDiv.style.backgroundColor = "#34d399"; // verde
        tiempoDiv.style.color = "#000";
    } else if (tiempoRestante > 10) {
        tiempoDiv.style.backgroundColor = "#facc15"; // amarillo
        tiempoDiv.style.color = "#000";
    } else {
        tiempoDiv.style.backgroundColor = "#f87171"; // rojo
        tiempoDiv.style.color = "#fff";
    }
}

function reiniciarJuego() {
    totalJugadas = 0;
    puntos = 0;
    cargarPalabra();
}

window.onload = cargarPalabra;


const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-8px);} 80%{transform:translateX(8px);} 100%{transform:translateX(0);} }`;
document.head.appendChild(style);
