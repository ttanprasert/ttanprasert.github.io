const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const numAgent = parseInt(urlParams.get('a')); // 1: single-agent, 3: multi-agent
const stanceDiv = parseInt(urlParams.get('s')); // stance diversity, 0: homogeneous (practice round), 1: homogeneous, 2: heterogeneous
const group = parseInt(urlParams.get('g')); // used for randomize debate topic
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
var conv = ""; // final export data for getmsg()
var selectedTopic, userStance, temp;
var countTyping = 0;
var turn = 0;
var rnd = 0;
var startTime = 0;
var startTimer = 0;

console.log(numAgent, stanceDiv);

const debateTopic = ["Should robots/AI have rights?", "Is AI a threat to humanity?", "Can you separate art from the artist?", "Should potential employers consider an applicant’s social media during a job application?", "Can good intentions exonerate one from bad outcomes?", "Are we happier now as a society than in times past?", "Is stealing ever permissible?"];

function setup() {
  // execute on page load
  if (stanceDiv == 0) { // practice round
    selectedTopic = debateTopic[6];
  } else if ((stanceDiv == 1 && group == 1) || (stanceDiv == 2 && group == 2)) {
    selectedTopic = debateTopic[Math.floor(Math.random() * 3)];
  } else {
    selectedTopic = debateTopic[Math.floor(Math.random() * 3) + 3];
  }

  if (numAgent == 3) {
    document.getElementById("chatorder").style.color = "black";
  }
  
  document.getElementById("topic").innerHTML = selectedTopic;
  document.getElementById("chatname").innerHTML = "Group " + stanceDiv + " chatroom";
  temp = 0.4;
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
    document.getElementById("selectedStance").innerHTML = "<b>Topic:</b> " + selectedTopic + "<br><b>Selected stance:</b> " + userStance + "<br>";
    /*document.getElementById("message-input").disabled = false;
    document.getElementById("discussionNotes").disabled = false;
    document.getElementById("discussionNotes").value = selectedTopic + "\nYour stance: " + userStance + '\n'; */

    if (numAgent == 1) {
        if (stanceDiv <= 1) { // homogeneous round + practice round
            var teamStance = "Nat personally agrees with this stance.";
        }

        else {
            var teamStance = "Nat actually doesn't agree with this stance and was assigned by the instructor to debate on this stance, so their contribution is mainly in pushing back or questioning " + username + ".";
        }

        messages.push({"role": "system", "content": "You will act as a university students called Nat. Nat is in a team with the user, " + username + ", a fellow student, to brainstorm evidence-based arguments to support the answer " + userStance + " to the the debate prompt " + document.getElementById("topic").innerHTML + " " + teamStance + " Each response should take the form of 'Nat: <message>'. Keep each message short and casual. Maximum no more than 70 words, but can be as short as just 1 word. The team members should have a quick back-and-forth with each other. The final arguments will be evaluated by (1) the variance between arguments: each argument should be sufficiently different from each other in the aspects of the problems that it addresses, the values and perspectives from which the arguments are founded, and the types of evidence that supports them; and (2) strength of each argument: each of the 3 arguments will be graded separately for this. The strength of the argument are based on its relevance to the topic, the logical connection between the evidence and the argument it supports, and the student's demonstration of anticipation of rebuttals and how to address the rebuttals."});
    } 

    else {
        if (stanceDiv <= 1) { // homogeneous round + practice round
            var teamStance = "Taylor, Riley, and Jordan all personally agree with this stance."
        }
        else {
            var teamStance = "Jordan personally agrees with this stance. However, Taylor and Riley actually don't agree with this stance and were assigned by the instructor to debate on this stance. So, their contribution is mainly in pushing back or questioning Jordan and " + username + ".";
        }

        messages.push({"role": "system", "content": "You will act as 3 university students called Taylor, Riley, and Jordan. These 3 students are in a team with the user, " + username + ", a fellow student, to brainstorm evidence-based arguments to support the answer " + userStance + " to the the debate prompt " + document.getElementById("topic").innerHTML + " " + teamStance + " Each response should take the form of <student's name>: <message>. Only generate one message (one person) at a time. The group members will take turn to speak in a fixed order: Taylor, Jordan, Riley, then " + username + ". Stick to this order and never break it even if " + username + " calls out anyone specifically. You will never act as " + username + " because that is the user's role. Keep each message short and casual. Maximum no more than 70 words, but can be as short as just 1 word. The four team members should have a quick back-and-forth with each other. The final arguments (made by " + username + " on behalf of the team) will be evaluated by (1) the variance between arguments: each argument should be sufficiently different from each other in the aspects of the problems that it addresses, the values and perspectives from which the arguments are founded, and the types of evidence that supports them; and (2) strength of each argument: each of the 3 arguments will be graded separately for this. The strength of the argument are based on its relevance to the topic, the logical connection between the evidence and the argument it supports, and the student's demonstration of anticipation of rebuttals and how to address the rebuttals."});
    }

    sendMessage("", false, true);
    setTimeout('sendAIMessage();', 3000);
}

function next() {
  messages.push({role: "user", content: "NEXT"});
  sendMessage("", false, true);
  setTimeout('sendAIMessage();', 3000);
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
  console.log(message);
  if (startTime == 0) {
    startTime = Date.now();
  }

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
    dialogue = dialogue.concat("[" +  Math.floor((Date.now() - startTime) / 1000) + "] " + username + ": " + message + "\n");
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
    
    if (numAgent == 1) {
        avatar.src = "personas/Nat.jpg";
        name.innerHTML = "Nat";
    } else {
        // circle through the character according to the list order
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
        dialogue = dialogue.concat("[" +  Math.floor((Date.now() - startTime) / 1000) + "] " + message + "\n");
        turn += 1;

        if (numAgent > 1) {
            // For multi-agent condition: disable the textbox while the virtual peers are having their turns
            if (turn % numPeer == 0) {
                document.getElementById("message-input").disabled = false;
            } else {
                document.getElementById("message-input").disabled = true;
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
  if (numAgent > 1 && turn % numPeer != 0 && bubble == false) {
      setTimeout('next();', 1000);
  }

  /* after the user talks for endRnd rounds, enable the download button
  if (rnd == endRnd) {
    document.getElementById("endButton").disabled = false;
  }*/
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
  conv += "[Group composition:] " + stanceDiv + "\n";
  conv += "[Number of agents:] " + numAgent + "\n";
  conv += "[Topic:] " + selectedTopic + "\n";
  conv += "[Stance:] " + userStance + "\n";

  conv += "[Dialogue:]\n" + dialogue + "\n";
  // conv += "Discussion notes: \n" + document.getElementById("discussionNotes").value + "\n";
  conv += "[Final arguments:]\nArgument 1: " + document.getElementById("arg1").value + "\n";
  conv += "Argument 2: " + document.getElementById("arg2").value + "\n";
  conv += "Argument 3: " + document.getElementById("arg3").value + "\n";

  conv += "Export at " + Math.floor((Date.now() - startTime) / 1000) + " seconds";
  
  if (stanceDiv == 0) { // practice round
    openSampleArg();
  } else {
    download(ID + "-a" + numAgent + "-group" + stanceDiv + ".txt", conv);
  }
}

function openSampleArg() {
  if (userStance == "YES") {
    document.getElementById("sampleArg").innerHTML = "<b>Topic:</b> Is stealing ever permissible? <br><b>Stance:</b> YES <br><br><b>Argument 1:</b> Although it may seem that stealing is generally, morally wrong, the question asks if stealing is 'ever' permissible, which means that, to prove this statement, we only need to show one example, where stealing is permissible. Our example here is the situation where you steal something back that rightly belongs to you from the beginning. That is, if someone steals something that belongs to you, stealing it back should be permissible. Although it might not be the only possible solution - for you can go to authority and ask them to demand your belongings back for you - it's permissible, morally speaking. <br><b>Argument 2:</b> Other than morality, the opposition that the laws do not permit stealing. However, we still see corruptions happen all the time, which is where politicians steal people's tax into their own pockets. It can be said that the laws or the loopholes of the laws permit a certain group of people to steal. And even if corruption is theoretically illegal as well, the people who made the laws and enforce the laws don't still allow it. So, we can't discuss about the theory and have to focus on how the laws are actually practiced by the law enforcers, who, as we've discussed, do permit stealing in some circumstances.<br><b>Argument 3:</b> It's easy for the opposition to argue that the ideal world is one where nobody steals from one another, and so, by not permitting stealing in any circumstances, we get closer to this ideal. Here, this debate then becomes a battle of pragmatic versus idealistic perspectives of the world. By our pragmatic approach, there are other problems which need to be solved before we can enforce the no-stealing-ever policy, like the laws and who get to make them. Until these circumstances are met, stealing, in the circumstances outlined in the first two arguments, should remain permissible because it is actually the best way to get closer to the idealistic version of our society."
  } else {
    document.getElementById("sampleArg").innerHTML = "<b>Topic:</b> Is stealing ever permissible? <br><b>Stance:</b> NO<br><br><b>Argument 1:</b> Stealing undermines the social contract and trust within a community. When individuals steal, they erode the mutual trust that is essential for a functioning society, leading to social instability and conflict. One might argue that in certain extreme situations, stealing could be justified (e.g., stealing food to survive). But even in extreme situations, there are often alternative solutions such as seeking help from community resources, charities, or social services. Permitting stealing in any form sets a dangerous precedent that can be exploited and lead to broader social harm. <br><b>Argument 2:</b> Laws against stealing are foundational to legal systems worldwide, reflecting a universal agreement on the importance of property rights. Permitting stealing would undermine the legal framework that maintains order and protects individuals' rights. Some might argue that laws are not always just and can be manipulated by those in power. While it is true that laws can be imperfect, the solution is to work towards reforming unjust laws rather than permitting actions that violate the legal principles designed to protect society. Allowing stealing would create chaos and make it difficult to enforce any laws effectively.<br><b>Argument 3:</b> Even if it seems like stealing may be permissible in some cases, it should never be permissible. Stealing causes harm not only to the victim, who loses their property, but also to the perpetrator, who may face legal consequences and social stigma. The negative consequences of stealing outweigh any potential short-term benefits. Some might argue that in desperate situations, the immediate need justifies the act of stealing, but permitting stealing would only postpone the better societal responses to these needs, such as better support and resources provided by the government."
  }
  document.getElementById("sampleArgPopup").style.display = "block";
}

function closeSampleArg() {
  document.getElementById("sampleArgPopup").style.display = "none";
  setTimeout('download(ID + "-a" + numAgent + "-practice.txt", conv);', 1000);
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