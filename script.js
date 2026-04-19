// INITIAL SETUP
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

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
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const word = input.value.trim();
  if (!word) return showError("Please enter a word.");

  // TASK 3: FETCH DATA FROM API
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    // If response is not OK (e.g. word not found)
    if (!res.ok) throw new Error();

     // Convert response to JSON
    const data = await res.json();

    // Display data on the page
    displayWord(data[0]);

    // Fetch better synonyms after rendering
    fetchSynonyms(word);

    // Clear previous errors
    errorBox.textContent = "";

  } catch {
    showError("Word not found or API error."); // Handle any errors (network issues or invalid word)
  }
});


// TASK 4: DISPLAY DATA ON THE PAGE
function displayWord(entry) {
  wordEl.textContent = entry.word;
  phoneticEl.textContent = entry.phonetic || "";

  let definition = "No definition available";
  let example = "No example available";
  let synonyms = [];

  // LOOP THROUGH ALL MEANINGS (FIX)
  for (let meaning of entry.meanings) {
    for (let def of meaning.definitions) {

      // Get first definition
      if (definition === "No definition available") {
        definition = def.definition;
      }

      // FIND FIRST AVAILABLE EXAMPLE
      if (example === "No example available" && def.example) {
        example = def.example;
      }

      // COLLECT SYNONYMS (accurate)
      if (def.synonyms && def.synonyms.length) {
        synonyms = synonyms.concat(def.synonyms);
      }
    }

    // Also check meaning-level synonyms
    if (meaning.synonyms && meaning.synonyms.length) {
      synonyms = synonyms.concat(meaning.synonyms);
    }
  }

  // Remove duplicates
  synonyms = [...new Set(synonyms)];

  // Update UI
  definitionEl.textContent = definition;
  exampleEl.textContent = example;

  renderSynonyms(synonyms);

  // Handle audio playback
  const audio = entry.phonetics.find(p => p.audio)?.audio;
  if (audio) {
    audioEl.src = audio;
    audioEl.style.display = "block";
  } else {
    audioEl.style.display = "none";
  }

  // Show result section
  resultBox.classList.remove("hidden");
}

// BETTER SYNONYMS (fallback only if needed)
async function fetchSynonyms(word) {
  try {
    const res = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
    const data = await res.json();

    const apiSynonyms = data.slice(0, 8).map(w => w.word);

    // Only replace if dictionary synonyms were weak
    if (!synonymsEl.children.length || synonymsEl.textContent.includes("No synonyms")) {
      renderSynonyms(apiSynonyms);
    }

  } catch {
    console.log("Synonym fallback failed");
  }
}


// RENDER SYNONYMS (CLICKABLE)
function renderSynonyms(list) {
  synonymsEl.innerHTML = "";

  if (!list.length) {
    synonymsEl.textContent = "No synonyms available";
    return;
  }

  list.slice(0, 10).forEach(word => {
    const span = document.createElement("span");
    span.textContent = word;
    span.classList.add("synonym");

    span.addEventListener("click", () => {
      input.value = word;
      form.dispatchEvent(new Event("submit"));
    });

    synonymsEl.appendChild(span);
  });
}


// TASK 6: ERROR HANDLING FUNCTION
function showError(msg) {
    // Display error message
  errorBox.textContent = msg;
  // Hide results when error occurs
  resultBox.classList.add("hidden");
}