// edgeSpeech.js – version site réel + extension TurboWarp

let lastText = "";
let recognizer = null;
let isListening = false;
let silenceTimer = null;

// Sélecteur du panneau d'affichage
const box = document.getElementById("speechBox");

// Affichage du texte
function displayText(text) {
  box.textContent = text;
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 2000);
}

// Arrêter l'écoute
function stopListeningInternal() {
  if (recognizer && isListening) {
    try { recognizer.stop(); } catch (e) {}
  }
  isListening = false;
}

// Démarrer l'écoute
function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("La reconnaissance vocale n'est pas disponible dans ce navigateur.");
    return;
  }

  if (isListening) return;

  recognizer = new SpeechRecognition();
  recognizer.lang = "fr-FR";
  recognizer.continuous = true;
  recognizer.interimResults = false;

  recognizer.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    lastText = result.trim();
    displayText(lastText);

    if (silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      stopListeningInternal();
    }, 1000);
  };

  recognizer.onspeechend = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      stopListeningInternal();
    }, 1000);
  };

  recognizer.start();
  isListening = true;
}
