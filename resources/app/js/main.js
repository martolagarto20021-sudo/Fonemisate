function mostrarFonema(letra) {
    let contenido = document.getElementById("contenido-fonema");
    contenido.innerHTML = `
        <h2>Letra ${letra.toUpperCase()}</h2>
        <img src="img/${letra}.png" alt="Imagen de la letra ${letra}" width="200"><br><br>
        <audio controls autoplay>
            <source src="audio/${letra}.mp3" type="audio/mp3">
            Tu navegador no soporta audio.
        </audio>
    `;
}