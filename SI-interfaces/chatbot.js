var msg_ind = 1;

// Get the input field
var input = document.getElementById("myInput");


var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var $video = $('#video');
var video = $video.get(0);
var participants = document.getElementById("participants");
var mainBtn = document.getElementById("next");
var pingaudio = document.getElementById("ping");
const nonmsg = [7, 21, 22, 23, 29];

video.onplay = function() {
    pauseOther(null);
    toggle("bubble", "none");
    toggle("intprogress", "none");
    grayAll();
};

video.addEventListener('timeupdate', function() {
  var lastCheckedAt = $video.data('lastcheck') || 0;
  $video.data('lastcheck', this.currentTime);
  
  if (this.currentTime >= 68 && lastCheckedAt < 68 && this.currentTime < 69) {
    this.pause();
    setTimeout(function () {
        displayBar(1);
        getResponse();
        disableMainBtn(false);
    }, 1000); // wait 1 second
  } else if (this.currentTime >= 224 && lastCheckedAt < 224 && this.currentTime < 225) {
    this.pause();
    setTimeout(function () {
        displayBar(2);
        getResponse();
        disableMainBtn(false);
    }, 1000); // wait 1 second
  } else if (this.currentTime >= 325 && lastCheckedAt < 325 && this.currentTime < 326) {
    getResponse(); // msg24 = student's question, happens while the lecture is still playing
  } else if (this.currentTime >= 331 && lastCheckedAt < 331 && this.currentTime < 332) {
    this.pause();
    setTimeout(function () {
        displayBar(3);
        getResponse();
        disableMainBtn(false);
    }, 1000); // wait 1 second
  }
});

video.addEventListener('seeked', function() {
    //console.log(this.currentTime);
    setChat(this.currentTime);
});

video.addEventListener('play', function() {
    setChat(this.currentTime+1);
});

function pauseOther(ele) {
    $("audio").not(ele).each(function (index, audio) {
        audio.pause();
    });
}

function displayBar(i){
    document.getElementById("int"+i).style.borderTop = "14px solid dodgerblue";
    document.getElementById("bar"+i).style.display = "block";
    if (i == 1) {
        var s = 1;
        var n = 7;
    } else if (i == 2) {
        var s = 8;
        var n = 23;
    } else {
        var s = 25;
        var n = 30;
    }
    for (let i = s; i < n; i++) {
        document.getElementById("i"+i).style.backgroundColor = "black";
        document.getElementById("i"+i).style.display = "inline-block";
    }
}

function getResponse(){
    //console.log("getResponse:", msg_ind);
    //updateBar();

    if (nonmsg.includes(msg_ind)) { // for clicks that aren't for voice or text messages

        if(document.getElementById("msg"+(msg_ind-1))) { // end the previous message if it's a voice message.
            var prevmsg = document.getElementById("msg"+(msg_ind-1));
            if (prevmsg.constructor.name=="HTMLAudioElement") {
                if(!prevmsg.paused){
                    stopSound(prevmsg);
                }
                document.getElementById("tsc"+(msg_ind-1)).style.display = "none";
                
            }
        }

        if(msg_ind == 7 || msg_ind == 23 || msg_ind == 29) { // switch back to video
            participants.src = "./messages/all-silent.png";
            video.play();
            disableMainBtn(true);
        }

        else if (msg_ind == 21) {
            participants.src = "./messages/katsumi-thumbup.png";
            pingaudio.play();
        }
    
        else if (msg_ind == 22) {
            participants.src = "./messages/katsumi-thumbup-jordan-ok.png";
            pingaudio.play();
        }
    }

    else {
        var msg = document.getElementById("msg"+(msg_ind));
        document.getElementById("i"+msg_ind).style.backgroundColor = "yellow";

        if (msg.constructor.name == "HTMLAudioElement") {

            participants.src = "./messages/adrian-speaking.png"
            document.getElementById("tsc"+(msg_ind)).style.display = "block";
            msg.play();
            msg.onended = function(){
                /*blink();
                setTimeout(function(){
                    blink();
                    setTimeout(function(){
                        blink();
                    }, 500);
                }, 500);*/
                mainBtn.className = "btn buzz-out";
                mainBtn.style.backgroundImage = "linear-gradient(to bottom right, #4FC3F7 100%, #7986CB 50%, #E1F5FE 0%)";
                mainBtn.style.color = "black";
                setTimeout(function() {
                    mainBtn.className = "btn";
                    mainBtn.style.backgroundImage = "linear-gradient(to bottom right, #00d2ff 0%, #3a7bd5 51%, #00d2ff 100%)";
                    mainBtn.style.color = "white";
                }, 1000);
            }
        }
        else {
            if (msg_ind > 1) {
                var prevmsg = document.getElementById("msg"+(msg_ind-1));
                if (prevmsg.constructor.name=="HTMLAudioElement") {
                    if(!prevmsg.paused){
                        stopSound(prevmsg);
                    }
                    document.getElementById("tsc"+(msg_ind-1)).style.display = "none";
                    participants.src = "./messages/all-silent.png";
                }
            }

            var profilepic = document.getElementById("avt"+(msg_ind));
            var stname = document.getElementById("name"+(msg_ind));
            
            stname.style.display = "block";
            msg.style.display = "inline-block";
            profilepic.style.display = "inline-block";
            pingaudio.play();
            updateScroll(); 
        }
    }
    msg_ind += 1;
}

function grayAll() {
    document.getElementById("int1").style.borderTop = "14px solid yellow";
    document.getElementById("int2").style.borderTop = "14px solid yellow";
    document.getElementById("int3").style.borderTop = "14px solid yellow";
    toggle("intprogress", "none");
    toggle("dot", "none");
}

function setChat(t) {
    if (t < 69) {
        hideChat(1, msg_ind);
    } else if (t < 225) {
        hideChat(8, msg_ind);
        showChat(1, 8);
    } else if (t < 332) {
        hideChat(25, msg_ind);
        showChat(1, 25);
    } else {
        showChat(1, 30); // to fix: show all messages
    }
    //console.log("setChat:", msg_ind);
}

function getInteraction(n) {
    toggle("bubble", "none");
    grayAll();

    if (n == 1) {
        video.currentTime = 68;
        hideChat(1, msg_ind);
        displayBar(1);
        pauseOther(document.getElementById("msg1"));
    }
    else if (n == 2) {
        video.currentTime = 224;
        hideChat(8, msg_ind);
        displayBar(2);
        pauseOther(document.getElementById("msg9"));
    }
    else {
        video.currentTime = 331;
        hideChat(25, msg_ind);
        displayBar(3);
        pauseOther(document.getElementById("msg25"));
    }
    video.pause();
    //console.log('getInteraction:', msg_ind);
    getResponse();
    disableMainBtn(false);
}

function hideChat(s, n) {
    for (let i = s; i < n; i++) {
        //console.log(i, document.getElementById("msg"+(i)).constructor.name);
        if (document.getElementById("msg"+(i))) { // check if the element exists
            msg = document.getElementById("msg"+(i));
            if (msg.constructor.name == "HTMLDivElement") {
                msg.style.display = "none";
                document.getElementById("avt"+(i)).style.display = "none";
                document.getElementById("name"+(i)).style.display = "none";
            }
        }
    }
    msg_ind = s;
}

function showChat(s, n) {
    for (let i = s; i < n; i++) {
        //console.log(i, document.getElementById("msg"+(i)).constructor.name);
        if (document.getElementById("msg"+(i))) { // check if the element exists
            msg = document.getElementById("msg"+(i));
            if (msg.constructor.name == "HTMLDivElement") {
                msg.style.display = "inline-block";
                document.getElementById("avt"+(i)).style.display = "inline-block";
                document.getElementById("name"+(i)).style.display = "block";
            }
        }
    }
    msg_ind = n;
}

function toggle(className, displayState){
    var elements = document.getElementsByClassName(className);

    for (var i = 0; i < elements.length; i++){
        elements[i].style.display = displayState;
    }
}

function updateScroll(){
    var element = document.getElementById("chatwindow");
    element.scrollTop = element.scrollHeight;
}

function closeForm(msg_ind) {
    var element = document.getElementById("tsc"+msg_ind);
    element.style.display = "none";
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

function disableMainBtn(t){
    if (t) {
        mainBtn.disabled = true;
        mainBtn.style.backgroundImage = "none";
        //mainBtn.style.backgroundColor = "gray";
        mainBtn.style.cursor = "not-allowed";
        mainBtn.style.opacity = "0.6";
    }
    else {
        mainBtn.disabled = false;
        mainBtn.style.backgroundImage = "linear-gradient(to bottom right, #00d2ff 0%, #3a7bd5 51%, #00d2ff 100%)";
        mainBtn.style.cursor = "pointer";
        mainBtn.style.opacity = "1";
    }
}


/*function updateBar() {
    if (msg_ind <= 7) {
        var n = msg_ind*100/6;
        document.getElementById("bar1").style.backgroundImage = "linear-gradient(to right, white, white "+n+"px, gray "+n+"px)";
    } else if (msg_ind <= 23) {
        var n = (msg_ind-7)*100/15;
        document.getElementById("bar2").style.backgroundImage = "linear-gradient(to right, white, white "+n+"px, gray "+n+"px)";
    } else {
        var n = (msg_ind-24)*100/4;
        document.getElementById("bar3").style.backgroundImage = "linear-gradient(to right, white, white "+n+"px, gray "+n+"px)";
    }
    console.log(msg_ind, n);
}*/