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
  e.preventDefault(); //prevents page reload

  const word = input.value.trim(); // Get user input and remove extra spaces
  if (!word) return showError("Please enter a word."); // Validate empty input

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

  } catch (error) {
      console.error("Fetch error:", error); // Logs error for debugging

      // Shows error messages
      if (error.message === "Failed to fetch") {
        showError("Network error. Check your internet connection.");
      } else {
        showError("Word not found or API error.");
      }
    }
});

// TASK 4: DISPLAY DATA ON THE PAGE
function displayWord(entry) {
  // Show word and phonetic spelling
  wordEl.textContent = entry.word;
  phoneticEl.textContent = entry.phonetic || "";

  // Default fallback values
  let definition = "No definition available";
  let example = "No example available";
  let synonyms = [];

  // Loop through meanings and definitions
  for (let meaning of entry.meanings) {
    for (let def of meaning.definitions) {

      // Get first available definition
      if (definition === "No definition available") {
        definition = def.definition;
      }

      // Get first available example
      if (example === "No example available" && def.example) {
        example = def.example;
      }

      // Collect synonyms from definitions
      if (def.synonyms && def.synonyms.length) {
        synonyms = synonyms.concat(def.synonyms);
      }
    }

    // Also check meaning-level synonyms
    if (meaning.synonyms && meaning.synonyms.length) {
      synonyms = synonyms.concat(meaning.synonyms);
    }
  }

  // Remove duplicates synonyms
  synonyms = [...new Set(synonyms)];

  // Update UI
  definitionEl.textContent = definition;
  exampleEl.textContent = example;

  // Render synonyms as clickable elements
  renderSynonyms(synonyms);

  // Fallback API call if no synonyms found
  if (!synonyms.length) {
  fetchSynonyms(entry.word);
}

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

// FALLBACK SYNONYMS API (fallback only if needed)
async function fetchSynonyms(word) {
  try {
    // Fetch synonyms from Datamuse API
    const res = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
    const data = await res.json();

    // Extract top 8 synonyms
    const apiSynonyms = data.slice(0, 8).map(w => w.word);

    // Show fallback synonyms if needed
    if (!synonymsEl.children.length || synonymsEl.textContent.includes("No synonyms")) {
      renderSynonyms(apiSynonyms);
    }

  } catch {
    console.log("Synonym fallback failed");
  }
}


// RENDER SYNONYMS (CLICKABLE)
function renderSynonyms(list = []) {
  synonymsEl.innerHTML = ""; // Clears previous synonyms

  // Remove duplicates and invalid values
  const cleanList = [...new Set(list)].filter(Boolean);

  // Handle empty synonyms case
  if (list.length === 0) {
    synonymsEl.textContent = "No synonyms available";
    return;
  }
  
  // Create clickable synonym elements
  list.slice(0, 10).forEach(word => {
    const span = document.createElement("span");
    span.textContent = word;
    span.classList.add("synonym");
    
    // Clicking synonym triggers new search
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