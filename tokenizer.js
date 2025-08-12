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

  const tokensInput = document.getElementById("tokens-input");
  const decodeButton = document.getElementById("decode-button");
  const textOutput = document.getElementById("text-output");

  encodeButton.addEventListener("click", () => {
    const text = textInput.value;
    if (text) {
      const encoded = encoder(text);
      tokensOutput.textContent = encoded.join(", ");
    }
  });

  decodeButton.addEventListener("click", () => {
    const tokensStr = tokensInput.value;
    if (tokensStr) {
      const tokens = tokensStr.split(",").map((t) => t.trim());
      const decoded = decoder(tokens);
      textOutput.textContent = decoded;
    }
  });
});
