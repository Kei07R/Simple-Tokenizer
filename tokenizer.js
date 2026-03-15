// The vocabulary stores the mapping from words to integer IDs.
const vocabulary = new Map();
// The reverse vocabulary stores the mapping from integer IDs to words.
const reverseVocabulary = new Map();
let nextId = 0;

/**
 * Encodes a text string into a sequence of tokens.
 * @param {string} text The input string.
 * @returns {Array<string>} An array of tokens, where each token is a string formatted as "indextokenId".
 */
function encoder(text) {
  const words = text.split(" ");
  const tokens = [];

  words.forEach((word, index) => {
    if (!vocabulary.has(word)) {
      vocabulary.set(word, nextId);
      reverseVocabulary.set(nextId, word);
      nextId++;
    }
    const tokenId = vocabulary.get(word);
    // Pad index and tokenId to 4 digits and concatenate them.
    const indexStr = String(index).padStart(4, "0");
    const tokenIdStr = String(tokenId).padStart(4, "0");
    tokens.push(`${indexStr}${tokenIdStr}`);
  });

  return tokens;
}

/**
 * Decodes a sequence of tokens back into the original text string.
 * @param {Array<string>} tokens The sequence of tokens.
 * @returns {string} The reconstructed text string.
 */
function decoder(tokens) {
  // Sort tokens lexicographically to restore the word order.
  tokens.sort();

  const words = tokens.map((token) => {
    // Extract the token ID from the string token.
    const tokenId = parseInt(token.slice(4), 10);
    return reverseVocabulary.get(tokenId);
  });

  return words.join(" ");
}

// Example Usage:
const text = "Hello my name is Kai and I love coding.";
console.log("Original Text:", text);

const encodedTokens = encoder(text);
console.log("Encoded Tokens:", encodedTokens);

const decodedText = decoder(encodedTokens);
console.log("Decoded Text:", decodedText);

console.log("Vocabulary:", vocabulary);

// UI Logic
document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("text-input");
  const encodeButton = document.getElementById("encode-button");
  const tokensOutput = document.getElementById("tokens-output");
  const tokenCount = document.getElementById("token-count");

  const tokensInput = document.getElementById("tokens-input");
  const decodeButton = document.getElementById("decode-button");
  const textOutput = document.getElementById("text-output");

  const vocabOutput = document.getElementById("vocab-output");
  const vocabSize = document.getElementById("vocab-size");

  function renderVocabulary() {
    vocabSize.textContent = `${vocabulary.size} word${vocabulary.size !== 1 ? "s" : ""}`;
    if (vocabulary.size === 0) {
      vocabOutput.className = "vocab-empty";
      vocabOutput.textContent = "Encode some text to populate the vocabulary.";
      return;
    }
    vocabOutput.className = "vocab-grid";
    vocabOutput.innerHTML = "";
    vocabulary.forEach((id, word) => {
      const entry = document.createElement("div");
      entry.className = "vocab-entry";
      entry.innerHTML = `<span class="vocab-word" title="${word}">${word}</span><span class="vocab-id">#${id}</span>`;
      vocabOutput.appendChild(entry);
    });
  }

  encodeButton.addEventListener("click", () => {
    const text = textInput.value.trim();
    if (!text) return;
    const encoded = encoder(text);

    tokensOutput.className = "output-box monospace token-chips";
    tokensOutput.innerHTML = "";
    encoded.forEach((token) => {
      const chip = document.createElement("span");
      chip.className = "token-chip";
      chip.textContent = token;
      tokensOutput.appendChild(chip);
    });

    tokenCount.style.display = "inline";
    tokenCount.textContent = `${encoded.length} token${encoded.length !== 1 ? "s" : ""}`;

    tokensInput.value = encoded.join(", ");
    renderVocabulary();
  });

  decodeButton.addEventListener("click", () => {
    const tokensStr = tokensInput.value.trim();
    if (!tokensStr) return;
    const tokens = tokensStr.split(",").map((t) => t.trim());
    const decoded = decoder(tokens);

    textOutput.className = "output-box";
    textOutput.textContent = decoded;
  });

  renderVocabulary();
});
