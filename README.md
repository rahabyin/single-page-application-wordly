# 📚 Wordly Dictionary SPA

## Description

**Wordly** is a Single Page Application (SPA) that allows users to search for words and instantly view their meanings, pronunciation, examples, synonyms, and audio pronunciation. The app updates dynamically without reloading the page, providing a fast and smooth user experience.

---

## Features

* Search for any English word
* Display definition, example, and synonyms
* Show phonetic pronunciation
* Play audio pronunciation (if available)
* Handle errors for invalid or empty input
* Dynamic updates (no page refresh)

---

## How It Works

1. User enters a word in the search bar
2. JavaScript listens for the form submission event
3. A request is sent to the Dictionary API
4. The API returns word data in JSON format  
5. JavaScript processes the data and updates the DOM  
6. Synonyms are fetched from a secondary API (Datamuse)  
7. Clicking a synonym triggers a new search automatically  
8. If an error occurs, a message is shown instead

---

## Technologies

* HTML5 – Structure  
* CSS3 – Styling and layout  
* JavaScript (ES6+) – Logic and DOM manipulation  
* Fetch API – Data retrieval  
* Jest – Unit testing  

---

## APIs Used

*  Dictionary API:  
  https://dictionaryapi.dev/

* Synonyms API (Datamuse):  
  https://datamuseapi.com/

---

## How to Run

1. Open the project folder in VS Code
2. Open `index.html` in your browser
   *(or use Live Server in VS Code)*

---

## Run Tests
This project uses **Jest** for testing.

```bash
npm install
npm test
```

---

## Project Structure

```
index.html
style.css
script.js
tests/script.test.js
pseudocode
README.md
```

---

## Future Improvements

* Save favorite words
* Dark mode
* Search history feature
* Multiple definitions
* Mobile responsiveness improvements
* Better audio controls

---

📌 Summary

Wordly is a modern dictionary application that demonstrates how JavaScript can be used to build interactive, API-driven web applications with real-time updates and clean user experience.

---

## Author

Rahab Wanja.

---

