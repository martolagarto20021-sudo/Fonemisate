const palabras = [
  { imagen: "palabras/manzana.png", letra: "M" },
  { imagen: "palabras/perro.png", letra: "P" },
  { imagen: "palabras/sol.png", letra: "S" },
  { imagen: "palabras/lapiz.png", letra: "L" },
  { imagen: "palabras/oso.png", letra: "O" },
  { imagen: "palabras/gato.png", letra: "G" },
  { imagen: "palabras/nube.png", letra: "N" },
  { imagen: "palabras/flor.png", letra: "F" },
  { imagen: "palabras/camion.png", letra: "C" },
  { imagen: "palabras/zapato.png", letra: "Z" },
  { imagen: "palabras/pez.png", letra: "P" },
  { imagen: "palabras/silla.png", letra: "S" },
  { imagen: "palabras/arco.png", letra: "A" },
  { imagen: "palabras/leon.png", letra: "L" },
  { imagen: "palabras/rana.png", letra: "R" },
  { imagen: "palabras/vaca.png", letra: "V" },
  { imagen: "palabras/tren.png", letra: "T" },
  { imagen: "palabras/yoyo.png", letra: "Y" },
  { imagen: "palabras/uvas.png", letra: "U" },
  { imagen: "palabras/queso.png", letra: "Q" }
];

let ronda = 0;
let puntaje = 0;
let tiempoRestante = 15;
let temporizador = null;
let tiempoInicio = 15;
const rondasTotales = 20;

function actualizarNivel() {
  document.getElementById('nivel-actual').textContent = ronda;
}

function siguienteRonda() {
  if (ronda >= rondasTotales) {
    document.querySelector('.contenedor-flex-niveles').innerHTML = `
      <div class="juego-completado-box">
        <h2>🎉 ¡Juego completado!</h2>
        <p>Puntaje final: <b>${puntaje}</b> de <b>${rondasTotales * 15}</b></p>
        <button id="btn-reiniciar" class="boton-reiniciar">🔄 Volver a empezar</button>
        <a href="../juegos.html" class="boton-volver">⏪ Volver al menú de juegos</a>
      </div>
    `;
    document.getElementById('btn-reiniciar').onclick = () => {
      location.reload();
    };
    return;
  }
  ronda++;
  actualizarNivel();
  tiempoInicio = Math.max(15 - Math.floor((ronda-1)/2), 5);
  tiempoRestante = tiempoInicio;
  actualizarTiempo();
  mostrarPalabra();
  iniciarTemporizador();
}

function mostrarPalabra() {
  const palabra = palabras[(ronda-1) % palabras.length];
  document.getElementById('imagenPalabra').src = palabra.imagen;
  document.getElementById('zona-soltar').textContent = 'Suelta aquí la letra inicial';
  document.getElementById('zona-soltar').className = 'zona-soltar';
  document.getElementById('resultado').textContent = '';

  // Opciones
  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const opciones = new Set([palabra.letra]);
  while (opciones.size < 4) {
    const aleatoria = abecedario[Math.floor(Math.random() * abecedario.length)];
    opciones.add(aleatoria);
  }
  const opcionesArr = Array.from(opciones).sort(() => Math.random() - 0.5);
  const letrasDiv = document.getElementById('letras');
  letrasDiv.innerHTML = '';
  opcionesArr.forEach(letra => {
    const btn = document.createElement('button');
    btn.textContent = letra;
    btn.className = 'letra-drag';
    btn.draggable = true;
    btn.ondragstart = (e) => e.dataTransfer.setData('text/plain', letra);
    letrasDiv.appendChild(btn);
  });

  // Drag & drop
  const zonaSoltar = document.getElementById('zona-soltar');
  zonaSoltar.ondragover = (e) => e.preventDefault();
  zonaSoltar.ondrop = (e) => {
    const letraArrastrada = e.dataTransfer.getData('text/plain');
    clearInterval(temporizador);
    if (letraArrastrada === palabra.letra) {
      zonaSoltar.className = 'zona-soltar correcto';
      let puntos = 5;
      if (tiempoRestante > 10) puntos = 15;
      else if (tiempoRestante > 5) puntos = 10;
      puntaje += puntos;
      document.getElementById('resultado').textContent = `¡Correcto! +${puntos} puntos`;
      document.getElementById('sonido-correcto').play();
    } else {
      zonaSoltar.className = 'zona-soltar incorrecto';
      document.getElementById('resultado').textContent = 'Incorrecto. Era la letra ' + palabra.letra;
      document.getElementById('sonido-incorrecto').play();
    }
    actualizarPuntaje();
    setTimeout(siguienteRonda, 1200);
  };
}

function actualizarPuntaje() {
  document.getElementById('puntaje').textContent = `⭐ Puntaje: ${puntaje}`;
}

function actualizarTiempo() {
  document.getElementById('tiempo').textContent = `⏳ Tiempo restante: ${tiempoRestante}s`;
  const barra = document.getElementById('barra-tiempo');
  barra.style.width = `${(tiempoRestante / tiempoInicio) * 100}%`;
  barra.style.background = tiempoRestante <= 5 ? '#f87171' : tiempoRestante <= 10 ? '#facc15' : '#34d399';
}

function iniciarTemporizador() {
  clearInterval(temporizador);
  temporizador = setInterval(() => {
    tiempoRestante--;
    actualizarTiempo();
    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      document.getElementById('zona-soltar').className = 'zona-soltar incorrecto';
      document.getElementById('resultado').textContent = '⏰ ¡Tiempo agotado!';
      document.getElementById('sonido-tiempo').play();
      setTimeout(siguienteRonda, 1200);
    }
  }, 1000);
}

window.onload = () => {
  ronda = 0;
  puntaje = 0;
  siguienteRonda();
};

// Si el archivo no tiene un bloque <style> JS, los estilos deben ir en el HTML. Pero si quieres que el botón se vea bien aunque se inserte por JS, puedes agregar los estilos así:
if (!document.getElementById('estilo-boton-reiniciar')) {
  const style = document.createElement('style');
  style.id = 'estilo-boton-reiniciar';
  style.textContent = `
    .juego-completado-box {
      background: #fff;
      border-radius: 32px;
      box-shadow: 0 8px 32px #60a5fa33;
      padding: 48px 32px;
      max-width: 420px;
      margin: 60px auto 40px auto;
      text-align: center;
      font-family: 'Comic Sans MS', cursive;
      position: relative;
      z-index: 2;
    }
    .boton-reiniciar {
      display: inline-block;
      background: linear-gradient(135deg, #4ade80, #60a5fa);
      color: #fff;
      padding: 18px 38px;
      font-size: 1.3em;
      border-radius: 18px;
      border: none;
      font-weight: bold;
      margin: 24px 0 0 0;
      cursor: pointer;
      box-shadow: 0 4px 16px #60a5fa55;
      transition: all 0.2s;
      letter-spacing: 1px;
      animation: reboteBoton 1.5s infinite alternate;
    }
    .boton-reiniciar:hover {
      background: linear-gradient(135deg, #60a5fa, #4ade80);
      transform: scale(1.08);
      box-shadow: 0 8px 24px #4ade8055;
    }
  `;
  document.head.appendChild(style);
}
