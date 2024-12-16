import {startTimer} from './timer.js'
// import {useState} from 


class App {
  constructor() {
    const usernameLabel = document.querySelector('#username');
    const userInput = document.querySelector('#rhymeInput');
    const rhymeResponse = document.querySelector('#rhymeResponse');
    const sendMessage = document.querySelector('#send-message');
    const defaultText = document.querySelector('#default-text');
    const modal = document.getElementById("instructionsModal");
    const displayUserScore = document.getElementById("display-user-score");
    const closeButton = document.getElementsByClassName("close")[0];


    modal.style.display = "none";
    let score = 0;


    const gameData = {
      defaultText: "Here's a song about dear old mother",
      defaultAudioFile: "./assets/audio/defaultAudio.mp3",
      
      rhymes: {
        brother: {
          response: "She always helped us weather the storm.\nThrough it all, she stood by my brother.",
          audioFile: "./assets/audio/brother.mp3",
          isBonus: false,
          isTaken:false
        },
        other: {
          response: "Her advice always helped us recover.\nNo one can compare, not even someone other.",
          audioFile: "./assets/audio/other.mp3",
          isBonus: false,
          isTaken:false
        },
        smother: {
          response: "Her cooking’s so good, it draws a crowd.\nEat too much, and it’ll smother.",
          audioFile: "./assets/audio/smother.mp3",
          isBonus: true,
          isTaken:false
        },
        another: {
          response: "Her patience and love are hard to measure.\nIt’s a treasure that you won’t find in another.",
          audioFile: "./assets/audio/another.mp3",
          isBonus: false,
          isTaken:false
        },
        lover: {
          response: "Dad said she’s the spark that lights his fire.\nHe swears there’s no one better as a lover.",
          audioFile: "./assets/audio/lover.mp3",
          isBonus: true,
          isTaken:false
        }
      }
    };

    
    


    function playAudio(audio) {
      if (!audio.src) {
        alert('Please select an audio file first!');
        return;
      }
      audio.play();
    }

    function pauseAudio(audio) {
      audio.pause();
    }


    const updateUserScore = (scoreToAdd)=>{
      score = score + scoreToAdd
      displayUserScore.textContent = "Score: " + `${score}`
    }


    let currentOverlayAudio = null; 
          

    const searchForRhymes = (userMessage)=>{
      const uservalue = userMessage.toLowerCase();
      const rhymes = gameData.rhymes;


      if(rhymes.hasOwnProperty(uservalue)){
        const foundRhymeData = rhymes[uservalue];
        if(foundRhymeData.isTaken){
          // alert("Sorry, that one's already been taken!");
        }else{
          if(foundRhymeData.isBonus){
            // show bonus UI 
            updateUserScore(20)
          }
          else{
            updateUserScore(10)
          }
    
          if (currentOverlayAudio) {
            currentOverlayAudio.pause();
          }
          const filePath = gameData.defaultAudioFile
          currentOverlayAudio = new Audio(filePath);
          currentOverlayAudio.play();
    
          foundRhymeData.isTaken = true;
          userInput.value = '';
          rhymeResponse.textContent = foundRhymeData.response;
        }
      }
      else{
        console.log("Didn't find anything")
      }
    }

    const isValidRhyme = (userText)=>{
      return true
    }
    // When the Devvit app sends a message with `context.ui.webView.postMessage`, this will be triggered
    window.addEventListener('message', (ev) => {
      const { type, data } = ev.data;

      // Reserved type for messages sent via `context.ui.webView.postMessage`
      if (type === 'devvit-message') {
        const { message } = data;

        if (message.type === 'initialLoad'){
          modal.style.display = "block";
        }

        if (message.type === 'recieveMessage') {
          const userData = message.data
          const userMessage = userData.currentMessage
          searchForRhymes(userMessage)
        }
      }
    });

    const resetGameState = ()=>{
      defaultText.textContent = gameData.defaultText
      gameData.score = 0
      userInput.value = ''
      rhymeResponse.textContent = ''
    }

    const endGame=()=>{
      window.parent?.postMessage(
        { type: 'gameOver', data:{userScore:score} },
        '*'
      );
    }

    const startTheGame = async ()=>{
      resetGameState()
      const backgroundAudio = new Audio(`${gameData.defaultAudioFile}`); 
      // backgroundAudio.loop = true 
      // backgroundAudio.play()
      defaultText.textContent = gameData.defaultText
      await startTimer(()=>endGame())
      if(modal){
        modal.style.display = "none"
      }
    }


    closeButton.addEventListener('click',()=>{
      startTheGame()
    })


    sendMessage.addEventListener('click', () => {
      const uservalue = userInput.value
      if (isValidRhyme(uservalue)) {
        window.parent?.postMessage(
          { type: 'sendMessage', data: { currentMessage: uservalue} },
          '*'
        );
        userInput.value = ''
      }
    });

    
  }
}

new App();

