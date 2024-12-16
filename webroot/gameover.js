// Load final score and correct rhymes from localStorage
const finalScore = localStorage.getItem('finalScore') || 0;
const correctRhymes = localStorage.getItem('correctRhymes') || 0;


// // Add a Play Again button handler
// document.getElementById('playAgain').addEventListener('click', () => {
//     // window.location.reload()
// });

window.addEventListener('message', (ev) => {
    const { type, data } = ev.data;
    if (type === 'devvit-message') {
      const { message } = data;
        console.log(message)
      if (message.type === 'initialData'){
        const finalScore = message.data.currentScore
        const highScore = message.data.maxScore
        document.getElementById('finalScore').textContent = `Your Current Score: ${finalScore}`;
        document.getElementById('highScore').textContent = `Your Highest Score: ${highScore}`;
      }
    }
});