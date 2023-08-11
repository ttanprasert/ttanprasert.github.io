//const queryString = window.location.search;
//const urlParams = new URLSearchParams(queryString);
//const PID = urlParams.get('PID');
//console.log(PID);
 
function sendMessage(message, itsMe) { // ...Mario
  var messageList = document.getElementById("chatwindow");
  
  //var scrollToBottom = (messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight < 80);

  var lastMessage = messageList.children[messageList.children.length-1];
  
  var avatar = document.createElement("div");
  avatar.classList.add("chatProfile");

  var newMessage = document.createElement("span");
  newMessage.innerHTML = message;
  newMessage.classList.add("chatMessage");

  var messageBlock = document.createElement("div");
  messageBlock.classList.add("chatBubble");
  
  // Append CSS classes for avatar, message, and message block here.
  if(itsMe)
  {
    newMessage.classList.add("me");
    newMessage.classList.add("meMessage");
    messageBlock.classList.add("me");
    avatar.classList.add("me");
    avatar.classList.add("meProfile");
  }
  else
  {
    newMessage.classList.add("notme");
    newMessage.classList.add("notmeMessage");
    messageBlock.classList.add("notme");
    avatar.classList.add("notme");
    avatar.classList.add("notmeProfile");
  }
  
   // Add avatar and message to message block.
    messageBlock.appendChild(avatar);
    messageBlock.appendChild(newMessage);

    // Add message block to chat window
    messageList.appendChild(messageBlock);
  
    messageList.scrollTop = messageList.scrollHeight;
}

var message = document.getElementById("message-input");
message.addEventListener("keypress", function(event) {
  var key = event.which || event.keyCode;
  if(key === 13 && this.value.trim() !== "")
  {
    sendMessage(this.value, true);
    this.value = "";
    setTimeout(sendAIMessage, 1000);
  }
});

function sendAIMessage()
{
  // replace with ChatGPT API
  sendMessage("placeholder AI message", false);
}

function getmsg()
{
  var conv = "";
  document.querySelectorAll('.chatMessage').forEach(function(node) {
    if (node.classList.contains("me")) {
      conv += "ME: ";
    } else {
      conv += "CB: ";
    }
    conv += node.innerHTML + "\n";
  });

  console.log(conv);
  navigator.clipboard.writeText(conv);
  alert("Conversation copied!");
}