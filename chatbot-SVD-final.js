var msg_ind = 1;

// Get the input field
var input = document.getElementById("myInput");

// TODO: toggle continuous vs discrete state to allow different controls
var playBtn = document.getElementById("playpause-btn");
var mainBtn = document.getElementById("next");
var dragger = document.getElementById("video-dragger");

var p1 = document.getElementById('progress1');
var p2 = document.getElementById('progress2');
var p3 = document.getElementById('progress3');
var p4 = document.getElementById('progress4');

var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
var timer;

var $video = $('#video');
var video = $video.get(0);
var participants = document.getElementById("participants");
var pingaudio = document.getElementById("ping");
const nonmsg = [2, 10, 17, 31, 32, 33, 39, 41, 43, 44];
const emojis = [2, 31, 32, 41, 43];
const emojion = [3, 4, 5, 6, 7, 42];
disableMainBtn(false);

video.onended = function() {
    setTimeout(function () {
        getResponse();
        disableMainBtn(false);
    }, 1000);
}

video.addEventListener('timeupdate', function() {
  var lastCheckedAt = $video.data('lastcheck') || 0;
  $video.data('lastcheck', this.currentTime);
  
  if (this.currentTime > 59 && lastCheckedAt < 59 && this.currentTime < 60) {
    this.pause();
    setTimeout(function () {
        getResponse();
        disableMainBtn(false);
    }, 1000); // wait 1 second
  } else if (this.currentTime > 217 && lastCheckedAt < 217 && this.currentTime < 218) {
    this.pause();
    setTimeout(function () {
        getResponse();
        disableMainBtn(false);
    }, 1000); // wait 1 second
  } else if (this.currentTime > 325 && lastCheckedAt < 325 && this.currentTime < 326) {
    getResponse(); // msg24 = student's question, happens while the lecture is still playing
  } else if (this.currentTime > 335 && lastCheckedAt < 335 && this.currentTime < 336) {
    this.pause();
    setTimeout(function () {
        getResponse();
        disableMainBtn(false);
    }, 1000); // wait 1 second
  } else {
      var t = this.currentTime
      updateTimeline(t);
      var minute = Math.floor(t / 60);
      var second = Math.floor(t - (minute*60));
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      document.getElementById("video-time").innerHTML = minute + ":" + second;
  }
});

video.addEventListener('play', function() {
    setChat(this.currentTime+1);
});

document.getElementById('progress1').addEventListener('click', function (e) {
    clickProgress(e.pageX, 'progress1', 59, 0);
});

document.getElementById('progress2').addEventListener('click', function (e) {
    clickProgress(e.pageX, 'progress2', 217, 59);
});

document.getElementById('progress3').addEventListener('click', function (e) {
    clickProgress(e.pageX, 'progress3', 335, 217);
});

document.getElementById('progress4').addEventListener('click', function (e) {
    clickProgress(e.pageX, 'progress4', 343, 335);
});

function updateTimeline(t) {
    if (t == 0 && msg_ind < 10) {
        return;
    }
    if (t < 60 && msg_ind < 17) {
        var n = t*100/59;
        var ele =  p1;
        p2.style.backgroundImage = "linear-gradient(to right, gray, gray)";
        p3.style.backgroundImage = "linear-gradient(to right, gray, gray)";
        p4.style.backgroundImage = "linear-gradient(to right, gray, gray)";
    } else if (t < 218 && msg_ind < 33) {
        var n = (t-59)*100/(218-59);
        var ele =  p2;
        p1.style.backgroundImage = "linear-gradient(to right, white, white)";
        p3.style.backgroundImage = "linear-gradient(to right, gray, gray)";
        p4.style.backgroundImage = "linear-gradient(to right, gray, gray)";
    } else if (t < 336 && msg_ind < 38) {
        var n = (t-217)*100/(335-217);
        var ele =  p3;
        p1.style.backgroundImage = "linear-gradient(to right, white, white)";
        p2.style.backgroundImage = "linear-gradient(to right, white, white)";
        p4.style.backgroundImage = "linear-gradient(to right, gray, gray)";
    } else {
        var n = (t-335)*100/(343-335);
        var ele =  p4;
        p1.style.backgroundImage = "linear-gradient(to right, white, white)";
        p2.style.backgroundImage = "linear-gradient(to right, white, white)";
        p3.style.backgroundImage = "linear-gradient(to right, white, white)";
    }
    ele.style.backgroundImage = "linear-gradient(to right, white, white "+n+"%, gray "+n+"%)"; // update progress bar
    //console.log("updateTimeline:",t);
    dragger.style.left = (ele.offsetLeft + (n/100)*ele.offsetWidth - 6) +"px"; // update dragger
}

function clickProgress(x, id, mx, mn) {
    var ele = document.getElementById(id);
    var clickedValue = ((x - ele.offsetLeft) * (mx-mn) / ele.offsetWidth) + mn;
        
    console.log('You clicked within the value range at: ' + clickedValue);
    clearTimeout(timer);
    toggle("col-md-12 type-item", "none");
    toggle("bubble", "none");
    video.currentTime = clickedValue;
    setChat(video.currentTime+1);
    updateTimeline(clickedValue);
    //pauseOther(null);
    disableMainBtn(true);
}

function playVideo() {
    if(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2) {
        video.pause();
        playBtn.innerHTML = "<i class='fa fa-play'></i>&nbsp; Play";
    } else {
        video.play();
        playBtn.innerHTML = "<i class='fa fa-pause'></i>&nbsp; Pause";
        participants.src = "./messages/all-silent.png";
        disableMainBtn(true);
    }
}

function showPP(i) {
    if(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2) {
        if (i==1) {
            playBtn.style.display = "block";
        } else {
            playBtn.style.display = "none";
        }
    }
}

function showDragger(i) {
    if (i==1) {
        dragger.style.opacity = "1";
    } else {
        dragger.style.opacity = "0";
    }
}

dragElement(document.getElementById("video-dragger"));
function dragElement(elmnt) {
    var pos1 = 0, pos3 = 0;
    elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    //pos1 = pos3 - e.clientX;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop + "px";
    elmnt.style.left = e.clientX + "px";
    
    //console.log("drag:", e.clientX, p1.offsetLeft, p1.offsetLeft + p1.offsetWidth);
    if (e.clientX > p1.offsetLeft && e.clientX < p1.offsetLeft + p1.offsetWidth) {
        clickProgress(e.clientX, 'progress1', 59, 0)
    } else if (e.clientX > p2.offsetLeft && e.clientX < p2.offsetLeft + p2.offsetWidth) {
        clickProgress(e.clientX, 'progress2', 217, 59)
    } else if (e.clientX > p3.offsetLeft && e.clientX < p3.offsetLeft + p3.offsetWidth) {
        clickProgress(e.clientX, 'progress3', 335, 217)
    } else if (e.clientX > p4.offsetLeft && e.clientX < p4.offsetLeft + p4.offsetWidth) {
        clickProgress(e.clientX, 'progress4', 343, 335)
    }
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function getDialogue(i) {
    console.log("getDialogue:", i, msg_ind);
    if (msg_ind > i) {
        hideChat(i, msg_ind);
    } else {
        showChat(1, i);
    }

    if(i < 10) {
        video.currentTime = 0;
    } else if(i < 17) {
        video.currentTime = 59;
    } else if (i < 33) {
        video.currentTime = 217;
    } else if (i < 39) {
        video.currentTime = 335;
    } else {
        video.currentTime = 343;
    }
    updateTimeline(video.currentTime);
    video.pause();
    //console.log("getDialogue:", i, msg_ind);
    disableMainBtn(false);
    getResponse();
}

function getResponse(){
    //console.log("getResponse:", msg_ind, nonmsg.includes(msg_ind), emojion.includes(msg_ind));
    toggle("bubble", "none");
    clearTimeout(timer);
    toggle("col-md-12 type-item", "none");
    showChat(1, msg_ind);

    if (nonmsg.includes(msg_ind)) { // for clicks that aren't for voice or text messages

        if (msg_ind == 2 || msg_ind == 31 || msg_ind == 41) {
            participants.src = "./messages/katsumi-thumbup.png";
            document.getElementById("i"+msg_ind).style.backgroundColor = "white";
            pingaudio.play();
        }
    
        else if (msg_ind == 32) {
            participants.src = "./messages/katsumi-thumbup-jordan-ok.png";
            document.getElementById("i"+msg_ind).style.backgroundColor = "white";
            pingaudio.play();
        }

        else if (msg_ind == 43) {
            participants.src = "./messages/katsumi-thumbup-jordan-claspedhand.png";
            document.getElementById("i"+msg_ind).style.backgroundColor = "white";
            pingaudio.play();
            mainBtn.innerHTML = "<i class='fa fa-repeat'></i>&nbsp; Restart";
            mainBtn.style.backgroundImage = "linear-gradient(to bottom right, #E57373 0%, #BC3C15 51%, #E57373 100%)";
        }

        else if (msg_ind == 44) { // the end
            document.location.reload();
        }

        else {
            var t = video.currentTime;
            video.load();
            video.currentTime = t;
            //console.log("resume video:", t);
            playVideo();
        }
    }

    else {
        var msg = document.getElementById("msg"+(msg_ind));
        if (msg_ind != 34 ) {
            document.getElementById("i"+msg_ind).style.backgroundColor = "white";
        }

        var profilepic = document.getElementById("avt"+(msg_ind));
        var stname = document.getElementById("name"+(msg_ind));

        if (!emojion.includes(msg_ind)) {
            participants.src = "./messages/all-silent.png";
        }

        stname.style.display = "block";
        profilepic.style.display = "inline-block";

        if (document.getElementById("typing"+(msg_ind))) {
            var typing = document.getElementById("typing"+(msg_ind));
            var t = Number(typing.getAttribute('value')) * 1000;
            typing.style.display = "inline-block";
            updateScroll();
            timer = setTimeout(showTyped, t, typing, msg); // wait t milliseconds
        }

        else {
            msg.style.display = "inline-block";
            pingaudio.play();
            updateScroll(); 
        }

    }

    msg_ind += 1;

    if (msg_ind == 2) { // change button from start to continue
        disableMainBtn(false);
    }
}

function showTyped(typing, msg) {
    typing.style.display = "none";
    msg.style.display = "inline-block";
    pingaudio.play();
    updateScroll(); 
}

function setChat(t) {
    if (t < 59) {
        hideChat(11, msg_ind);
        showChat(1, 11);
    } else if (t < 217) {
        hideChat(18, msg_ind);
        showChat(1, 18);
    } else if (t < 326) {
        hideChat(34, msg_ind);
        showChat(1, 34);
    } else if (t < 335) {
        hideChat(35, msg_ind);
        showChat(1, 35);
    } else {
        showChat(1, 40); // to fix: show all messages
    }
    //console.log("setChat:", msg_ind);
}

function hideChat(s, n) {
    for (let i = s; i < n; i++) {
        //console.log(i);
        if (document.getElementById("msg"+(i))) { // check if the element exists
            msg = document.getElementById("msg"+(i));
            if (msg.constructor.name == "HTMLDivElement") {
                msg.style.display = "none";
                document.getElementById("avt"+(i)).style.display = "none";
                document.getElementById("name"+(i)).style.display = "none";
            } 
            if (i!=34) {
                document.getElementById("i"+(i)).style.backgroundColor = "gray";
            }
        }
        if (emojis.includes(i)) {
            document.getElementById("i"+(i)).style.backgroundColor = "gray";
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
            if (i!=34) {
                document.getElementById("i"+(i)).style.backgroundColor = "white";
            }
        }
        if (emojis.includes(i)) {
            document.getElementById("i"+(i)).style.backgroundColor = "white";
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

function disableMainBtn(t){
    if (t) {
        //disable main button
        mainBtn.disabled = true;
        mainBtn.style.backgroundImage = "none";
        mainBtn.style.cursor = "not-allowed";
        mainBtn.style.opacity = "0.6";
        mainBtn.innerHTML = "<i class='fa fa-step-forward'></i>&nbsp; Click to continue";

        //enable play function
        playBtn.disabled = false;
        playBtn.style.backgroundImage = "linear-gradient(to bottom right, #00d2ff 0%, #3a7bd5 51%, #00d2ff 100%)";
        playBtn.style.cursor = "pointer";
        playBtn.style.opacity = "1";

        // disable dragger
        dragger.style.display = "block";
    }
    else {
        // enable main button
        if (msg_ind == 1) {
            mainBtn.style.backgroundImage = "linear-gradient(to bottom right, #9DC869 0%, #3F8243 51%, #9DC869 100%)";
            mainBtn.innerHTML = "<i class='fa fa-step-forward'></i>&nbsp; Start";
        } else {
            mainBtn.style.backgroundImage = "linear-gradient(to bottom right, #00d2ff 0%, #3a7bd5 51%, #00d2ff 100%)";
            mainBtn.innerHTML = "<i class='fa fa-step-forward'></i>&nbsp; Click to continue";
        }
        mainBtn.disabled = false;
        mainBtn.style.cursor = "pointer";
        mainBtn.style.opacity = "1";

        // disable play button
        playBtn.disabled = true;
        playBtn.innerHTML = "<i class='fa fa-play'></i>&nbsp; Play";
        playBtn.style.display = "block";
        playBtn.style.backgroundImage = "none";
        playBtn.style.cursor = "not-allowed";
        playBtn.style.opacity = "0.6";

        // disable dragger
        dragger.style.display = "none";
    }
}