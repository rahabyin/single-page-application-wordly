/**
 * @jest-environment jsdom
 */

// Import your script file (make sure path is correct)
require("../script.js");

describe("Dictionary SPA Tests", () => {

  // Reset DOM before each test
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="searchForm"></form>
      <input id="searchInput" />

      <div id="result" class="hidden"></div>
      <p id="error"></p>

      <h2 id="word"></h2>
      <p id="phonetic"></p>
      <p id="definition"></p>
      <p id="example"></p>
      <p id="synonyms"></p>
      <audio id="audio"></audio>
    `;
    
    // Re-require script to re-attach event listeners to fresh DOM
    jest.resetModules();
    require("../script.js");
  });

  // =========================
  // ✅ TEST 1: Empty Input
  // =========================
  test("shows error if input is empty", () => {
    const form = document.getElementById("searchForm");

    form.dispatchEvent(new Event("submit"));

    expect(document.getElementById("error").textContent)
      .toBe("Please enter a word.");
  });


  // =========================
  // ✅ TEST 2: Fetch is called
  // =========================
  test("calls fetch with correct URL", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );

    const form = document.getElementById("searchForm");
    const input = document.getElementById("searchInput");

    input.value = "hello";

    form.dispatchEvent(new Event("submit"));

    // FIXED: Wait for async handler
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(fetch).toHaveBeenCalledWith(
      "https://api.dictionaryapi.dev/api/v2/entries/en/hello"  // FIXED: removed space
    );
  });


  // =========================
  // ✅ TEST 3: Display Data
  // =========================
  test("displays fetched word data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              word: "hello",
              phonetic: "həˈləʊ",
              meanings: [
                {
                  definitions: [
                    {
                      definition: "greeting",
                      example: "Hello there!",
                      synonyms: ["hi"]
                    }
                  ]
                }
              ],
              phonetics: [{ audio: "audio.mp3" }]
            }
          ])
      })
    );

    const form = document.getElementById("searchForm");
    const input = document.getElementById("searchInput");

    input.value = "hello";

    form.dispatchEvent(new Event("submit"));

    // wait for async code to finish
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(document.getElementById("word").textContent).toBe("hello");
    expect(document.getElementById("definition").textContent).toBe("greeting");
  });


  // =========================
  // ❌ TEST 4: Error Handling
  // =========================
  test("shows error when fetch fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false })
    );

    const form = document.getElementById("searchForm");
    const input = document.getElementById("searchInput");

    input.value = "wrongword";

    form.dispatchEvent(new Event("submit"));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(document.getElementById("error").textContent)
      .toBe("Word not found or API error.");
  });

});