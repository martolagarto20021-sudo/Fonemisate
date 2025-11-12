function reproducirFonema(fonema) {

  const letra = fonema.toUpperCase();

  const audio = new Audio(`../audio/${letra}.mp3`);
  audio.play();


  const sonidosDivertidos = [
    'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c3e.mp3', 
    'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b7bfa.mp3', 
    'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b7bfa.mp3', 
    'https://cdn.pixabay.com/audio/2022/10/16/audio_12c1b6b6b7.mp3', 
  ];
  const extra = new Audio(sonidosDivertidos[Math.floor(Math.random()*sonidosDivertidos.length)]);
  setTimeout(()=>extra.play(), 200);


  const imagen = document.getElementById('imagenBoca');
  const imgMayus = `../img/boca/${letra}.png`;
  const imgMinus = `../img/boca/${letra.toLowerCase()}.png`;

  fetch(imgMayus, {method: 'HEAD'}).then(res => {
    if (res.ok) {
      imagen.src = imgMayus;
    } else {
      imagen.src = imgMinus;
    }
    imagen.alt = `Boca pronunciando ${letra}`;
    imagen.classList.remove('anim-boca');
    void imagen.offsetWidth; // trigger reflow
    imagen.classList.add('anim-boca');
  }).catch(() => {
    imagen.src = imgMinus;
    imagen.alt = `Boca pronunciando ${letra}`;
    imagen.classList.remove('anim-boca');
    void imagen.offsetWidth;
    imagen.classList.add('anim-boca');
  });


  const mensajes = [
    `¡Ahora imita el sonido de la letra ${letra}!`,
    `¡Genial! ¿Puedes hacerlo igual?`,
    `¡Muy bien! ¡Eres un crack!`,
    `¡Eso es! ¡Intenta repetirlo!`,
    `¡Bravo! ¡Hazlo otra vez!`,
    `¡Súper! ¡Imita el fonema!`,
    `¡Fantástico! ¡Tú puedes!`,
    `¡Excelente! ¡A pronunciar!`,
  ];
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = mensajes[Math.floor(Math.random()*mensajes.length)];


  const carita = document.getElementById('caritaAnimada');
  carita.textContent = ['😃','😄','😁','😆','😺','🤩','🥳'][Math.floor(Math.random()*7)];
  carita.style.transform = 'scale(1.3) rotate(-8deg)';
  setTimeout(()=>{
    carita.style.transform = '';
  }, 350);


  lanzarConfeti();


  const botones = document.querySelectorAll('.boton-fonema');
  botones.forEach(b=>b.classList.remove('rebote-boton'));
  const btn = Array.from(botones).find(b=>b.textContent.includes(letra));
  if(btn) {
    btn.classList.add('rebote-boton');
    setTimeout(()=>btn.classList.remove('rebote-boton'), 400);
  }
}


function lanzarConfeti() {
  const confeti = document.getElementById('confeti');
  confeti.innerHTML = '';
  const colores = ['#f97316','#fbbf24','#34d399','#60a5fa','#a78bfa','#fb7185'];
  for(let i=0;i<18;i++){
    const div = document.createElement('div');
    div.textContent = ['🎉','✨','🎊','⭐','💥','🥳'][Math.floor(Math.random()*6)];
    div.style.position = 'absolute';
    div.style.left = Math.random()*100+'vw';
    div.style.top = '-40px';
    div.style.fontSize = (32+Math.random()*32)+'px';
    div.style.color = colores[Math.floor(Math.random()*colores.length)];
    div.style.opacity = 0.85;
    div.style.transition = 'top 1.2s cubic-bezier(.2,1.2,.4,1), opacity 0.8s';
    setTimeout(()=>{
      div.style.top = (60+Math.random()*30)+'vh';
      div.style.opacity = 0.1+Math.random()*0.3;
    }, 30);
    confeti.appendChild(div);
  }
  setTimeout(()=>{ confeti.innerHTML = ''; }, 1400);
}


function animarCarita() {
  const carita = document.getElementById('caritaAnimada');
  carita.textContent = '🎤';
  carita.style.transform = 'scale(1.5) rotate(8deg)';
  setTimeout(()=>{
    carita.textContent = ['😃','😄','😁','😆','😺','🤩','🥳'][Math.floor(Math.random()*7)];
    carita.style.transform = '';
  }, 600);
}


const style = document.createElement('style');
style.innerHTML = `.rebote-boton { animation: reboteBoton 0.4s; }
@keyframes reboteBoton { 0%{transform:scale(1);} 40%{transform:scale(1.25) rotate(-8deg);} 100%{transform:scale(1);} }`;
document.head.appendChild(style);