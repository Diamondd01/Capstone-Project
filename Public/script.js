const base_URL= 'http://localhost:4500'
const quizData = [
    {
      question: "Do you prefer a protective style or Natural Hairstyle",
      choices: ["Natural", "Protective"],
    },
    {
      question: "What season is it?",
      choices: ["Winter", "Spring", "Fall", "Summer"],
    },
    {
      question: "Do you want a style for a quick period of time or something that will last?",
      choices: ["Short period of time", "Last awhile"],
    },
    {
      question: "What hair length do you prefer?",
      choices: ["Short", "Long"],
    },
  ];
  
  let currentQuestion = 0; // tracks question
  let userResponses = {}; // tracks user responses
  let user = getCurrentUser(); // Initialize user as null
  const token = localStorage.getItem('token');


// Function to get the current user from local storage
function getCurrentUserFromLocalStorage() {
  const userJson = localStorage.getItem("currentUser");
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      return user;
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return null;
}

  // Retrieving the user object from local storage
const userJson = localStorage.getItem("currentUser");
  
  const questionElement = document.getElementById("question");
  const choicesElement = document.getElementById("choices");
  const questionContainer = document.getElementById("questionContainer");
  const startButton = document.getElementById("startBtn");
  const submitButton = document.getElementById("submitBtn");
  
  // Function to load the next question
  function loadNextQuestion() {
    // Check if all questions have been answered
    if (currentQuestion >= quizData.length) {
      // Display the quiz results after all questions are answered
      //showResults(userResponses);
      processAndDisplayResults(userResponses);
      return;
    }
  
    questionElement.innerText = quizData[currentQuestion].question;
    choicesElement.innerHTML = "";
  
    quizData[currentQuestion].choices.forEach((choice) => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "question" + currentQuestion;
      input.value = choice; 
      const label = document.createElement("label");
      label.htmlFor = choice;
      label.innerText = choice;
      choicesElement.appendChild(input);
      choicesElement.appendChild(label);
      choicesElement.appendChild(document.createElement("br"));
    });
  
    // Increment the current question index
    currentQuestion++;
  }
   const suggestions = {
    "Natural,Winter,Last awhile,Long": ["Curly Afro", "Half up Half down", "Silk press"],
    "Protective,Winter,Last awhile,Long": ["Knotless Braids", "Faux Locs"],
    "Natural,Winter,Short period of time, Short": ["Twist-Out", "Bantu Knots", "High Puff"],
    "Natural,Spring,Last awhile,Long": ["Braid out", "Wash n go","Boho Braids"],
    "Natural,Spring,Short period of time,Short":["Two Buns", "High Puffs", "Sleek back Ponytail"],
    "Protective,Spring,Last awhile,Long": ["Tribal Braids","sew in","Knotless Braids"],
    "Protetive,Summer,Last awhile,Short": ["Wig -bob length", "Sew in", "Short butterfly locs"],
  }; 
  // Function to handle when the user clicks the "Submit" button
  async function handleSubmit(event) {
    event.preventDefault();
  
 
    const form = document.getElementById("quizForm");
  
    // Get user responses from the form and store them in the global variable
    const formElements = form.elements;
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.type === "radio" && element.checked) {
        const questionIndex = element.name.replace("question", "");
        userResponses[`question${questionIndex}`] = element.value;
      }
    }
  
    // Load the next question after a short delay (adjust the delay as needed)
    setTimeout(loadNextQuestion, 1); // Load next question
}  
function createSuggestedHairstyleContainer(hairstyle) {
  const hairstyleContainer = document.createElement("div");
  hairstyleContainer.classList.add("suggestion-container");

  const hairstyleTitle = document.createElement("h1");
  hairstyleTitle.innerText = hairstyle;
  hairstyleContainer.appendChild(hairstyleTitle);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("suggestion-buttons");

  const likeButton = document.createElement("button");
  likeButton.innerText = "Like";
  likeButton.classList.add("like"); // Assigning "like" class to the Like button
  likeButton.addEventListener("click", () => likeHairstyle(hairstyle));

  const dislikeButton = document.createElement("button");
  dislikeButton.innerText = "Dislike";
  dislikeButton.classList.add("dislike"); // Assigning "dislike" class to the Dislike button
 dislikeButton.addEventListener("click", () => dislikeHairstyle(hairstyle));

  const addToFavButton = document.createElement("button");
  addToFavButton.innerText = "Add to Favorites";
  addToFavButton.classList.add("addToFavorites"); // Assigning "addToFavorites" class to the Add to Favorites button
 addToFavButton.addEventListener("click", () => addToFavorites(hairstyle));

  buttonsContainer.appendChild(likeButton);
  buttonsContainer.appendChild(dislikeButton);
  buttonsContainer.appendChild(addToFavButton);

  hairstyleContainer.appendChild(buttonsContainer);

  return hairstyleContainer;
}

// Function to process and display results
function processAndDisplayResults(quizResponses) {
  const selectedOptions = Object.values(quizResponses).join(","); 

  const suggestedHairstyle = suggestions[selectedOptions];
  if (suggestedHairstyle && Array.isArray(suggestedHairstyle)) {
    const resultElement = document.getElementById("result");
    resultElement.innerText = "Based on your answers, we suggest the following hairstyles:";

    // Remove previously displayed results, if any
    while (resultElement.firstChild) {
      resultElement.removeChild(resultElement.firstChild);
    }

    const hairstyleList = document.createElement("ul");
    suggestedHairstyle.forEach((hairstyle) => {
      const listItem = createSuggestedHairstyleContainer(hairstyle);
      hairstyleList.appendChild(listItem);
    });

    resultElement.appendChild(hairstyleList);
    showSuggestionButtons(); // Show the suggestion buttons
  } else {
    const resultElement = document.getElementById("result");
    resultElement.innerText = "Based on your answers, we suggest the following hairstyles:";

    // Remove previously displayed results, if any
    while (resultElement.firstChild) {
      resultElement.removeChild(resultElement.firstChild);
    }

    const listItem = document.createElement("li");
    listItem.innerText = "No suggestions available for the selected options.";
    resultElement.appendChild(listItem);
    hideSuggestionButtons(); // Hide the suggestion buttons
  }
}
  // Function to show the suggestion buttons
  function showSuggestionButtons() {
    const suggestionContainer = document.getElementById("suggestionContainer");
    suggestionContainer.style.display = "block";
  }
  
  // Function to hide the suggestion buttons
  function hideSuggestionButtons() {
    const suggestionContainer = document.getElementById("suggestionContainer");
    suggestionContainer.style.display = "none"; 
  }
 // Event listener for the "Start" button
startButton.addEventListener("click", () => {
  // Check if the user is already signed up
  const userSignedUp = isUserSignedUp();
  const boxElement = document.getElementById("box"); 
  if (userSignedUp) {
    boxElement.style.display = "none";
    questionContainer.style.display = "block"; 
    loadNextQuestion();
  } else {
    // If the user is not signed up, show the registration form
    boxElement.style.display = "block"; 
    questionContainer.style.display = "none"; 
  }
}); 

const loggedInContainer = document.getElementById("userLoggedInContainer");
const loggedInUsername = document.getElementById("loggedInUsername");
const likedStylesList = document.getElementById("likedStylesList");
const favoriteStylesList = document.getElementById("favoriteStylesList");

// Display the styles liked by the user
 function displayLikedStyles(user) {
  likedStylesList.innerHTML = "";
  user.likedStyles.forEach((style) => {
    const listItem = document.createElement("li");
    listItem.textContent = style;
    likedStylesList.appendChild(listItem);
  });
}

// Display the styles added to favorites by the user
function displayFavoriteStyles(user) {
  favoriteStylesList.innerHTML = "";
  user.favoriteStyles.forEach((style) => {
    const listItem = document.createElement("li");
    listItem.textContent = style;
    favoriteStylesList.appendChild(listItem);
  });
} 
const messageContainer = document.getElementById("messageContainer");

// Function to display a message
function showMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("dropdown-message")
  messageElement.textContent = message;
  document.body.appendChild(messageElement);

  // Remove the message element after 3 seconds
  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 3000);
}
// Event listener for the "Submit" button
submitButton.addEventListener("click", handleSubmit);

// Function to handle when the user clicks the "Like" button
function likeHairstyle(hairstyle) {
  showMessage("Glad you liked it!");
}

// Function to handle when the user clicks the "Dislike" button
function dislikeHairstyle(hairstyle) {
  showMessage("Sorry, this was a bad choice.");
}

// Function to handle when the user clicks the "Add to Favorites" button
function addToFavorites(hairstyle) {
  showMessage("Glad this is your favorite!");
}
// Function to check if the user is signed up
async function isUserSignedUp() {
  try {
    const response = await fetch(`${base_URL}/api/checkUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.isUserSignedUp;
    } else {
      console.error('Error checking user status:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error checking user status:', error);
    return false;
  }
} 
document.addEventListener('DOMContentLoaded', async () => {
  const registrationForm = document.getElementById('signupForm'); 

  // Event listener for form submission
  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get user input from the form
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send the user information to the server for registration
    try {
      const response = await fetch(`${base_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        registrationForm.style.display = 'none';
        questionContainer.style.display = 'block';

        // Proceed with loading and displaying the quiz here
        loadNextQuestion();
      } else {
        // Handle registration error
        const data = await response.json();
        console.error('Registration error:', data.error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  });
});
function getCurrentUser() {
  const userJson = localStorage.getItem("currentUser");

  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      console.log("Retrieved user:", user);
      return user;
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return null;
} 

startButton.addEventListener("click", handleStartButtonClick);
// Function to get the user ID from the JWT token
async function getUserIdFromToken() {
  try {
    const response = await fetch(`${base_URL}/api/user/token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.userId;
    } else {
      console.error('Error getting user ID from token:', response.statusText);
    }
  } catch (error) {
    console.error('Error getting user ID from token:', error);
  }
  return null;
}

// Function to retrieve user data and handle storage
function retrieveAndStoreUserData() {
  user = getCurrentUser();
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user)); // Store the user data
  }
}

// Call the function to retrieve and store user data
retrieveAndStoreUserData();
// Function to handle when the user clicks the "Like" button
async function likedHairstyle(hairstyle) {
  try {
    const userId = getUserIdFromToken();
    if (userId) {
      const response = await fetch(`${base_URL}/api/hairstyles/${hairstyle}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        console.log(`Glad you liked: ${hairstyle}`);
        await refreshUserStyles();
      } else {
        console.error('Error liking hairstyle:', response.statusText);
      }
    }
  } catch (error) {
    console.error('Error liking hairstyle:', error);
  }
}

// Function to handle when the user clicks the "Dislike" button
async function dislikedHairstyle(hairstyle) {
  try {
    const userId = getUserIdFromToken();
    if (userId) {
      const response = await fetch(`${base_URL}/api/hairstyles/${hairstyle}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        console.log(`You disliked: ${hairstyle}`);
        await refreshUserStyles();
      } else {
        console.error('Error disliking hairstyle:', response.statusText);
      }
    }
  } catch (error) {
    console.error('Error disliking hairstyle:', error);
  }
}

// Function to handle when the user clicks the "Add to Favorites" button
async function addedToFavorites(hairstyle) {
  try {
    const userId = getUserIdFromToken();
    if (userId) {
      const response = await fetch(`${base_URL}/api/hairstyles/${hairstyle}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        console.log(`Added to favorites: ${hairstyle}`);
        await refreshUserStyles();
      } else {
        console.error('Error adding to favorites:', response.statusText);
      }
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}
// Function to fetch and display user data, including liked and favorited styles
async function displayUserData() {
  try {
    const response = await fetch(`${base_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();

      // Display user's liked styles
      const likedStylesList = document.getElementById("likedStylesList");
      likedStylesList.innerHTML = "";
      userData.likedStyles.forEach((style) => {
        const listItem = document.createElement("li");
        listItem.textContent = style;
        likedStylesList.appendChild(listItem);
      });

      // Display user's favorited styles
      const favoriteStylesList = document.getElementById("favoriteStylesList");
      favoriteStylesList.innerHTML = "";
      userData.favoriteStyles.forEach((style) => {
        const listItem = document.createElement("li");
        listItem.textContent = style;
        favoriteStylesList.appendChild(listItem);
      });
    } else {
      console.error('Error fetching user data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Call the displayUserData function when the user is logged in and the profile page is loaded
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Call the function to display user data
    await displayUserData();
  }
});

function handleStartButtonClick() {
  const userSignedUp = isUserSignedUp();
  const boxElement = document.getElementById("box"); 
  if (userSignedUp) {
    boxElement.style.display = "none"; 
    questionContainer.style.display = "block";
    loadNextQuestion(); 
  } else {
    
    boxElement.style.display = "block"; 
    questionContainer.style.display = "none";
  }
} 