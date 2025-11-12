// Lista de palabras con sus imágenes y sonidos (rutas corregidas)
const palabras = [
  { nombre: "arco", imagen: "palabras/arco.png", sonido: "../audio/a.mp3", letra: "A" },
  { nombre: "ballena", imagen: "palabras/ballena.png", sonido: "../audio/b.mp3", letra: "B" },
  { nombre: "camion", imagen: "palabras/camion.png", sonido: "../audio/c.mp3", letra: "C" },
  { nombre: "dado", imagen: "palabras/dado.png", sonido: "../audio/d.mp3", letra: "D" },
  { nombre: "elefante", imagen: "palabras/elefante.png", sonido: "../audio/e.mp3", letra: "E" },
  { nombre: "flor", imagen: "palabras/flor.png", sonido: "../audio/f.mp3", letra: "F" },
  { nombre: "gato", imagen: "palabras/gato.png", sonido: "../audio/g.mp3", letra: "G" },
  { nombre: "iguana", imagen: "palabras/iguana.png", sonido: "../audio/i.mp3", letra: "I" },
  { nombre: "jirafa", imagen: "palabras/jirafa.png", sonido: "../audio/j.mp3", letra: "J" },
  { nombre: "lapiz", imagen: "palabras/lapiz.png", sonido: "../audio/l.mp3", letra: "L" },
  { nombre: "manzana", imagen: "palabras/manzana.png", sonido: "../audio/m.mp3", letra: "M" },
  { nombre: "nube", imagen: "palabras/nube.png", sonido: "../audio/n.mp3", letra: "N" },
  { nombre: "oso", imagen: "palabras/oso.png", sonido: "../audio/o.mp3", letra: "O" },
  { nombre: "perro", imagen: "palabras/perro.png", sonido: "../audio/p.mp3", letra: "P" },
  { nombre: "queso", imagen: "palabras/queso.png", sonido: "../audio/q.mp3", letra: "Q" },
  { nombre: "rana", imagen: "palabras/rana.png", sonido: "../audio/r.mp3", letra: "R" },
  { nombre: "sol", imagen: "palabras/sol.png", sonido: "../audio/s.mp3", letra: "S" },
  { nombre: "tren", imagen: "palabras/tren.png", sonido: "../audio/t.mp3", letra: "T" },
  { nombre: "uvas", imagen: "palabras/uvas.png", sonido: "../audio/u.mp3", letra: "U" },
  { nombre: "vaca", imagen: "palabras/vaca.png", sonido: "../audio/v.mp3", letra: "V" },
  { nombre: "yoyo", imagen: "palabras/yoyo.png", sonido: "../audio/y.mp3", letra: "Y" },
  { nombre: "zapato", imagen: "palabras/zapato.png", sonido: "../audio/z.mp3", letra: "Z" }
];

let paresActuales = [];
let emparejamientos = {};
let elementoArrastrado = null;
let juegoActivo = true;


const contenedorImagenes = document.getElementById("contenedor-imagenes");
const contenedorLetras = document.getElementById("contenedor-letras");
const feedback = document.getElementById("feedback");
const btnVerificar = document.getElementById("btn-verificar");


window.onload = function() {
  iniciarJuego();
  

  document.addEventListener('dragover', function(e) {
    e.preventDefault();
  });
  
  document.addEventListener('drop', function(e) {
    e.preventDefault();
  });
};

function iniciarJuego() {

  emparejamientos = {};
  juegoActivo = true;
  

  contenedorImagenes.innerHTML = '';
  contenedorLetras.innerHTML = '';
  feedback.textContent = '';
  

  const palabrasDisponibles = [...palabras];
  const palabrasSeleccionadas = [];
  const letrasUsadas = new Set();
  
  while (palabrasSeleccionadas.length < 5 && palabrasDisponibles.length > 0) {
    const indiceAleatorio = Math.floor(Math.random() * palabrasDisponibles.length);
    const palabra = palabrasDisponibles[indiceAleatorio];
    
    if (!letrasUsadas.has(palabra.letra)) {
      palabrasSeleccionadas.push(palabra);
      letrasUsadas.add(palabra.letra);
      palabrasDisponibles.splice(indiceAleatorio, 1);
    }
  }
  
 
  while (palabrasSeleccionadas.length < 5 && palabrasDisponibles.length > 0) {
    const indiceAleatorio = Math.floor(Math.random() * palabrasDisponibles.length);
    palabrasSeleccionadas.push(palabrasDisponibles.splice(indiceAleatorio, 1)[0]);
  }
  
  paresActuales = palabrasSeleccionadas;
  
 
  palabrasSeleccionadas.forEach((palabra, index) => {
    const img = document.createElement('img');
    img.src = palabra.imagen;
    img.alt = palabra.nombre;
    img.className = 'imagen-arrastrable';
    img.draggable = true;
    img.dataset.index = index;
    
    img.addEventListener('dragstart', function(e) {
      elementoArrastrado = this;
      e.dataTransfer.setData('text/plain', this.dataset.index);
      setTimeout(() => this.style.visibility = 'hidden', 0);
    });
    
    img.addEventListener('dragend', function() {
      this.style.visibility = 'visible';
    });
    
    contenedorImagenes.appendChild(img);
  });
  
 
  const letrasMezcladas = palabrasSeleccionadas
    .map(p => p.letra)
    .sort(() => Math.random() - 0.5);
  
  letrasMezcladas.forEach((letra, index) => {
    const divLetra = document.createElement('div');
    divLetra.textContent = letra;
    divLetra.className = 'letra';
    divLetra.dataset.letra = letra;
    divLetra.dataset.index = index;
    
    
divLetra.addEventListener('drop', function(e) {
  e.preventDefault();
  this.classList.remove('highlight');

  if (!juegoActivo) return;

  const indiceImagen = e.dataTransfer.getData('text/plain');
  const palabra = paresActuales[indiceImagen];

 
  const letraDestino = this.dataset.letra;

  
  if (palabra.letra === letraDestino) {
   

    
    Object.keys(emparejamientos).forEach(key => {
      if (emparejamientos[key] === indiceImagen) {
        delete emparejamientos[key];
      }
    });

    
    const imagenPrevia = this.querySelector('.imagen-en-letra');
    if (imagenPrevia) {
      this.removeChild(imagenPrevia);
    }

    
    const miniImg = document.createElement('img');
    miniImg.src = palabra.imagen;
    miniImg.className = 'imagen-en-letra';
    this.appendChild(miniImg);

   
    emparejamientos[this.dataset.index] = indiceImagen;

   
    const audio = new Audio('../audio/correcto.mp3');
    audio.play();

    
    if (Object.keys(emparejamientos).length === 5) {
      setTimeout(verificarRespuestas, 500); // pequeño retardo para que se vea la imagen
    }

  } else {
    

    const xFeedback = document.createElement('div');
    xFeedback.textContent = "❌";
    xFeedback.style.position = "absolute";
    xFeedback.style.fontSize = "2rem";
    xFeedback.style.color = "red";
    xFeedback.style.top = "50%";
    xFeedback.style.left = "50%";
    xFeedback.style.transform = "translate(-50%, -50%)";
    xFeedback.style.pointerEvents = "none";
    this.appendChild(xFeedback);

    
    setTimeout(() => {
      if (this.contains(xFeedback)) this.removeChild(xFeedback);
    }, 1000);

    
    mostrarFeedback('❌', `¡Incorrecto! Eso no empieza con la letra "${letraDestino}"`, '#ef4444');

    
    const audio = new Audio('../audio/incorrecto.mp3');
    audio.play();
  }
});
    
    
    divLetra.addEventListener('click', function() {
      const audio = new Audio(`/audio/${letra.toLowerCase()}.mp3`);
      audio.play();
    });
    
    contenedorLetras.appendChild(divLetra);
  });
  
  
  btnVerificar.textContent = "Verificar respuestas";
  btnVerificar.onclick = verificarRespuestas;
  btnVerificar.disabled = false;
}

function verificarRespuestas() {
  if (!juegoActivo) return;
  
  juegoActivo = false;
  let respuestasCorrectas = 0;
  
  
  for (const [indexLetra, indexImagen] of Object.entries(emparejamientos)) {
    const letra = contenedorLetras.children[indexLetra].dataset.letra;
    const palabra = paresActuales[indexImagen];
    
    if (letra === palabra.letra) {
      respuestasCorrectas++;
      contenedorLetras.children[indexLetra].style.background = 'linear-gradient(135deg, #10b981, #34d399)';
    } else {
      contenedorLetras.children[indexLetra].style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
    }
  }
  
  
  if (respuestasCorrectas === 5) {
    mostrarFeedback('🎉', '¡Perfecto!', '#10b981');
  } else if (respuestasCorrectas >= 3) {
    mostrarFeedback('👍', '¡Bien hecho!', '#3b82f6');
  } else {
    mostrarFeedback('💪', 'Sigue practicando', '#ef4444');
  }
  
  
  paresActuales.forEach((palabra, indexImagen) => {
    const letraCorrecta = Array.from(contenedorLetras.children).find(
      letra => letra.dataset.letra === palabra.letra
    );
    
    if (letraCorrecta && !emparejamientos[letraCorrecta.dataset.index]) {
      const miniImg = document.createElement('img');
      miniImg.src = palabra.imagen;
      miniImg.className = 'imagen-en-letra';
      miniImg.style.opacity = '0.5';
      letraCorrecta.appendChild(miniImg);
    }
  });
  
 
  btnVerificar.textContent = "Jugar de nuevo";
  btnVerificar.onclick = iniciarJuego;
}

function mostrarFeedback(icono, texto, color) {
  const feedback = document.getElementById('feedback');
  const iconSpan = document.getElementById('feedback-icon');
  const textSpan = document.getElementById('feedback-text');
  if (iconSpan && textSpan) {
    iconSpan.textContent = icono;
    textSpan.textContent = texto;
    feedback.style.color = color || '#ff7f50';
  } else {
    feedback.textContent = texto;
    feedback.style.color = color || '#ff7f50';
  }
}