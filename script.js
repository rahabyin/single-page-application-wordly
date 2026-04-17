// TASK 1: GET HTML ELEMENTS
// Form where user submits a word
const form = document.getElementById("searchForm");

// Input field where user types word
const input = document.getElementById("searchInput");

// Result and error display containers
const resultBox = document.getElementById("result");
const errorBox = document.getElementById("error");

// Elements inside result section
const wordEl = document.getElementById("word");
const phoneticEl = document.getElementById("phonetic");
const definitionEl = document.getElementById("definition");
const exampleEl = document.getElementById("example");
const synonymsEl = document.getElementById("synonyms");
const audioEl = document.getElementById("audio");


// TASK 2: HANDLE FORM SUBMISSION
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const word = input.value.trim();

    if (!word) {
      showError("Please enter a word.");
      return;
    }

    // TASK 3: FETCH DATA FROM API
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`  // FIXED: removed space
      );

      // If response is not OK (e.g. word not found)
      if (!res.ok) {
        throw new Error("Word not found");
      }

      // Convert response to JSON
      const data = await res.json();

      // Display data on the page
      displayWord(data);

      // Clear previous errors
      errorBox.textContent = "";

    } catch (error) {
      // Handle any errors (network issues or invalid word)
      showError("Word not found or API error.");
    }
  });
}


// TASK 4: DISPLAY DATA ON THE PAGE
function displayWord(data) {
  // Get first result from API response
  const entry = data[0];

  // Extract basic word info
  const word = entry.word;
  const phonetic = entry.phonetic || "";

  // Get first meaning and definition
  const meaning = entry.meanings[0];
  const definition = meaning.definitions[0].definition;

  // Optional example (fallback if missing)
  const example =
    meaning.definitions[0].example || "No example available";

  // Optional synonyms (fallback if missing)
  const synonyms =
    meaning.definitions[0].synonyms?.join(", ") ||
    "No synonyms available";

  // Find pronunciation audio (if available)
  const audio =
    entry.phonetics.find((p) => p.audio)?.audio || "";

  // TASK 5: UPDATE HTML CONTENT
  wordEl.textContent = word;
  phoneticEl.textContent = phonetic;
  definitionEl.textContent = definition;
  exampleEl.textContent = example;
  synonymsEl.textContent = synonyms;

  // Handle audio playback
  if (audio) {
    audioEl.src = audio;
    audioEl.style.display = "block";
  } else {
    audioEl.style.display = "none";
  }

  // Show result section
  resultBox.classList.remove("hidden");
}


// TASK 6: ERROR HANDLING FUNCTION
function showError(message) {
  // Display error message
  errorBox.textContent = message;

  // Hide results when error occurs
  resultBox.classList.add("hidden");
}