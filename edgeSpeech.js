let lastText = "";
const box = document.getElementById("speechBox");

function displayText(text) {
  box.textContent = text;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 2000);
}

async function fetchSpeech() {
  try {
    const res = await fetch("http://localhost:3000/speech");
    const data = await res.json();
    lastText = data.text;
    if (lastText) displayText(lastText);
  } catch (e) {
    console.warn("Serveur vocal non disponible.");
  }
}

setInterval(fetchSpeech, 300); // 3–4 fois par seconde

// Version extension TurboWarp
(function (Scratch) {
  const ext = {
    getInfo() {
      return {
        id: "edgeSpeech",
        name: "Edge Speech",
        blocks: [
          {
            opcode: "getPhrase",
            blockType: Scratch.BlockType.REPORTER,
            text: "phrase reconnue"
          }
        ]
      };
    },
    getPhrase() {
      return lastText;
    }
  };

  Scratch.extensions.register(ext);
})(Scratch);
