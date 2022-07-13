var msg_ind = 1;

// Get the input field
var input = document.getElementById("myInput");

// TODO: toggle continuous vs discrete state to allow different controls
var playBtn = document.getElementById("playpause-btn");
var mainBtn = document.getElementById("next");

var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);


var $video = $('#video');
var video = $video.get(0);
var participants = document.getElementById("participants");
var pingaudio = document.getElementById("ping");
const nonmsg = [7, 21, 22, 23, 29];
disableMainBtn(true);

video.onplay = function() {
    pauseOther(null);
    toggle("bubble", "none");
    participants.src = "./messages/all-silent.png";
    disableMainBtn(true);
};

video.addEventListener('timeupdate', function() {
  var lastCheckedAt = $video.data('lastcheck') || 0;
  $video.data('lastcheck', this.currentTime);
  
  if (this.currentTime > 68 && lastCheckedAt < 68 && this.currentTime < 69) {
    this.pause();
    setTimeout(function () {
        getResponse();
        disableMainBtn(false);
    }, 1000); // wait 1 second
  } else if (this.currentTime > 224 && lastCheckedAt < 224 && this.currentTime < 225) {
    this.pause();
    setTimeout(function () {
        getResponse();
        disableMainBtn(false);
    }, 1000); // wait 1 second
  } else if (this.currentTime > 325 && lastCheckedAt < 325 && this.currentTime < 326) {
    getResponse(); // msg24 = student's question, happens while the lecture is still playing
  } else if (this.currentTime > 331 && lastCheckedAt < 331 && this.currentTime < 332) {
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
    clickProgress(e.pageX, 'progress1', 68, 0);
});

document.getElementById('progress2').addEventListener('click', function (e) {
    clickProgress(e.pageX, 'progress2', 224, 68);
});

document.getElementById('progress3').addEventListener('click', function (e) {
    clickProgress(e.pageX, 'progress3', 331, 224);
});

document.getElementById('progress4').addEventListener('click', function (e) {
    clickProgress(e.pageX, 'progress4', 341, 331);
});

function updateTimeline(t) {
    if (t < 69) {
        var n = t*100/68;
        var ele =  document.getElementById("progress1");
        document.getElementById("progress2").style.backgroundImage = "linear-gradient(to right, gray, gray)";
        document.getElementById("progress3").style.backgroundImage = "linear-gradient(to right, gray, gray)";
        document.getElementById("progress4").style.backgroundImage = "linear-gradient(to right, gray, gray)";
    } else if (t < 225) {
        var n = (t-68)*100/(224-68);
        var ele =  document.getElementById("progress2");
        document.getElementById("progress1").style.backgroundImage = "linear-gradient(to right, white, white)";
        document.getElementById("progress3").style.backgroundImage = "linear-gradient(to right, gray, gray)";
        document.getElementById("progress4").style.backgroundImage = "linear-gradient(to right, gray, gray)";
    } else if (t < 332) {
        var n = (t-224)*100/(331-224);
        var ele =  document.getElementById("progress3");
        document.getElementById("progress1").style.backgroundImage = "linear-gradient(to right, white, white)";
        document.getElementById("progress2").style.backgroundImage = "linear-gradient(to right, white, white)";
        document.getElementById("progress4").style.backgroundImage = "linear-gradient(to right, gray, gray)";
    } else {
        var n = (t-331)*100/(341-331);
        var ele =  document.getElementById("progress4");
        document.getElementById("progress1").style.backgroundImage = "linear-gradient(to right, white, white)";
        document.getElementById("progress2").style.backgroundImage = "linear-gradient(to right, white, white)";
        document.getElementById("progress3").style.backgroundImage = "linear-gradient(to right, white, white)";
    }
    ele.style.backgroundImage = "linear-gradient(to right, white, white "+n+"%, gray "+n+"%)"; // update progress bar
    document.getElementById("video-dragger").style.left = (ele.offsetLeft + (n/100)*ele.offsetWidth - 6) +"px"; // update dragger
}

function pauseOther(ele) {
    $("audio").not(ele).each(function (index, audio) {
        audio.pause();
        audio.currentTime = 0;
    });
}

function clickProgress(x, id, mx, mn) {
    var ele = document.getElementById(id);
    var clickedValue = ((x - ele.offsetLeft) * (mx-mn) / ele.offsetWidth) + mn;
        
    //console.log('You clicked within the value range at: ' + clickedValue);
    video.currentTime = clickedValue;
    setChat(video.currentTime+1);
    pauseOther(null);
    toggle("bubble", "none");
    disableMainBtn(true);
}

function playVideo() {
    var playpause = document.getElementById("playpause");
    if(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2) {
        video.pause();
        //playpause.style.display = "block";
        playBtn.innerHTML = "<i class='fa fa-play'></i>&nbsp; Play";
    } else {
        video.play();
        //playpause.style.display = "none";
        playBtn.innerHTML = "<i class='fa fa-pause'></i>&nbsp; Pause";
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
        document.getElementById("video-dragger").style.opacity = "1";
    } else {
        document.getElementById("video-dragger").style.opacity = "0";
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
    //pos3 = e.clientX;
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
    var p1 = document.getElementById('progress1');
    var p2 = document.getElementById('progress2');
    var p3 = document.getElementById('progress3');
    var p4 = document.getElementById('progress4');
    //console.log("drag:", e.clientX, p1.offsetLeft, p1.offsetLeft + p1.offsetWidth);
    if (e.clientX > p1.offsetLeft && e.clientX < p1.offsetLeft + p1.offsetWidth) {
        clickProgress(e.clientX, 'progress1', 68, 0)
    } else if (e.clientX > p2.offsetLeft && e.clientX < p2.offsetLeft + p2.offsetWidth) {
        clickProgress(e.clientX, 'progress2', 224, 68)
    } else if (e.clientX > p3.offsetLeft && e.clientX < p3.offsetLeft + p3.offsetWidth) {
        clickProgress(e.clientX, 'progress3', 331, 224)
    } else if (e.clientX > p4.offsetLeft && e.clientX < p4.offsetLeft + p4.offsetWidth) {
        clickProgress(e.clientX, 'progress1', 341, 331)
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
    if(i < 7) {
        video.currentTime = 68;
    } else if (i < 23) {
        video.currentTime = 224;
    } else {
        video.currentTime = 331;
    }  
    video.pause();
    console.log("getDialogue:", i, msg_ind);
    disableMainBtn(false);
    getResponse();
}

function getResponse(){
    console.log("getResponse:", msg_ind);
    pauseOther(null); // end everything else before get a reponse
    toggle("bubble", "none");

    if (nonmsg.includes(msg_ind)) { // for clicks that aren't for voice or text messages

        if (msg_ind == 21) {
            participants.src = "./messages/katsumi-thumbup.png";
            document.getElementById("i"+msg_ind).style.backgroundColor = "white";
            pingaudio.play();
        }
    
        else if (msg_ind == 22) {
            participants.src = "./messages/katsumi-thumbup-jordan-ok.png";
            document.getElementById("i"+msg_ind).style.backgroundColor = "white";
            pingaudio.play();
            msg_ind += 1; // If this flow works, remove the resume step later
            disableMainBtn(true);
        }
    }

    else {
        var msg = document.getElementById("msg"+(msg_ind));
        document.getElementById("i"+msg_ind).style.backgroundColor = "white";

        if (msg.constructor.name == "HTMLAudioElement") {

            participants.src = "./messages/adrian-speaking.png"
            document.getElementById("tsc"+(msg_ind)).style.display = "block";
            msg.play();
            if (msg_ind != 6) { // Last message: enable play button, not main button
                msg.onended = function(){
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
        }
        else {
            var profilepic = document.getElementById("avt"+(msg_ind));
            var stname = document.getElementById("name"+(msg_ind));

            participants.src = "./messages/all-silent.png";
            stname.style.display = "block";
            msg.style.display = "inline-block";
            profilepic.style.display = "inline-block";
            pingaudio.play();
            updateScroll(); 
        }

        if (msg_ind == 6 || msg_ind == 28) {
            msg_ind += 1; // If this flow works, remove the resume step later
            disableMainBtn(true);
        }
    }
    msg_ind += 1;
}

function setChat(t) {
    if (t < 68) {
        hideChat(1, msg_ind);
    } else if (t < 224) {
        hideChat(8, msg_ind);
        showChat(1, 8);
    } else if (t < 331) {
        hideChat(25, msg_ind);
        showChat(1, 25);
    } else {
        showChat(1, 30); // to fix: show all messages
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
            if (i!=24) {
                document.getElementById("i"+(i)).style.backgroundColor = "gray";
            }
        }
        if (i==21 || i==22) {
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
            if (i!=24) {
                document.getElementById("i"+(i)).style.backgroundColor = "white";
            }
        }
        if (i==21 || i==22) {
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

/*function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}*/

function playpause(){
    var btn = document.getElementById("playbtn");
    if (btn.className == "playbutton") {
        btn.className = "playbutton pause";
        video.play();
    } else {
        btn.className = "playbutton";
        video.pause();
    }
}

function disableMainBtn(t){
    if (t) {
        //disable main button
        mainBtn.disabled = true;
        mainBtn.style.backgroundImage = "none";
        mainBtn.style.cursor = "not-allowed";
        mainBtn.style.opacity = "0.6";
        document.getElementById("video-dragger").style.display = "block";

        //enable play function
        playBtn.disabled = false;
        playBtn.style.backgroundImage = "linear-gradient(to bottom right, #00d2ff 0%, #3a7bd5 51%, #00d2ff 100%)";
        playBtn.style.cursor = "pointer";
        playBtn.style.opacity = "1";
    }
    else {
        // enable main button
        mainBtn.disabled = false;
        mainBtn.style.backgroundImage = "linear-gradient(to bottom right, #00d2ff 0%, #3a7bd5 51%, #00d2ff 100%)";
        mainBtn.style.cursor = "pointer";
        mainBtn.style.opacity = "1";
        document.getElementById("video-dragger").style.display = "none";

        // disable play button
        playBtn.disabled = true;
        playBtn.innerHTML = "<i class='fa fa-play'></i>&nbsp; Play";
        playBtn.style.display = "block";
        playBtn.style.backgroundImage = "none";
        playBtn.style.cursor = "not-allowed";
        playBtn.style.opacity = "0.6";
    }
}