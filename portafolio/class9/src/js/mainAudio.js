
// AUDIO play configuracion por pagina
window.addEventListener('load', function() {
    var audio = document.getElementById('audioMenu');

    if (!audio) return; // evita errores en páginas sin audio

    // aplicar volumen guardado
    let volumenGuardado = localStorage.getItem("volumenAudio");
    audio.volume = volumenGuardado !== null ? volumenGuardado : 0.5;

    // reproducción por interacción
    var reproducir = function() {
        audio.play().then(function() {
            document.removeEventListener('click', reproducir);
            document.removeEventListener('keydown', reproducir);
        }).catch(function() {
            console.log("Esperando interacción...");
        });
    };

    document.addEventListener('click', reproducir);
    document.addEventListener('keydown', reproducir);
});



window.addEventListener('load', function() {
    var audio = document.getElementById('audioNewGame');

    if (!audio) return; // evita errores en páginas sin audio

    // aplicar volumen guardado
    let volumenGuardado = localStorage.getItem("volumenAudio");
    audio.volume = volumenGuardado !== null ? volumenGuardado : 0.5;

    // reproducción por interacción
    var reproducir = function() {
        audio.play().then(function() {
            document.removeEventListener('click', reproducir);
            document.removeEventListener('keydown', reproducir);
        }).catch(function() {
            console.log("Esperando interacción...");
        });
    };

    document.addEventListener('click', reproducir);
    document.addEventListener('keydown', reproducir);
});



//Settings
const slider = document.getElementById("volumenControl");

if (slider) {
    let volumenGuardado = localStorage.getItem("volumenAudio");
    slider.value = volumenGuardado !== null ? volumenGuardado : 0.5;

    const audios = document.querySelectorAll("audio");

    // aplicar al cargar
    audios.forEach(a => a.volume = slider.value);

    slider.addEventListener("input", () => {
        let nuevoVolumen = slider.value;

        localStorage.setItem("volumenAudio", nuevoVolumen);

        // aplicar a TODOS los audios
        audios.forEach(a => a.volume = nuevoVolumen);
    });
}
