// Timer state variables
let countdownTimer = null; // Interval ID for the countdown timer
let remainingTime = 60; // Remaining time in seconds (1 minute)

// Get references to HTML elements
const playGameButton = document.getElementById("close");
const timerDisplay = document.getElementById("timerDisplay");
const gameOverMessage = document.getElementById("gameOverMessage");

// Function to update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Function to start the game timer
export async function startTimer(callback) {
  // Reset game state
  remainingTime = 2; // Reset timer to 1 minute
  gameOverMessage.style.display = "none"; // Hide the game-over message
  updateTimerDisplay();

  // Start the countdown
  countdownTimer = setInterval(() => {
    remainingTime -= 1; // Decrement time by 1 second
    updateTimerDisplay();

    if (remainingTime <= 0) {
      clearInterval(countdownTimer)
      callback()// End the game when time runs out
    }
  }, 1000);
}

// Function to end the game


// Attach the event listener to the Play Game button
