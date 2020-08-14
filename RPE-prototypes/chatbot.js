var msg_ind = 1;

// Get the input field
var input = document.getElementById("myInput");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("sendMsg").click();
    }
});

function nextQuestion(){
    var botbubble = document.getElementById("reply9");
    setTimeout(function () {
        botbubble.style.display = "block";
        updateScroll();
    }, 1000); // wait 1 second
    document.getElementById("query10").style.display = "block";
}

function getComment(){
    setTimeout(function () {
        document.getElementById("reply10").style.display = "block";
        updateScroll();
    }, 1000); // wait 1 second
    msg_ind = 11;
}

function getInputValue(){
    var textinput = document.getElementById("myInput");
    var chatbubble = document.getElementById("query"+msg_ind);
    var botbubble = document.getElementById("reply"+msg_ind);

    chatbubble.innerHTML = textinput.value;
    chatbubble.style.display = "block";
    updateScroll();
    //botbubble.innerHTML = getAnswer(textinput.value); // Preset response
    textinput.value = "";

    setTimeout(function () {
        botbubble.style.display = "block";
        updateScroll();
    }, 1000); // wait 1 second
    msg_ind += 1;

    if (msg_ind == 9) {
        document.getElementById("query9").style.display = "block";
    }
    
}

function updateScroll(){
    var element = document.getElementById("chatwindow");
    element.scrollTop = element.scrollHeight;
}

function getAnswer(query) {
    if (query.indexOf("Hi") > -1 || query.indexOf("Hello") > -1) {
        return "It's nice to see you! How is your session going today?"
    }
    else if (query.indexOf("chord") > -1) {
        return "I think this video (https://www.youtube.com/watch?v=ecPzu9sTKbo) might help.";
    }
    else if (query.indexOf("speed") > -1) {
        return "Since your goal is to “finish the verse and chorus”, you could skip to the learn the chorus first and try speed up the verse next time.";
    }
    else if (query.indexOf("fingerpicking") > -1) {
        return "This video (https://www.youtube.com/watch?v=ecPzu9sTKbo) teaches the same song but in the fingerpicking style."
    }
    else if (query.indexOf("Thank") > -1) {
        return "You're welcome!"
    }
    else {
        return "I don't have an advice for this. Consider posting your question in the comment section of the video."
    }
}

function openForm() {
    document.getElementById("chatbot").style.display = "block";
    document.getElementById("openchat").style.display = "none";
}

function closeForm() {
    document.getElementById("chatbot").style.display = "none";
    document.getElementById("openchat").style.display = "block";
}