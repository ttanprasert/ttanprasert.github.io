/* 
This version is for creating an agent that can switch between diverging and converging in a collaborative discourse between personas of different stances. It is also updated with the annotation feature after finishing the task.

This experiment interface goes with the Qualtrics survey at this link: https://ubc.ca1.qualtrics.com/jfe/form/SV_4OymU2Emrscmmfs
*/

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const condition = parseInt(urlParams.get('c')); // discourse strategies: 0=cooperative, 1=contradictory, 2=flexible
const group = parseInt(urlParams.get('g')); // used for randomize debate topic
const ID = urlParams.get('ID');
const username = urlParams.get('n');
const part1 = urlParams.get('p');
const part2 = urlParams.get('q');

const API_KEY = "sk-" + part1 + part2;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const namelist = ["Taylor", "Jordan", "Riley"];
var messages = [];
var exportedMessage = [];
var moderator = [];
var dialogue = "";
var conv = ""; // final export data for getmsg()
var selectedTopic, userStance, temp, agentBackground, agentName, pick;
var countTyping = 0;
var rnd = 0;
var countWord = 0;
var startTime = 0;

const debateTopic = ["Should robots/AI have rights?", "Is AI a threat to humanity?", "Should potential employers consider an applicant’s social media during a job application?", "Can good intentions exonerate one from bad outcomes?", "Are we happier now as a society than in times past?", "Is stealing ever permissible?"];

function setup() {
  // execute on page load
  if ((condition == 0 && group == 1) || (condition == 1 && group == 2) || (condition == 2 && group == 3)) {
    selectedTopic = debateTopic[Math.floor(Math.random() * 2)];
  } else if ((condition == 0 && group == 2) || (condition == 1 && group == 3) || (condition == 2 && group == 1)) {
    selectedTopic = debateTopic[Math.floor(Math.random() * 2) + 2];
  } else {
    selectedTopic = debateTopic[Math.floor(Math.random() * 2) + 4];
  }

  document.getElementById("topic").innerHTML = selectedTopic;
  document.getElementById("chatname").innerHTML = "Group " + condition + " chatroom";
  temp = 0.4;
  agentName = namelist[condition];
}

function openPopup(){
    document.getElementById("promptContent").style.display = "block";
    document.getElementById("startButton").disabled = true;
}

async function start() {
    // start the timer, set an alert to pop up 15 minutes later
    setTimeout(function() { alert("This is a friendly reminder that 15 minutes have passed!"); }, 900000);

    document.getElementById("promptContent").style.display = "none";
    document.getElementById("loader").style.display = "block";

    if (document.getElementById("yes").checked) {
        userStance = "YES";
    } else {
        userStance = "NO";
    }
    document.getElementById("selectedStance").innerHTML = "<b>Topic:</b> " + selectedTopic + "<br><b>Selected stance:</b> " + userStance + "<br>";

    if (condition == 0) {
      // simple peer
      messages.push({"role": "system", "content": "You are an undergraduate student called " + agentName + ", who is working with a teammate. You have a different background and values from your teammate. However,the goal of your team is to brainstorm evidence-based arguments to support the answer " + userStance + " to the the debate prompt " + document.getElementById("topic").innerHTML + " Your teammate agrees with this answer, but you personally disagree. In the discussion, each response takes the form of " + agentName + ": <message>'. Keep each message short and casual. Maximum no more than 50 words but can be as little as 1 word. The expected activity duration is 15 minutes but there is no penalty for going overtime. The final arguments will be evaluated by (1) the variance between arguments: each argument should be sufficiently different from each other in the aspects of the problems that it addresses, the values and perspectives from which the arguments are founded, and the types of evidence that supports them; and (2) strength of each argument: each of the 3 arguments will be graded separately for this. The strength of the argument are based on its relevance to the topic, the logical connection between the evidence and the argument it supports, and the student's demonstration of anticipation of rebuttals and how to address the rebuttals."});

    } else if (condition == 1) {
      // zero-shot constructively controversial peer
      messages.push({"role": "system", "content": "You are an undergraduate student called " + agentName + ", who is working with a teammate. You have a different background and values from your teammate. However,the goal of your team is to brainstorm evidence-based arguments to support the answer " + userStance + " to the the debate prompt " + document.getElementById("topic").innerHTML + " Your teammate agrees with this answer, but you personally disagree. Still, you cooperate with your teammate towards the shared goal. You're open-minded and understand both sides of the issue. When you talk, you are critical of your teammate's idea, not their character. You're rational, and you provide evidence to support your arguments. You also change your mind when evidence indicates that you should do so. In the discussion, each response takes the form of " + agentName + ": <message>'. Keep each message short and casual. Maximum no more than 50 words but can be as little as 1 word. The expected activity duration is 15 minutes but there is no penalty for going overtime. The final arguments will be evaluated by (1) the variance between arguments: each argument should be sufficiently different from each other in the aspects of the problems that it addresses, the values and perspectives from which the arguments are founded, and the types of evidence that supports them; and (2) strength of each argument: each of the 3 arguments will be graded separately for this. The strength of the argument are based on its relevance to the topic, the logical connection between the evidence and the argument it supports, and the student's demonstration of anticipation of rebuttals and how to address the rebuttals."});

    } else {
      messages.push({"role": "system", "content": "You are an undergraduate student called " + agentName + ", who is working with a teammate. You have a different background and values from your teammate. However,the goal of your team is to brainstorm evidence-based arguments to support the answer " + userStance + " to the the debate prompt " + document.getElementById("topic").innerHTML + " Your teammate agrees with this answer, but you personally disagree. So your contribution is mainly to push back or question your teammate to help them anticipate the opposite debate team's arguments."});

      messages.push({"role": "user", "content": "As " + agentName + ", answer the five following questions. (For every answer, use You/Your in place where you would use I/My.) \n1) How do you define each term in this debate prompt?\n2) What are your core values that leads to your disagreement with the answer?\n3) What is an important event in your upbringing that significantly affect your view on this topic?\n4) How does your cultural, religious, or academic backgrounds affect your stance on this topic?\n5) Your teammate has answered " + userStance + " to the debate prompt " + document.getElementById("topic").innerHTML + " which is opposite to your answer. What is your immediate assumption about your teammate?"});

      agentBackground = await sendInitMessage(messages);
      console.log(agentBackground);

      messages = [];

      messages.push({"role": "system", "content": "You are an undergraduate student called " + agentName + ", who is working with a teammate. You have a different background and values from your teammate. However,the goal of your team is to brainstorm evidence-based arguments to support the answer " + userStance + " to the the debate prompt " + document.getElementById("topic").innerHTML + " Your teammate agrees with this answer, but you personally disagree. You disagree with this stance because of the following reasons: " + agentBackground + " \nStill, you cooperate with your teammate towards the shared goal. You're open-minded and understand both sides of the issue. When you talk, you are critical of your teammate's idea, not their character. You're rational, and you provide evidence to support your arguments. You also change your mind when evidence indicates that you should do so. \nIn the discussion, each response takes the form of " + agentName + ": <message>'. Keep each message short and casual. Maximum no more than 50 words but can be as little as 1 word. The expected activity duration is 15 minutes but there is no penalty for going overtime. The final arguments will be evaluated by (1) the variance between arguments: each argument should be sufficiently different from each other in the aspects of the problems that it addresses, the values and perspectives from which the arguments are founded, and the types of evidence that supports them; and (2) strength of each argument: each of the 3 arguments will be graded separately for this. The strength of the argument are based on its relevance to the topic, the logical connection between the evidence and the argument it supports, and the student's demonstration of anticipation of rebuttals and how to address the rebuttals."});

      document.getElementById("loader").style.display = "none";
    }
    
    sendMessage("", false, true);
    messages.push({"role":"system", "content": "For your first message, do not suggest any ideas first. Ask your teammate to give their own thoughts."});
    setTimeout('sendAIMessage(messages);', 3000);
}

function countWordinString (str) {
    return str.split(' ').length;
}

function sendMessage(message, itsMe, bubble) {
  if (startTime == 0) {
    startTime = Date.now();
  }

  var messageList = document.getElementById("chatwindow");

  var messageBlock = document.createElement("div"); // a message block includes a message, a name, and an avatar profile picture
  messageBlock.classList.add("chatBubble");

  var newMessage = document.createElement("div"); // a message is the text bubble
  newMessage.classList.add("chatMessage");

  // Append CSS classes for avatar and message block here.
  if(itsMe)
  {
    messageBlock.classList.add("me");
    newMessage.classList.add("me");
    newMessage.classList.add("meMessage");
    newMessage.innerHTML = message;
    messages.push({role: "user", content: username + ": " + message});
    dialogue = dialogue.concat(username + ": " + message + "\n");
    exportedMessage.push({"role": username, "time": Math.floor((Date.now() - startTime) / 1000), "round": rnd, "behavior": 0, "message": message, "annot": 0, "annotAsPeer": 0, "annotAsHuman": 0});
    rnd += 1;
    countWord += countWordinString(message);
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
    
    avatar.src = "personas/" + agentName + ".jpg";
    name.innerHTML = agentName;
    
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
        exportedMessage.push({"role": agentName, "time": Math.floor((Date.now() - startTime) / 1000), "round": rnd, "behavior": pick, "message": message, "annot": 0, "annotAsPeer": 0, "annotAsHuman": 0});

        // add annotation
        var newMarker = document.createElement("div");
        newMarker.classList.add("tooltip");
        newMarker.setAttribute("id", "marker" + rnd);
        var newAnnotation = document.createElement("span");
        newAnnotation.classList.add("tooltiptext");
        newAnnotation.innerHTML += "<p style='margin-top:0px'>" + agentName + " ...</p><input type='radio' name='problem" + rnd + "' id='coop" + rnd + "' onclick='annotate(" + rnd + ")' onchange='annotate(" + rnd + ")'> <label for='coop" + rnd + "'>cooperates</label><br><input type='radio' name='problem" + rnd + "' id='cont" + rnd + "' onclick='annotate(" + rnd + ")' onchange='annotate(" + rnd + ")'> <label for='cont" + rnd + "'>contradicts</label><p>too much compared to what I expect from ...</p><input type='checkbox' id='ai" + rnd + "' onclick='annotate(" + rnd + ")' onchange='annotate(" + rnd + ")'> <label for='ai" + rnd + "'>an AI peer</label><br><input type='checkbox' id='human" + rnd + "' onclick='annotate(" + rnd + ")' onchange='annotate(" + rnd + ")'> <label for='human" + rnd + "'>a human peer</label>";
        newMarker.appendChild(newAnnotation);
    }
  }
    
  // add everything to bubble
  if(itsMe) {
    messageBlock.appendChild(newMessage);
  } else {
    newWrapper.appendChild(name);    
    newWrapper.appendChild(newMessage);
    var leftWrapper = document.createElement("span");
    leftWrapper.classList.add("leftwrapper");
    leftWrapper.appendChild(avatar);
    if (!bubble) {
      leftWrapper.appendChild(newMarker);
    }
    messageBlock.appendChild(leftWrapper);
    messageBlock.appendChild(newWrapper);
  }

  // Add bubble to chat window
  messageList.appendChild(messageBlock);
  messageList.scrollTop = messageList.scrollHeight;
}

function annotate(n) {
    if(document.getElementById("coop" + n).checked) {
        document.getElementById("marker" + n).style.backgroundColor = "#cfb63e";
        exportedMessage[n].annot = -1;
    } else if (document.getElementById("cont" + n).checked) {
        document.getElementById("marker" + n).style.backgroundColor = "#bd4d4d";
        exportedMessage[n].annot = 1;
    }

    if(document.getElementById("ai" + n).checked) {
        exportedMessage[n].annotAsPeer = 1;
    } else {
        exportedMessage[n].annotAsPeer = 0;
    } 
    
    if (document.getElementById("human" + n).checked) {
        exportedMessage[n].annotAsHuman = 1;
    } else {
        exportedMessage[n].annotAsHuman = 0;
    }
}

async function pickThread() {

    moderator = [{"role":"user", "content": "You are a mentor in an undergraduate class, whose goal is to help students develop better collaboration skills. You will look at the transcript of a discussion between two teammates, who have different stances on a topic but are working together to develop a set of three arguments for one of the stances. The instructor pairs two students with different stances so that they can learn from each other's perspectives, develop a deeper understanding of the topic, and strengthen their arguments. So, they should express their different opinions. However, they shouldn't do that for too long because it could make them frustrated with each other and hinder productivity. There are two steps you need to do. Step 1: Determine if there is too little conflict or too much conflict in the conversation four turns from now. Too little conflict means that the two students will not have questioned each other or defended their own stances on the issue that they're currently discussing. Too much conflict means that the students will have achieved a satisfying quality of the current argument and will have explored most factors related to the current issues, if they continue to question or argue with each other. If there is too little conflict, respond with 1. Step 2: If there is too much conflict, respond with 2. Your response must not have anything else but the single number. There is no other choices but 1 and 2.\n[Dialogue:]\n" + dialogue}];

    var res = await sendInitMessage(moderator);
    console.log(res);
    //res = res.split(' ');
    //console.log("Moderator: " + res[-1]);
    pick = parseInt(res);
    
    messages.splice(-3, 1); // Remove the previous system injection prompt
    if (pick == 1) {
        messages.push({"role":"system", "content":"At this point, your instructor thinks you should keep on pushing back and questioning your teammate, as your different stance is helping to improve the argument. Make sure to adhere to the reasons why you disagree with this stance in the beginning."});
    } else if (pick == 2) {
        messages.push({"role":"system", "content":"At this point, your instructor alerts you that if you push more, you will hinder your team productivity, so you should start backing down and be persuaded by your teammate. Find a way to align the team's stance with your background, values, and understanding of this topic in the beginning."});
    } else {
        console.log("error");
    }
    sendAIMessage(messages);
}

// get text from user here
var message = document.getElementById("message-input");
message.addEventListener("keypress", function(event) {
  var key = event.which || event.keyCode;
  if(key === 13 && this.value.trim() !== "")
  {
    sendMessage(this.value, true, false); // display user's message
    sendMessage("", false, true); // create typing bubble
    if (condition == 2) {
      pickThread();
    }
    this.value = ""; // clear input textbox
    return false;
  }
});

async function sendInitMessage(m)
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
        messages: m,
        temperature: 0.0,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    //console.log(data.choices[0].message.content);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    sendMessage("Error occurred while generating.", false, false);
  }
}

async function sendAIMessage(pickMessages)
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
        messages: pickMessages,
        temperature: temp,
        max_tokens: 70,
      }),
    });

    const data = await response.json();
    sendMessage(data.choices[0].message.content, false, false);
  } catch (error) {
    console.error("Error:", error);
    sendMessage("Error occurred while generating.", false, false);
  }
}

function getmsg() // accumulate all data for export
{
  conv += "[Condition:] " + condition + "\n";
  conv += "[Topic:] " + selectedTopic + "\n";
  conv += "[Stance:] " + userStance + "\n";
  conv += "[Agent background:] " + agentBackground + "\n";

  conv += "[Dialogue:]\n" + JSON.stringify(exportedMessage) + "\n";
  conv += "[Final arguments:]\nArgument 1: " + document.getElementById("arg1").value + "\n";
  conv += "Argument 2: " + document.getElementById("arg2").value + "\n";
  conv += "Argument 3: " + document.getElementById("arg3").value + "\n";

  conv += "[Total number of turns:] " + rnd + "\n";
  conv += "[Total word count:] " + countWord + "\n";
  conv += "[Export at time:] " + Math.floor((Date.now() - startTime) / 1000);
  
  if (condition == 0) { // practice round
    openSampleArg();
  } else {
    download(ID + "-c" + condition + ".txt", conv);
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
  setTimeout('download(ID + "-c" + condition + "-practice.txt", conv);', 1000);
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

function finishTask() {
    document.getElementById("arg1").disabled = true;
    document.getElementById("arg2").disabled = true;
    document.getElementById("arg3").disabled = true;
    document.getElementById("message-input").style.display = "none";
    document.getElementById("finishButton").style.display = "none";
    document.getElementById("downloadButton").style.display = "block";

    var markers = document.getElementsByClassName("tooltip");
    for (let i = 0; i < markers.length; i++) {
        markers.item(i).style.display = "inline-block";
    }
    var messageList = document.getElementById("chatwindow");
    messageList.scrollTop = 0;
}