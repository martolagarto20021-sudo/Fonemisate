const todasCartas = [
  { imagen: 'memorama/manzana.png', letra: 'M' },
  { imagen: 'memorama/mesa.png', letra: 'M' },
  { imagen: 'memorama/pelota.png', letra: 'P' },
  { imagen: 'memorama/perro.png', letra: 'P' },
  { imagen: 'memorama/silla.png', letra: 'S' },
  { imagen: 'memorama/sol.png', letra: 'S' },
  // Nuevos pares:
  { imagen: 'memorama/avion.png', letra: 'A' },
  { imagen: 'memorama/arbol.png', letra: 'A' },
  { imagen: 'memorama/barco.png', letra: 'B' },
  { imagen: 'memorama/bicicleta.png', letra: 'B' },
  { imagen: 'memorama/casa.png', letra: 'C' },
  { imagen: 'memorama/conejo.png', letra: 'C' },
  { imagen: 'memorama/dado.png', letra: 'D' },
  { imagen: 'memorama/delfin.png', letra: 'D' },
  { imagen: 'memorama/elefante.png', letra: 'E' },
  { imagen: 'memorama/estrella.png', letra: 'E' },
  { imagen: 'memorama/flor.png', letra: 'F' },
  { imagen: 'memorama/foca.png', letra: 'F' },
  { imagen: 'memorama/gato.png', letra: 'G' },
  { imagen: 'memorama/guitarra.png', letra: 'G' },
  { imagen: 'memorama/helado.png', letra: 'H' },
  { imagen: 'memorama/hoja.png', letra: 'H' },
  { imagen: 'memorama/iguana.png', letra: 'I' },
  { imagen: 'memorama/isla.png', letra: 'I' },
  { imagen: 'memorama/jirafa.png', letra: 'J' },
  { imagen: 'memorama/jugo.png', letra: 'J' },
];

let nivel = 1;
let puntos = 0;
let tiempo = 60;
let temporizador;
let seleccionadas = [];
let bloqueadas = [];
let cartasEnJuego = [];
let bloqueandoClick = false;

const grid = document.getElementById('gridCartas');
const mensaje = document.getElementById('mensaje');
const tiempoDiv = document.getElementById('tiempo');
const barraTiempo = document.getElementById('barra-tiempo');
const puntajeDiv = document.getElementById('puntaje');
const nivelDiv = document.getElementById('nivelActual');
const sonidoCorrecto = document.getElementById('sonido-correcto');
const sonidoIncorrecto = document.getElementById('sonido-incorrecto');
const sonidoTiempo = document.getElementById('sonido-tiempo');
const btnReiniciar = document.getElementById('btn-reiniciar');

iniciarNivel();

function iniciarNivel() {
  clearInterval(temporizador);
  tiempo = 60;
  seleccionadas = [];
  bloqueadas = [];
  mensaje.textContent = '';
  grid.innerHTML = '';
  bloqueandoClick = false;
  if (btnReiniciar) btnReiniciar.style.display = 'none';

  nivelDiv.textContent = `Nivel: ${nivel}`;

  const maxPares = Math.floor(todasCartas.length / 2);
  const cantidadPares = Math.min(2 + (nivel - 1), maxPares);

  const todasLetras = [...new Set(todasCartas.map(c => c.letra))];

  const letrasNivel = [];
  const letrasDisponibles = [...todasLetras];
  for (let i = 0; i < cantidadPares; i++) {
    if (letrasDisponibles.length === 0) break;
    const idx = Math.floor(Math.random() * letrasDisponibles.length);
    letrasNivel.push(letrasDisponibles.splice(idx, 1)[0]);
  }

  const totalCartas = letrasNivel.length * 2;
  let columnas = Math.ceil(Math.sqrt(totalCartas));
  grid.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;


  const pares = [];
  letrasNivel.forEach(letra => {
    const delGrupo = todasCartas.filter(c => c.letra === letra);
    const elegidas = delGrupo.slice(0, 2);
    if (elegidas.length === 2) {
      pares.push(...elegidas);
    }
  });

  cartasEnJuego = pares.concat(pares).sort(() => 0.5 - Math.random());

  cartasEnJuego.forEach((carta, index) => {
    const div = document.createElement('div');
    div.className = 'carta boton-letra-memo';
    div.dataset.index = index;

    const img = document.createElement('img');
    img.src = carta.imagen;
    img.alt = 'Imagen';

    div.appendChild(img);
    div.onclick = () => revelar(div);
    grid.appendChild(div);
  });

  actualizarPuntaje();
  actualizarTiempo();
  temporizador = setInterval(() => {
    tiempo--;
    actualizarTiempo();
    if (tiempo <= 0) {
      clearInterval(temporizador);
      mensaje.textContent = '⏰ Tiempo agotado';
      sonidoTiempo.play();
      bloqueandoClick = true;
      if (btnReiniciar) btnReiniciar.style.display = 'block';
    }
  }, 1000);
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

let combo = 0;
let maxCombo = 0;

function revelar(cartaDiv) {
  if (bloqueandoClick || cartaDiv.classList.contains('revelada')) return;
  const index = cartaDiv.dataset.index;
  if (bloqueadas.includes(index)) return;

  cartaDiv.classList.add('revelada', 'giro');
  seleccionadas.push(cartaDiv);

  if (seleccionadas.length === 2) {
    bloqueandoClick = true;
    const [c1, c2] = seleccionadas;
    const i1 = c1.dataset.index;
    const i2 = c2.dataset.index;

    if (cartasEnJuego[i1].letra === cartasEnJuego[i2].letra) {
      bloqueadas.push(i1, i2);
      puntos++;
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      sonidoCorrecto.play();
      setTimeout(()=>{
        const audioWin = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3');
        audioWin.play();
      }, 200);
      lanzarConfeti();
      actualizarPuntaje();
      mensaje.innerHTML = `✅ ¡Correcto! <span style='color:#f59e42;font-size:1.2em;'>${combo>1?`🔥 Combo x${combo}!`:''}</span>`;
      if (bloqueadas.length === cartasEnJuego.length) {
        nivel++;
        setTimeout(() => iniciarNivel(), 1500);
      } else {
        seleccionadas = [];
        bloqueandoClick = false;
      }
    } else {
      sonidoIncorrecto.play();
      mensaje.textContent = '❌ No coinciden';
      combo = 0;
      setTimeout(() => {
        c1.classList.remove('revelada', 'giro');
        c2.classList.remove('revelada', 'giro');
        seleccionadas = [];
        mensaje.textContent = '';
        bloqueandoClick = false;
      }, 1000);
    }
  }
}

function actualizarTiempo() {
  const tiempoNum = document.getElementById('tiempo-num');
  if (tiempoNum) tiempoNum.textContent = tiempo;
  const barra = document.getElementById('barra-tiempo');
  if (barra) {
    barra.style.width = `${(tiempo / 60) * 90}px`;
    if (tiempo > 40) barra.style.background = 'linear-gradient(90deg,#10b981,#facc15)';
    else if (tiempo > 20) barra.style.background = 'linear-gradient(90deg,#facc15,#ef4444)';
    else barra.style.background = 'linear-gradient(90deg,#ef4444,#f87171)';
  }
}

function actualizarPuntaje() {
  const puntajeNum = document.getElementById('puntaje-num');
  if (puntajeNum) {
    puntajeNum.textContent = puntos;
    puntajeNum.classList.remove('puntaje-animado');
    void puntajeNum.offsetWidth; // trigger reflow
    puntajeNum.classList.add('puntaje-animado');
  }
}


const style = document.createElement('style');
style.textContent = `.giro {animation: girocarta 0.5s;} @keyframes girocarta {0%{transform:rotateY(0);} 100%{transform:rotateY(180deg);}}`;
document.head.appendChild(style);
