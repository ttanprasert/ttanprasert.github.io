const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const condition = parseInt(urlParams.get('c')); // condition 1: single-agent, condition 2: multi-agent (three)
const topic = parseInt(urlParams.get('t')); // topic 1: Hume, topic 2: Mill
const ID = urlParams.get('ID');
const username = urlParams.get('n');
const part1 = urlParams.get('p');
const part2 = urlParams.get('q');
console.log(condition, topic);

const API_KEY = "sk-" + part1 + part2;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const namelist = ["Charlie", "Daniel", "Jordan"];
const numPeer = 3; // set the number of virtual peer characters
const numRnd = 3; // set the number of rounds the user has to talk to peers before they start to fill in the worksheet
const endRnd = 7; // set the number of rounds the user has to talk to peers before they end the activity
messages = [];
var dialogue = "";
var countTyping = 0;
var turn = 0;
var rnd = 0;
var startTimer = 0;

function setup() {
  // execute on page load
  document.getElementById("debateTopic" + topic).style.display = "block";
  document.getElementById("message-input").disabled = true;
  //pickPersonas();
  if (condition == 1) {
    messages.push({"role": "system", "content": "You will act as a university student called Alex. Alex is a philosophy major, and they are working with the user, " + username + ", a fellow student, to brainstorm a debate stance and arguments from the following prompt: " + document.getElementById("debateTopic" + topic).innerHTML + " The team will work together to brainstorm the thesis statement of the essay and come up 3 evidence-based arguments to support the thesis, while referring to the prompt, whether to agree or disagree, for any relevant information on the topic. Alex has an opposite stance from " + username + " on the debate topic, though, they don't know what " + username + "thinks about the topic yet, so their first message will be to ask for " + username + "'s opinions, so that she can take the opposite stance. She will be likely to find the downside of their suggestions and push for what they thinks is right. They persuades " + username + " not by preaching their opinions but by framing their arguments to align with " + username + "'s values. Your response should take the form of 'Alex: <message>'. Keep each message short and casual. No more than 50 words. The two team members should have a quick back-and-forth with each other."});
    document.getElementById("chatorder").style.display = "none";
    document.getElementById("chatwindow").style.height = "calc(100% - 230px)";
  }
  else {
    messages.push({"role": "system", "content": "You will act as 3 university students called Charlie, Daniel, and Jordan. These 3 students are philosophy majors, and they are working with the user, " + username + ", a fellow student, to brainstorm a debate stance and arguments from the following prompt: " + document.getElementById("debateTopic" + topic).innerHTML + " The team will work together to brainstorm the thesis statement of the essay and come up 3 evidence-based arguments to support the thesis, while referring to the prompt, whether to agree or disagree, for any relevant information on the topic. The 3 people that you will be acting as should have diverse backgrounds and opinions, so they are most likely to find the downside of others' suggestions and push for what they think is right. They persuade others not by preaching their opinions but by framing their arguments to align with others' values.  Charlie agrees with the debate prompt. Daniel disagrees. Jordan is neutral and will need to be persuaded by Charlie, Daniel, and " + username + ". Your response should take the form of <student's name>: <message>. Only one message (one person) at a time. The group members will take turn to speak in a fixed order: Charlie, Daniel, Jordan, then " + username + ". Every member should contribute ideas and insights, so if " + username + "doesn't contribute enough, the peer students should prompt them to engage. Keep each message short and casual. No more than 50 words. The four team members should have a quick back-and-forth with each other."});
  }
}

function start() {
  document.getElementById("startButton" + topic).style.display = "none";
  sendMessage("", false, true);
  setTimeout('sendAIMessage();', 4000);
}

function next() {
  messages.push({role: "user", content: "NEXT"});
  sendMessage("", false, true);
  setTimeout('sendAIMessage();', 4000);
}

function collapse(ele) {
  if (ele == 1) {
    var contentClicked = document.getElementById("instContent");
    var contentOther = document.getElementById("promptContent");
    var buttonClicked = document.getElementById("instButton");
    var txt = "Activity instruction";
  } else {
    if (startTimer == 0) {
      startTimer = 1;
      document.getElementById("timer").style.color = "navy";
      countdown( "timer", 20, 0 );
    }
    var contentClicked = document.getElementById("promptContent");
    var contentOther = document.getElementById("instContent");
    var buttonClicked = document.getElementById("promptButton");
    var txt = "Debate prompt";
  }
  if (contentClicked.style.display === "block") {
    contentClicked.style.display = "none";
    buttonClicked.innerHTML = "<h2><i class='fa fa-plus'></i> "+ txt + "</h2>";
    if (contentOther.style.display === "block") {
      contentOther.style.maxHeight = "calc(100% - 135px)";
    }
  } else {
    contentClicked.style.display = "block";
    buttonClicked.innerHTML = "<h2><i class='fa fa-minus'></i> "+ txt + "</h2>";
    if (contentOther.style.display === "block") {
      contentClicked.style.maxHeight = "calc(50% - 70px)";
      contentOther.style.maxHeight = "calc(50% - 70px)"; 
    } else {
      contentClicked.style.maxHeight = "calc(100% - 135px)";
    }
  }
}

function checkMessage(message) { // not used
    // check format <name>:<message>
    var tempArray = message.split(": ");
    if (namelist.includes(tempArray[0]) == false) {
        // regenerate with an extra instruction about the format of the output
        messages.push({"role": "system", "content": "Remember to generate the output with the format <name>: <message>"});
        sendAIMessage();
    }
    // check turn-taking
    if (namelist[turn] != tempArray[0]) {
        messages.push({"role": "system", "content": "Remember to generate the output in the order of Will, Daniel, Jordan, then " + username + ", so the next one to speak should be " + namelist[turn]});
        sendAIMessage();
    }
}

function sendMessage(message, itsMe, bubble) {

  var messageList = document.getElementById("chatwindow");

  var messageBlock = document.createElement("div");
  messageBlock.classList.add("chatBubble");

  var newMessage = document.createElement("div");
  newMessage.classList.add("chatMessage");

  // Append CSS classes for avatar and message block here.
  if(itsMe)
  {
    messageBlock.classList.add("me");
    newMessage.classList.add("me");
    newMessage.classList.add("meMessage");
    newMessage.innerHTML = message;
    messages.push({role: "user", content: message});
    dialogue = dialogue.concat(username + ": " + message + "\n");
    rnd += 1;
  }
  else
  {
    // NEW TRY
    var newWrapper = document.createElement("span");
    newWrapper.classList.add("wrapper");

    const tempArray = message.split(": ");

    var avatar = document.createElement("img");
    avatar.classList.add("chatProfile");
    avatar.classList.add("notme");
    
    var name = document.createElement("div");
    name.classList.add("chatName");

    if (condition == 1) {
      avatar.src = "personas/Alex.jpg";
      name.innerHTML = "Alex";
    } else { // circle through the character according to the list order
      avatar.src = "personas/" + namelist[turn % numPeer] + ".jpg";
      name.innerHTML = namelist[turn % numPeer];
    }
    
    messageBlock.classList.add("notme");
    newMessage.classList.add("notme");
    newMessage.classList.add("notmeMessage");

    if(bubble) {
        // chat's bubble case
        messageBlock.id = "typing" + countTyping.toString();
        countTyping += 1;
        var typing = document.createElement("div");
        typing.classList.add("typing");
        var dot1 = document.createElement("div");
        dot1.classList.add("dot");
        var dot2 = document.createElement("div");
        dot2.classList.add("dot");
        var dot3 = document.createElement("div");
        dot3.classList.add("dot");
        typing.appendChild(dot1);
        typing.appendChild(dot2);
        typing.appendChild(dot3);
        newMessage.appendChild(typing);
    } else {
        // chatbot's message case
        
        if (countTyping > 0) {
            document.getElementById("typing" + (countTyping-1).toString()).style.display = "none";
        }
        newMessage.innerHTML = message.slice(tempArray[0].length+2);
        messages.push({role: "assistant", content: message});
        dialogue = dialogue.concat(message + "\n");
        turn += 1;

        // For multi-agent condition: disable the textbox while the virtual peers are having their turns
        if (condition == 2) {
          if (turn % numPeer == 0) {
              document.getElementById("message-input").disabled = false;
          } else {
              document.getElementById("message-input").disabled = true;
          }
        } else {
          if (turn == 1) {
            // enable after the first message from the chatbot
            document.getElementById("message-input").disabled = false;
          }
        }
    }
  }
    
  // add everything to bubble
  if(itsMe) {
    messageBlock.appendChild(newMessage);
  } else {
    newWrapper.appendChild(name);
    newWrapper.appendChild(newMessage);
    messageBlock.appendChild(avatar);
    messageBlock.appendChild(newWrapper);
  }

  // Add bubble to chat window
  messageList.appendChild(messageBlock);
  messageList.scrollTop = messageList.scrollHeight;

  // prompt the next character in the order after 1 second wait
  if (condition == 2 && turn % numPeer != 0 && bubble == false) {
      setTimeout('next();', 1000);
  }

  // after the user talks for numRnd rounds, enable the worksheet
  if (rnd == numRnd) {
    document.getElementById("thesis").disabled = false;
    document.getElementById("arg1-topic").disabled = false;
    document.getElementById("arg1-evidence").disabled = false;
    document.getElementById("arg1-connect").disabled = false;
    document.getElementById("arg2-topic").disabled = false;
    document.getElementById("arg2-evidence").disabled = false;
    document.getElementById("arg2-connect").disabled = false;
    document.getElementById("arg3-topic").disabled = false;
    document.getElementById("arg3-evidence").disabled = false;
    document.getElementById("arg3-connect").disabled = false;
  }

  // after the user talks for endRnd rounds, enable the download button
  if (rnd == endRnd) {
    document.getElementById("download").disabled = false;
  }
}

// get text from user here
var message = document.getElementById("message-input");
message.addEventListener("keypress", function(event) {
  var key = event.which || event.keyCode;
  if(key === 13 && this.value.trim() !== "")
  {
    sendMessage(this.value, true, false); // display user's message
    sendMessage("", false, true); // create typing bubble
    sendAIMessage();
    this.value = ""; // clear input textbox
    return false;
  }
});

async function sendAIMessage()
{
  try {
    // Fetch the response from the OpenAI API with the signal from AbortController
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.6,
        max_tokens: 70,
      }),
    });

    const data = await response.json();
    sendMessage(data.choices[0].message.content, false, false);
  } catch (error) {
    console.error("Error:", error);
    sendMessage("Error occurred while generating.", false);
  }
}

function getmsg() // accumulate all data for export
{
  var conv = "";
  
  conv += "Condition: " + condition + "\nTopic: " + topic + "\n";
  conv += "Thesis statement: " + document.getElementById("thesis").value + "\n";
  conv += "Arg1-topic: " + document.getElementById("arg1-topic").value + "\n";
  conv += "Arg1-evidence: " + document.getElementById("arg1-evidence").value + "\n";
  conv += "Arg1-connect: " + document.getElementById("arg1-connect").value + "\n";
  conv += "Arg2-topic: " + document.getElementById("arg2-topic").value + "\n";
  conv += "Arg2-evidence: " + document.getElementById("arg2-evidence").value + "\n";
  conv += "Arg2-connect: " + document.getElementById("arg2-connect").value + "\n";
  conv += "Arg3-topic: " + document.getElementById("arg3-topic").value + "\n";
  conv += "Arg3-evidence: " + document.getElementById("arg3-evidence").value + "\n";
  conv += "Arg3-connect: " + document.getElementById("arg3-connect").value + "\n";
  conv += "Dialogue:\n" + dialogue;
  download(ID + "-c" + condition + "-t" + topic + ".txt", conv);
}

function download(filename, text) { // automatically download the txt file
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
    document.body.removeChild(element);
    alert("Your data has been exported as file: " + filename + ". Please go back to Qualtrics page and upload it there!");
}

function countdown( elementName, minutes, seconds )
{
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits( n )
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            element.innerHTML = "Time is up!";
            element.style.color = "#800808";
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = document.getElementById( elementName );
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}
