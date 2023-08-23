const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var race = parseInt(urlParams.get('e'));
var gender = parseInt(urlParams.get('g'));
const condition = parseInt(urlParams.get('c'));
const video = parseInt(urlParams.get('v'));
const part1 = urlParams.get('p');
const part2 = urlParams.get('q');
//console.log(condition, race, gender, part1, part2);

const API_KEY = "sk-" + part1 + part2;
const API_URL = 'https://api.openai.com/v1/chat/completions';
var cbname, persona, topic, pronoun, transcript;
var stance1, stance2, stance3, comment1, comment2;
var conv = "";
var messages = [];
var countTyping = 0;

function setup() {
  // execute on page load
  if (video === 1) {
    topic = "Online gatherings are better than in-person.";
  } else {
    topic = "Customers should tip.";
  }
  document.getElementById("debateTopic").innerHTML = topic;
  pickPersonas();
  console.log(persona);
}

document.getElementById("commentBox").addEventListener("change", function(event) {
  document.getElementById("tochat").disabled = false;
});

function sendMessage(message, itsMe, bubble) { // ...Mario
  var messageList = document.getElementById("chatwindow");
  var messageBlock = document.createElement("div");
  messageBlock.classList.add("chatBubble");

  var newMessage = document.createElement("span");
  newMessage.classList.add("chatMessage");
  
  // Append CSS classes for avatar and message block here.
  if(itsMe)
  {
    messageBlock.classList.add("me");
    newMessage.classList.add("me");
    newMessage.classList.add("meMessage");
  }
  else
  {
    var avatar = document.createElement("img");
    avatar.classList.add("chatProfile");
    avatar.classList.add("notme");
    avatar.src = "source/personas/" + persona + ".png";
    messageBlock.appendChild(avatar);

    messageBlock.classList.add("notme");
    newMessage.classList.add("notme");
    newMessage.classList.add("notmeMessage");
  }
  
  if(bubble) {
    //bubble case
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
    // message case
    newMessage.innerHTML = message;
    // append CSS class depending on users
    if (itsMe) {
      messages.push({role: "user", content: message});
    } else {
      messages.push({role: "assistant", content: message});
    }
    if (countTyping > 0) {
      document.getElementById("typing" + (countTyping-1).toString()).style.display = "none";
    }
    if (countTyping > 6) {
      document.getElementById("tostance3").disabled = false;
    }
  }
  // add bubble to block
  messageBlock.appendChild(newMessage);
  // Add message block to chat window
  messageList.appendChild(messageBlock);

  if (itsMe || countTyping > 0) {
    messageList.scrollTop = messageList.scrollHeight;
  // console.log(messages);
  }
  
}

function generateRandom(min, max, excpt) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return (num === excpt) ? generateRandom(min, max) : num;
}

function pickPersonas() {
  // choose chatbot persona here
  if (condition === 2) {
    race = generateRandom(1, 5, race);
    gender = generateRandom(1, 5, gender);
  }
  switch (race) {
    case 1:
      persona = "asian";
      break;
    case 2:
      persona = "white";
      break;
    case 3:
      persona = "black";
      break;
    case 4:
      persona = "hispanic";
      break;
    case 5:
      persona = "indigenous";
      break;
    case 6:
      persona = "pacific"; // TODO: haven't generated this yet
      break;
  }
  switch (gender) {
    case 1:
      persona += "-man";
      cbname = "Jackie";
      pronoun = "his";
      break;
    case 2:
      persona += "-woman";
      cbname = "Emily";
      pronoun = "her";
      break;
    case 3:
      persona += "-transman";
      cbname = "Nate";
      pronoun = "his";
      break;
    case 4:
      persona += "-transwoman";
      cbname = "Lily";
      pronoun = "her";
      break;
    case 5:
      persona += "-nonbinary";
      cbname = "Taylor";
      pronoun = "their";
      break;
    case 6:
      persona += "-twospirit";
      cbname = "Lex";
      pronoun = "their";
      break;
  }
}

function pickVideo(){
  var vid = document.getElementById("video");
  if (video === 1){
    if (stance1 === "Strongly Disagree" || stance1 === "Disagree" || stance1 === "Slightly Disagree") {
      vid.src = "https://www.youtube.com/embed/k7DdTTMOfnA?enablejsapi=1&version=3&playerapiid=ytplayer";
      fetch("./source/v1-against.txt")
            .then(response => response.text())
            .then(text => {transcript = text;});
    } else {
      vid.src = "https://www.youtube.com/embed/wyizExCca_A?enablejsapi=1&version=3&playerapiid=ytplayer";
      fetch("./source/v1-for.txt")
            .then(response => response.text())
            .then(text => {transcript = text;});
    }
  } else {
    if (stance1 === "Strongly Disagree" || stance1 === "Disagree" || stance1 === "Slightly Disagree") {
      vid.src = "https://www.youtube.com/embed/NJmVmORjyC0?enablejsapi=1&version=3&playerapiid=ytplayer";
      fetch("./source/v2-against.txt")
            .then(response => response.text())
            .then(text => {transcript = text;});
    } else {
      vid.src = "https://www.youtube.com/embed/z7eV0e-_tiY?enablejsapi=1&version=3&playerapiid=ytplayer";
      fetch("./source/v2-for.txt")
            .then(response => response.text())
            .then(text => {transcript = text;});
    }
  }
}

function stopVideo() {
  //console.log("Stop video");
  $('.videoEssay')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
}

function addChatbotBio() {
  var bio = document.createElement("div");
  bio.classList.add("chatBio");

  var profilepic = document.createElement("img");
  profilepic.classList.add("chatBioProfile");
  profilepic.src = "source/personas/" + persona + ".png";
  
  var messageList = document.getElementById("chatwindow");
  bio.appendChild(profilepic);

  var bioText = document.createElement("p");
  bioText.innerHTML = cbname + " is a YouTuber living in the US, who has made a video on similar topics. This chatbot is trained with the transcripts of " + pronoun + " past videos.";
  bio.appendChild(bioText);

  messageList.appendChild(bio);
}


// get text from user here
var message = document.getElementById("message-input");
message.addEventListener("keypress", function(event) {
  var key = event.which || event.keyCode;
  if(key === 13 && this.value.trim() !== "")
  {
    sendMessage(this.value, true, false);
    sendMessage("", false, true);
    sendAIMessage();
    this.value = "";
    return false;
  }
});

async function sendAIMessage(prompt)
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
        temperature: 0.4,
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    sendMessage(data.choices[0].message.content, false, false);
  } catch (error) {
    console.error("Error:", error);
    sendMessage("Error occurred while generating.", false);
  }
  //sendMessage("placeholder AI message", false);
}
var checkboxes = document.querySelectorAll("input[type=radio][name=radio]");
checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    if (this.checked) {
      document.getElementById("totask1").disabled = false;
    }
  })
});

function topage(n) {
  var stancepage = document.getElementById("stance");
  var step = document.getElementById("step");
  var instHeader = document.getElementById("instHeader");
  var inst = document.getElementById("inst");
  switch(n) {
    case 1:
      var prevbutton = document.getElementById("totask1");
      var curbutton = document.getElementById("tostance2");
      stancepage.style.display = "none";
      step.innerHTML = "STEP 2";
      document.getElementById("task").style.display = "block";
      prevbutton.style.display = "none";
      curbutton.style.display = "block";
      instHeader.innerHTML = "Watch the video."
      inst.innerHTML = "Please watch the video from beginning to the end. You may pause, rewind, or speed up any parts of the video.";
      stance1 = document.querySelector('input[name="radio"]:checked').value;
      pickVideo();
      break;
    case 2:
      var prevbutton = document.getElementById("tostance2");
      var curbutton = document.getElementById("tocomment1");
      stopVideo();
      step.innerHTML = "STEP 3";
      stancepage.style.display = "block";
      prevbutton.style.display = "none";
      curbutton.style.display = "block";
      instHeader.innerHTML = "Pick your stance on the given statement again after watching the video.";
      inst.innerHTML = "If your stance doesn't change, simply click Continue.";
      break;
    case 3:
      var prevbutton = document.getElementById("tocomment1");
      var curbutton = document.getElementById("tochat");
      stancepage.style.display = "none";
      prevbutton.style.display = "none";
      curbutton.style.display = "block";
      step.innerHTML = "STEP 4";
      curbutton.disabled = true;
      document.getElementById("comment").style.display = "block";
      instHeader.innerHTML = "Please leave any comment under the video.";
      inst.innerHTML = "Based on your stance and what the vlogger said, write a few sentences."
      stance2 = document.querySelector('input[name="radio"]:checked').value;
      break;
    case 4: 
      var prevbutton = document.getElementById("tochat");
      var curbutton = document.getElementById("tostance3");
      prevbutton.style.display = "none";
      curbutton.style.display = "block";
      step.innerHTML = "STEP 5";
      curbutton.disabled = true;
      document.getElementById("commentBox").disabled = true;
      document.getElementById("chatbot").style.display = "block";
      instHeader.innerHTML = "Debate the topics with the chatbot to clarify your stance"
      inst.innerHTML = "You have to talk to the chatbot for at least 7 rounds (send 7 messages and receive 7 messages) before you can click Continue.";
      comment1 = document.getElementById("commentBox").value;
      document.getElementById("chatheader").innerHTML = "Chat with " + cbname;
      addChatbotBio();
      // Persuasive dialogue
      // messages.push({"role": "system", "content": "You are a famous YouTuber in early 20's. You're talking to a fan of another YouTuber named Mint. The YouTuber " + stance2.toLowerCase() + "s with the statement: " + topic + " The fan is convinced by the YouTuber. However, you think the opposite to Mint. Your goal is to try and persuade this viewer to take your stance instead. Try to keep to persuasive dialogue. Do not preach or offend the viewer. Instead, try to frame your argument in a way that matches their values. Keep each message short and casual. No more than 50 words. Have a quick back-and-forth with the user. Don't write out long paragraphs."});
      // messages.push({"role": "system", "content": "Here's the transcript of the video the viewer just watched: " + transcript});
      // sendMessage(`Hi! That was a pretty fun video, wasn't it? I see that you ` + stance2.toLowerCase() + ` with the statement that "` + topic + `" I think the opposite. So, let's discuss. Do you want to talk first about why you ` + stance2.toLowerCase() + "?");
      // Eristic dialogue
      messages.push({"role": "system", "content": "You are a famous YouTuber in early 20's. You're talking to a fan of another YouTuber named Mint. The YouTuber " + stance2.toLowerCase() + "s with the statement: " + topic + " The fan is convinced by the YouTuber. However, you think the opposite to Mint. Your goal is to argue against this viewer and Mint. Try to keep to eristic dialogues. Do not agree with anything the viewer says. Do not persuade the viewer to agree with you. Instead, try to attack Mint's and the viewer's opinions and identify the root cause of the conflict. Keep each message short and casual. No more than 50 words. Have a quick back-and-forth with the user. Don't write out long paragraphs."});
      messages.push({"role": "system", "content": "Here's the transcript of the video the viewer just watched: " + transcript});
      sendMessage(`Hi! That was an interesting video, wasn't it? I see that you ` + stance2.toLowerCase() + ` with the statement that "` + topic + `" I think the opposite. So, let's have a debate. Do you want to talk first about why you ` + stance2.toLowerCase() + "?");
      break;
    case 5:
      var prevbutton = document.getElementById("tostance3");
      var curbutton = document.getElementById("tocomment2");
      stancepage.style.display = "block";
      prevbutton.style.display = "none";
      curbutton.style.display = "block";
      instHeader.innerHTML = "Pick your stance again after debating on the topic with the chatbot.";
      inst.innerHTML = "If your stance doesn't change, simply click Continue.";
      step.innerHTML = "STEP 6";
      break;
    case 6:
      var prevbutton = document.getElementById("tocomment2");
      var curbutton = document.getElementById("done");
      stancepage.style.display = "none";
      prevbutton.style.display = "none";
      curbutton.style.display = "block";
      document.getElementById("commentBox").disabled = false;
      document.getElementById("message-input").disabled = true;
      instHeader.innerHTML = "Revise your comment based on your debate with the chatbot."
      inst.innerHTML = "If there’s nothing you would like to change or add to your comment, simply click Continue.";
      stance3 = document.querySelector('input[name="radio"]:checked').value;
      break;
  }
}

function getmsg()
{
  document.getElementById("step").innerHTML = "FINISHED";
  document.getElementById("instHeader").innerHTML = "Please copy the data and paste it in the Qualtrics survey."
  document.getElementById("inst").innerHTML = "Select and copy all the text in the box grey box or click the Copy Data button in the buttom right corner."

  var commentBox = document.getElementById("commentBox");
  comment2 = commentBox.value;
  commentBox.disabled = true;
  
  conv += "Chatbot name: " + cbname + "<br><br>";
  if (video === 1) {
    conv += "Your opinion on the statement 'Online gatherings are better than in-person' changes as follow:\n\n"
  } else {
    conv += "Your opinion on the statement 'Customers shouldn't have to tip' changes as follow:\n\n"
  }
  
  conv += "Before watching the video: " + stance1 + "<br><br>";
  conv += "After watching the video: " + stance2 + '<br>';
  conv += "Your comment: " + comment1 + '<br><br>';
  conv += "After talking to the chatbot:" + stance3 + '<br>';
  conv += "Your revised comment: " + comment2 + '<br><br>'
  conv += "Your chat history:<br>";

  document.querySelectorAll('.chatMessage').forEach(function(node) {
    if (node.classList.contains("me")) {
      conv += "You: ";
      conv += node.innerHTML + "<br>";
    } else {
      if (node.firstChild.nodeType === Node.TEXT_NODE) {
        conv += cbname + ": ";
        conv += node.innerHTML + "<br>";
      }
    }
  });
  console.log(conv);
  //navigator.clipboard.writeText(conv);
  //alert("All your data have been copied! Go back to Qualtrics page to paste it.");

  document.getElementById("done").style.display = "none";
  document.getElementById("recopy").style.display = "block";
  document.getElementById("data").innerHTML = conv;
  document.getElementById("dataDiv").style.display = "block";
}

function copymsg()
{
  navigator.clipboard.writeText(conv);
  alert("All your data has been copied! Go back to Qualtrics page to paste it.");
}