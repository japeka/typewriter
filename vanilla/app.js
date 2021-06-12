const btnElement = document.querySelector('.start-button');
const pElement = document.querySelector('.text-place-holder');
const textAreaElement = document.querySelector('.typing-area');
const divScoreOuterElement = document.querySelector('.score-outer');
const indicatorEl = document.querySelector('.indicator-el');
const scoreTitle = document.querySelector('.score-title');
const scoreTotal = document.querySelector('.score-total');
const scoreCorrectLetters = document.querySelector('.score-correct-letters');
const scoreIncorrectLetters = document.querySelector('.score-incorrect-letters');
const scoreTime = document.querySelector('.score-time');
const API_KEY = '<YOUR_API_KEY>';
const predefinedWords = ['Finland',  'Imatra',  'happiness', 'painting', 
    'lamp', 'sacrifice', 'sleepy', 'trist', 'Uganda', 'watch', 'noodle',
    'rice', 'typewriter', 'computer','cat', 'dog'];
let content = '';
let dStart = null;
let dEnd = null;

getRandomWord = () => predefinedWords[Math.floor(Math.random()*(predefinedWords.length-1))];

btnElement.addEventListener("click", (e) => {
    pElement.textContent = "Loading..";
    let word = this.getRandomWord();
    textAreaElement.value = '';
    textAreaElement.disabled = false;
    textAreaElement.focus();

    divScoreOuterElement.style.display = 'none';
    let data = {
        "prompt": {"text": `${word}`},"length": 50
    };
    fetch('https://api.inferkit.com/v1/models/standard/generate',
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
                content = data.data.text.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
                pElement.textContent = content;
        })
        .catch(error  => console.error('Error:', error));
    return;
});

async function diff (content, output) {
    let counterSame = 0;
    let counterDiff = 0;
    for(let i=0; i < content.length; i++) {
        if(content[i] === output[i]) {
            counterSame++;
        } else {
            counterDiff++;
        }
    }
    return [counterSame,counterDiff];
};

textAreaElement.addEventListener( "keyup", async (e) => {
    let letters = e.target.value;
    let len = letters.length;
    let code = e.keyCode;
    if(code === 8 || code === 37) {
        return;
    }  
    if(len === content.length) {
        console.log('Game over');
        let [same,diff] = await this.diff(content, letters);
        dEnd = new Date();
        scoreTitle.textContent = `Your score: `;
        scoreTitle.style.display = 'block';
        scoreTotal.textContent = `${((same/content.length)*100).toFixed(2)}%`;
        scoreCorrectLetters.textContent = same;
        scoreIncorrectLetters.textContent = diff;
        scoreTime.textContent = `${((dEnd.getTime() - dStart.getTime()) / 1000).toFixed(2)}s`;
        divScoreOuterElement.style.display = 'block';
       return;
    }
    if(len === 1) dStart = new Date();
    let currentLetter = letters.slice(-1);
    scoreTitle.textContent = 'Status: ';
    scoreTitle.style.display = 'block';
    if(currentLetter === content[len-1]) {
        indicatorEl.style.display = 'inline-block';
        indicatorEl.style['background-color'] = 'green';
        await fadeOut(indicatorEl, 1000); 
    } else {
        indicatorEl.style.display = 'inline-block';
        indicatorEl.style['background-color'] = 'red';
        await fadeOut(indicatorEl, 1000); 
    }
});

async function fadeOut(el, durationInMs, config = defaultFadeConfig()) {  
    return new Promise((resolve, reject) => {         
      const animation = el.animate([
        { opacity: '1' },
        { opacity: '0', offset: 0.5 },
        { opacity: '0', offset: 1 }
      ], {duration: durationInMs, ...config});
      animation.onfinish = () => resolve();
    })
}

function defaultFadeConfig() {
    return {      
        easing: 'linear', 
        iterations: 1, 
        direction: 'normal', 
        fill: 'forwards',
        delay: 0,
        endDelay: 0
      }  
  }
  
