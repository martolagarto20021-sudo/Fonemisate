const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const sonidos = abecedario.map(letra => ({
  letra: letra,
  audio: `../audio/${letra.toLowerCase()}.mp3`
}));

let sonidoActual = null;
let audioElemento = null;
let puntaje = 0;
let maxPreguntas = 20;
let preguntasRespondidas = 0;
let tiempoRestante = 60; // segundos
let intervaloTemporizador = null;
let vidas = 3;
let combo = 0;
let maxCombo = 0;
let opcionesActuales = 4;

window.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('barra-progreso')) {
    const barra = document.createElement('div');
    barra.id = 'barra-progreso';
    barra.style.height = '18px';
    barra.style.width = '100%';
    barra.style.background = '#e0e7ef';
    barra.style.borderRadius = '10px';
    barra.style.margin = '10px 0 10px 0';
    barra.style.overflow = 'hidden';
    barra.innerHTML = '<div id="progreso" style="height:100%;width:0;background:linear-gradient(90deg,#10b981,#3b82f6);transition:width 0.4s;"></div>';
    document.querySelector('.panel-lateral')?.insertAdjacentElement('afterend', barra);
  }
  if (!document.getElementById('vidas')) {
    const vidasDiv = document.createElement('div');
    vidasDiv.id = 'vidas';
    vidasDiv.style.fontSize = '2em';
    vidasDiv.style.margin = '10px 0';
    document.querySelector('.panel-lateral')?.appendChild(vidasDiv);
  }
  actualizarVidas();
  actualizarBarraProgreso();
});

function actualizarVidas() {
  const vidasDiv = document.getElementById('vidas');
  if (vidasDiv) {
    let corazones = '';
    for (let i = 0; i < 3; i++) {
      if (i < vidas) {
        corazones += `<span class='corazon' style='color:#ff6b6b;'>❤️</span>`;
      } else {
        corazones += `<span class='corazon perdida'>❤️</span>`;
      }
    }
    vidasDiv.innerHTML = corazones;
  }
}

function actualizarBarraProgreso() {
  const progreso = document.getElementById('progreso');
  if (progreso) {
    progreso.style.width = `${(preguntasRespondidas / maxPreguntas) * 100}%`;
  }
}

function actualizarCombo() {
  const comboDiv = document.getElementById('combo');
  if (comboDiv) {
    if (combo > 1) {
      comboDiv.textContent = `🔥 Combo x${combo}!`;
      comboDiv.style.color = '#f59e42';
      comboDiv.style.fontSize = '2em';
      comboDiv.style.textShadow = '0 2px 8px #fbbf24aa';
    } else {
      comboDiv.textContent = '';
      comboDiv.style = '';
    }
  }
}

function generarOpciones(correcta) {
  const opciones = new Set([correcta]);
  while (opciones.size < opcionesActuales) {
    const aleatoria = abecedario[Math.floor(Math.random() * abecedario.length)];
    opciones.add(aleatoria);
  }
  return Array.from(opciones).sort(() => Math.random() - 0.5);
}

function cargarSonido() {
  if (preguntasRespondidas >= maxPreguntas || vidas <= 0) {
    terminarJuego();
    return;
  }


  opcionesActuales = 4 + Math.floor(puntaje / 5);
  if (opcionesActuales > 6) opcionesActuales = 6;

  const idx = Math.floor(Math.random() * sonidos.length);
  sonidoActual = sonidos[idx];

  document.getElementById("mensaje").textContent = "";
  bloquearOpciones(false);

  const opciones = generarOpciones(sonidoActual.letra);
  const contenedor = document.getElementById("opciones");
  contenedor.innerHTML = "";

  opciones.forEach(letra => {
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.className = "letra";
    btn.onclick = () => verificarRespuesta(letra, sonidoActual.letra);
    contenedor.appendChild(btn);
  });

  if (audioElemento) {
    audioElemento.pause();
    audioElemento = null;
  }
  audioElemento = new Audio(sonidoActual.audio);
  audioElemento.volume = 0.4; // Bajar el volumen al 40%
  actualizarBarraProgreso();
}

function reproducirSonido() {
  if (audioElemento) {
    audioElemento.play();
  }
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
  for (let i = 0; i < 18; i++) {
    const emoji = document.createElement('span');
    emoji.textContent = ['🎉','✨','⭐','🎈','🥳','🦄','🍭','🍬','🧸','🪅','🎊','🧁','🍦','🌈','💎'][Math.floor(Math.random()*15)];
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
    mensaje.textContent = "¡Correcto! 🎉";
    mensaje.style.color = "green";
    puntaje++;
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    // Combo feedback
    actualizarCombo();
    // Ya no suma puntos extra por combo, solo muestra el mensaje
    // if (combo > 1) {
    //   mensaje.textContent += `  +${combo-1} extra`;
    //   puntaje += combo-1;
    // }

    setTimeout(()=>{
      const audioWin = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3');
      audioWin.volume = 0.3; // Bajar el volumen del sonido de victoria al 30%
      audioWin.play();
    }, 300);

    lanzarConfeti();
  } else {
    mensaje.textContent = "Incorrecto.";
    mensaje.style.color = "red";

    const sad = document.createElement('span');
    sad.textContent = '😢';
    sad.style.fontSize = '2em';
    sad.style.display = 'inline-block';
    sad.style.animation = 'shake 0.7s';
    mensaje.appendChild(sad);
    // Pierde una vida
    vidas--;
    combo = 0;
    actualizarCombo();
    actualizarVidas();
    if (vidas <= 0) {
      terminarJuegoPorVidas();
      return;
    }
  }

  preguntasRespondidas++;
  actualizarPuntaje();
  bloquearOpciones(true);
  actualizarBarraProgreso();

  // Deshabilitar el botón siguiente durante el juego normal
  document.getElementById("btn-siguiente").disabled = true;

  setTimeout(() => {
    cargarSonido();
  }, 1000);
}

function bloquearOpciones(estado) {
  const botones = document.querySelectorAll("#opciones button");
  botones.forEach(btn => {
    btn.disabled = estado;
  });
}

function actualizarPuntaje() {
  document.getElementById("puntaje").innerHTML = `⭐<br>Puntaje:<br>${puntaje} / ${maxPreguntas}`;
}

function actualizarTiempo() {
  const tiempoElemento = document.getElementById("tiempo");
  tiempoElemento.innerHTML = `⏳<br>Tiempo:<br>${tiempoRestante}s`;

  if (tiempoRestante <= 0) {
    terminarJuego();
  }
}

function iniciarTemporizador() {
  intervaloTemporizador = setInterval(() => {
    tiempoRestante--;
    actualizarTiempo();

    if (tiempoRestante <= 0) {
      clearInterval(intervaloTemporizador);
    }
  }, 1000);
}

function terminarJuegoPorVidas() {
  clearInterval(intervaloTemporizador);
  document.getElementById("mensaje").textContent = "💔 ¡Se acabaron tus vidas! ¡Inténtalo de nuevo!";
  document.getElementById("mensaje").style.color = "red";
  bloquearOpciones(true);
  document.getElementById("btn-reproducir").disabled = true;
  // Cambiar el botón "Siguiente" por "Volver a empezar"
  const btnSiguiente = document.getElementById("btn-siguiente");
  btnSiguiente.textContent = "🔄 Volver a empezar";
  btnSiguiente.disabled = false;
  btnSiguiente.onclick = reiniciarJuego;
  btnSiguiente.style.display = "inline-block";
}

function reiniciarJuego() {
  // Reiniciar todas las variables del juego
  puntaje = 0;
  preguntasRespondidas = 0;
  tiempoRestante = 60;
  vidas = 3;
  combo = 0;
  maxCombo = 0;
  opcionesActuales = 4;
  // Limpiar mensajes y reiniciar botones
  document.getElementById("mensaje").textContent = "";
  document.getElementById("btn-reproducir").disabled = false;
  // Restaurar el botón "Siguiente"
  const btnSiguiente = document.getElementById("btn-siguiente");
  btnSiguiente.textContent = "Siguiente";
  btnSiguiente.disabled = true;
  btnSiguiente.onclick = () => {};
  btnSiguiente.style.display = "none";
  // Actualizar la interfaz
  actualizarPuntaje();
  actualizarVidas();
  actualizarCombo();
  actualizarBarraProgreso();
  // Reiniciar el temporizador
  clearInterval(intervaloTemporizador);
  actualizarTiempo();
  iniciarTemporizador();
  // Cargar un nuevo sonido
  cargarSonido();
}

function terminarJuego() {
  clearInterval(intervaloTemporizador);
  document.getElementById("mensaje").textContent = "⏰ ¡Se acabó el tiempo! Intenta de nuevo.";
  document.getElementById("mensaje").style.color = "red";
  bloquearOpciones(true);
  document.getElementById("btn-reproducir").disabled = true;
  // Cambiar el botón "Siguiente" por "Volver a empezar"
  const btnSiguiente = document.getElementById("btn-siguiente");
  btnSiguiente.textContent = "🔄 Volver a empezar";
  btnSiguiente.disabled = false;
  btnSiguiente.onclick = reiniciarJuego;
  btnSiguiente.style.display = "inline-block";
}

window.onload = () => {
  cargarSonido();
  actualizarPuntaje();
  actualizarTiempo();
  iniciarTemporizador();

  document.getElementById("btn-reproducir").onclick = reproducirSonido;
  document.getElementById("btn-siguiente").onclick = () => {
    // Deshabilitado durante el juego normal
    // cargarSonido();
  };
  document.getElementById("btn-siguiente").disabled = true;
};


const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-8px);} 80%{transform:translateX(8px);} 100%{transform:translateX(0);} }`;
document.head.appendChild(style);
