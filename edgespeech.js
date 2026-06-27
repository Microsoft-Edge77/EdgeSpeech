// edgeSpeech.js
// Extension TurboWarp : reconnaissance vocale pour Edge (Web Speech API)

(function (Scratch) {

  let lastText = "";
  let recognizer = null;
  let isListening = false;

  // Vérifier la présence de l’API Web Speech
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function startListening() {
    if (!SpeechRecognition) {
      console.warn("[EdgeSpeech] Web Speech API non disponible.");
      return;
    }

    if (isListening) return;

    recognizer = new SpeechRecognition();
    recognizer.lang = "fr-FR";
    recognizer.continuous = true;
    recognizer.interimResults = false;

    recognizer.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript;
      lastText = String(result).trim().toLowerCase();
      console.log("[EdgeSpeech] Texte reconnu :", lastText);
    };

    recognizer.onerror = (event) => {
      console.warn("[EdgeSpeech] Erreur reco vocale :", event.error);
    };

    recognizer.onend = () => {
      if (isListening) {
        try {
          recognizer.start();
        } catch (e) {
          console.warn("[EdgeSpeech] Impossible de relancer :", e);
        }
      }
    };

    try {
      recognizer.start();
      isListening = true;
      console.log("[EdgeSpeech] Écoute activée.");
    } catch (e) {
      console.warn("[EdgeSpeech] Impossible de démarrer :", e);
    }
  }

  function stopListening() {
    if (recognizer && isListening) {
      try {
        recognizer.stop();
      } catch (e) {
        console.warn("[EdgeSpeech] Impossible d'arrêter :", e);
      }
    }
    isListening = false;
    console.log("[EdgeSpeech] Écoute désactivée.");
  }

  const extension = {
    getInfo() {
      return {
        id: "edgeSpeech",
        name: "Edge Speech",
        blocks: [
          {
            opcode: "start",
            blockType: Scratch.BlockType.COMMAND,
            text: "activer l'écoute"
          },
          {
            opcode: "stop",
            blockType: Scratch.BlockType.COMMAND,
            text: "désactiver l'écoute"
          },
          {
            opcode: "getPhrase",
            blockType: Scratch.BlockType.REPORTER,
            text: "phrase reconnue"
          },
          {
            opcode: "isWord",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "mot reconnu = [mot]",
            arguments: {
              mot: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "microsoft"
              }
            }
          }
        ]
      };
    },

    start() {
      startListening();
    },

    stop() {
      stopListening();
    },

    getPhrase() {
      return lastText;
    },

    isWord(args) {
      const target = String(args.mot).trim().toLowerCase();
      return lastText === target;
    }
  };

  Scratch.extensions.register(extension);

})(Scratch);
