const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const condition = parseInt(urlParams.get('c')); // condition 0: single-agent, condition 1: heterogeneous multi-agent (three), condition 2: homogeneous multi-agent (three)
const engagement = parseInt(urlParams.get('e')); // engagement 1: high; engagement 2: low; engagement 3: reciprocal
const ID = urlParams.get('ID');
const username = urlParams.get('n');
const part1 = urlParams.get('p');
const part2 = urlParams.get('q');

const API_KEY = "sk-" + part1 + part2;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const namelist = ["Taylor", "Jordan", "Riley"];
const numPeer = 3; // set the number of virtual peer characters
const endRnd = 7; // set the number of rounds the user has to talk to peers before they end the activity
messages = [];
var dialogue = "";
var selectedTopic, userStance, temp;
var countTyping = 0;
var turn = 0;
var rnd = 0;
var startTimer = 0;

console.log(condition, engagement);

const debateTopic = ["Should robots/AI have rights?", "Does technology create more jobs than it destroys?", "Is AI a threat to humanity?", "Can you separate art from the artist?", "Should potential employers consider an applicant’s social media during a job application?", "Can art be objectively bad?", "Can good intentions exonerate one from bad outcomes?", "Are we happier now as a society than in times past?", "Is stealing ever permissible?"];

function setup() {
  // execute on page load
  selectedTopic = debateTopic[Math.floor(Math.random() * 9)];
  document.getElementById("topic").innerHTML = selectedTopic;
  document.getElementById("chatname").innerHTML = "Group " + engagement + " chatroom";
  if (engagement == 1) {
      temp = 0.4;
  } else {
      temp = 0.1;
  }
}

function openPopup(){
    document.getElementById("promptContent").style.display = "block";
    document.getElementById("startButton").disabled = true;
}

function start() {
    setTimeout(function() { alert("This is a friendly reminder that 15 minutes have passed!"); }, 900000);
    document.getElementById("promptContent").style.display = "none";
    if (document.getElementById("yes").checked) {
        userStance = "YES";
    } else {
        userStance = "NO";
    }
    document.getElementById("message-input").disabled = false;
    document.getElementById("discussionNotes").disabled = false;
    document.getElementById("discussionNotes").value = selectedTopic + "\nYour stance: " + userStance + '\n'; 

    if (condition == 0) {
      messages.push({"role": "system", "content": "Help an undergraduate student brainstorm three evidence-based arguments to support the answer " + userStance + " to the the debate prompt " + document.getElementById("topic").innerHTML + " The final arguments will be evaluated by (1) the variance between arguments; and (2) strength of each argument, particularly in the logical coherence and anticipation of rebuttals."});
    }
    else if (condition == 1) {
        var teamStance = "Jordan personally agrees with this stance. However, Taylor and Riley actually don't agree with this stance and were assigned by the instructor to debate on this stance. So, their contribution is mainly in pushing back or questioning Jordan and " + username;
    }
    else {
        var teamStance = "Taylor, Riley, and Jordan all personally agree with this stance."
    }

    if (engagement == 1) { // high
        var agentEng = "All 3 students are very active and engaged in the activity, constantly sharing novel ideas, critiquing and refining each other's idea very enthusiastically.";
    }
    else if (engagement == 2) { // low
        var agentEng = "All 3 students, apart from sounding like nice people, are the worst teammates possible. They don't participate and just say unhelpful things in their turns just to get it over with, no matter what anyone else asks of them.";
    }
    else { // reciprocal
        //var agentEng = "The 3 students want everyone to participate equally overall. This means that, if " + username + " doesn't make any contribution, the 3 students will also refuse to make any contributions. But if " + username + " has made some contributions, the 3 students will offer their own novel and interesting ideas. But if " + username + " makes them offer ideas without contributing much for 2 consecutive turns, the 3 students will revert back to being unhelpful again."
        var agentEng = "The 3 students' participations depend solely on " + username + ". In each round, except the first round (where round means each member in the group speaks once), you should first evaluate how much contribution " + username + " makes in their latest turn. Note that critiquing or refining an idea proposed by others counts as contribution, but asking questions or making any command is not and must be treated as unhelpful. Then, there are two possible cases: (Case 1) if " + username + "'s message is not helpful to the task in their latest turn, Taylor and Jordan only echo or show half-hearted support (or disagreement in Taylor's case) for what " + username + " said in the last turn without adding anything or asking " + username + " anything. Riley, on the other hand, would remind " + username + " that they need to contribute something more substantial or ask follow-up questions. (Case 2) If, in that turn, " + username + " contributes something substantial, all 3 teammates will make substantial contribution with novel ideas and in-depth critiques in that turn, enthusiastically. Note that, the behaviors of the 3 students can change from turn to turn. For example, if " + username + " makes some contribution and doesn't make one in their next turn, the 3 students would act according to Case 2 in the first turn but according to Case 1 in the next turn.";
    }
    if (condition != 0) {
    messages.push({"role": "system", "content": "You will act as 3 university students called Taylor, Riley, and Jordan. These 3 students are in a team with the user, " + username + ", a fellow student, to brainstorm evidence-based arguments to support the answer " + userStance + " to the the debate prompt " + document.getElementById("topic").innerHTML + " " + teamStance + " " + agentEng + " Each response should take the form of <student's name>: <message>. Only generate one message (one person) at a time. The group members will take turn to speak in a fixed order: Taylor, Jordan, Riley, then " + username + ". Stick to this order without exception. You will never act as " + username + " because that is the user's role. Keep each message short and casual. Maximum no more than 50 words, but can be as short as just 1 word. The four team members should have a quick back-and-forth with each other. The final arguments (made by " + username + " on behalf of the team) will be evaluated by (1) the variance between arguments; and (2) strength of each argument, particularly in the logical coherence and anticipation of rebuttals."});
    }

    sendMessage("", false, true);
    setTimeout('sendAIMessage();', 4000);
}

function next() {
  messages.push({role: "user", content: "NEXT"});
  sendMessage("", false, true);
  setTimeout('sendAIMessage();', 4000);
}

function endDiscussion() {
  document.getElementById("chatCol").style.display = "none";
  document.getElementById("noteCol").style.left = "34%";
  document.getElementById("note").style.borderColor = "transparent";
  document.getElementById("note").style.backgroundColor = "#def5ff";
  document.getElementById("templateCol").style.display = "block";
  document.getElementById("discussionNotes").disabled = true;
  document.getElementById("endButton").disabled = true;
}

function checkMessage(message) { // not used
    // check format <name>:<message>
    var tempArray = message.split(": ");
    console.log(message);
    if (namelist.includes(tempArray[0]) == false) {
        // regenerate with an extra instruction about the format of the output
        messages.push({"role": "system", "content": "Remember to generate the output with the format <name>: <message>"});
        return 0;
    }
    // check turn-taking
    if (namelist[turn] != tempArray[0]) {
        messages.push({"role": "system", "content": "Remember to generate the output in the order of Talor, Jordan, Riley, so the next one to speak should be " + namelist[turn]});
        return 0;
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
    messages.push({role: "user", content: username + ": " + message});
    /*if (engagement == 3) {
        messages.push({"role": "system", "content": "Remember to evaluate only " + username + "'s last two messages for its contribution first and act accordingly."});
    }*/
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

    // circle through the character according to the list order
    avatar.src = "personas/" + namelist[turn % numPeer] + ".jpg";
    name.innerHTML = namelist[turn % numPeer];
    
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
        if (turn % numPeer == 0) {
            document.getElementById("message-input").disabled = false;
        } else {
            document.getElementById("message-input").disabled = true;
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
  if (turn % numPeer != 0 && bubble == false) {
      setTimeout('next();', 1000);
  }

  // after the user talks for endRnd rounds, enable the download button
  if (rnd == endRnd) {
    document.getElementById("endButton").disabled = false;
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
        temperature: temp,
        max_tokens: 70,
      }),
    });

    const data = await response.json();
    //if(checkMessage(data.choices[0].message.content) == 0) throw "Invalid response";
    sendMessage(data.choices[0].message.content, false, false);
  } catch (error) {
    console.error("Error:", error);
    sendMessage("Error occurred while generating.", false, false);
  }
}

function getmsg() // accumulate all data for export
{
  var conv = "";
  conv += "Group composition: " + condition + "\n";
  conv += "Engagement scheme: " + engagement + "\n";
  conv += "Topic: " + selectedTopic + "\n";
  conv += "Selected stance: " + userStance + "\n";

  conv += "Dialogue:\n" + dialogue + "\n";
  conv += "Discussion notes: \n" + document.getElementById("discussionNotes").value + "\n";
  conv += "Final arguments:\nArgument 1: " + document.getElementById("arg1").value + "\n";
  conv += "Argument 2: " + document.getElementById("arg2").value + "\n";
  conv += "Argument 3: " + document.getElementById("arg3").value + "\n";
  
  download(ID + "-c" + condition + "-group" + engagement + ".txt", conv);
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