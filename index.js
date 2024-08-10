let timer;
let timeLeft = 60;
let dictionary;

fetch('https://cdn.jsdelivr.net/npm/typo-js@1.1.0/dictionaries/en_US/en_US.aff')
    .then(response => response.text())
    .then(affData => {
        return fetch('https://cdn.jsdelivr.net/npm/typo-js@1.1.0/dictionaries/en_US/en_US.dic')
            .then(response => response.text())
            .then(dicData => {
                dictionary = new Typo('en_US', affData, dicData);
            });
    });

function startTypingTest() {
    document.getElementById('typingArea').innerHTML = "";
    document.getElementById('results').innerHTML = ""; 
    document.getElementById('typingArea').focus();
    timeLeft = 60;
    document.getElementById('timer').innerText = timeLeft;
    clearInterval(timer);
    timer = setInterval(countDown, 1000);
    document.getElementById('typingArea').addEventListener('input', handleInput);
}

function countDown() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
    } else {
        clearInterval(timer);
        calculateWords();
        document.getElementById('typingArea').removeEventListener('input', handleInput);
    }
}

function calculateWords() {
    const text = document.getElementById("typingArea").innerText.trim();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    showModal(words.length); 
}

function handleInput() {
    const text = document.getElementById("typingArea").innerText;
    const words = text.split(/\s+/);
    const highlightedText = words.map(word => {
        const strippedWord = word.replace(/[.,!?;:"()]/g, ''); 
        if (dictionary && strippedWord.length > 0 && !dictionary.check(strippedWord)) {
            return `<span class="misspelled">${word}</span>`;
        } else {
            return word;
        }
    }).join(' ');
    document.getElementById("typingArea").innerHTML = highlightedText;
    setCaretAtEnd(document.getElementById("typingArea"));
}

function setCaretAtEnd(element) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    element.focus();
}

function showModal(wordsTyped) {
    document.getElementById("modalText").innerText = `You typed ${wordsTyped} words!`;
    document.getElementById("resultModal").style.display = "flex";
    document.querySelector('.container').classList.add('blur-background'); //to add blur
}

function closeModal() {
    document.getElementById("resultModal").style.display = "none";
    document.querySelector('.container').classList.remove('blur-background'); // to remove blur
    resetTypingArea(); 
}

function resetTypingArea() {
    document.getElementById("typingArea").innerHTML = ""; 
    document.getElementById("timer").innerText = "60"; 
    document.getElementById("results").innerHTML = ""; 
    clearInterval(timer); 
    timeLeft = 60; 
}