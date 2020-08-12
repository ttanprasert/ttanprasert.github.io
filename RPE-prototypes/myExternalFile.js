<!DOCTYPE html>
<html>

<div id="myvideo"></div>

<script async src="https://www.youtube.com/iframe_api"></script>
<script>
var player;
var videoId='https://www.youtube.com/embed/u9FkZ7t3Mw4';
var startSeconds = 4;  // set your own video start time when loop play
var endSeconds = 27;   // set your own video end time when loop play
var playerConfig = {
  height: '450',
  width: '100%',
  videoId: videoId,
  playerVars: {

    autoplay: 1,            // Auto-play the video on load
    controls: 0,            // Show pause/play buttons in player
    showinfo: 0,            // Hide the video title
    modestbranding: 1,      // Hide the Youtube Logo
    fs: 1,                  // Hide the full screen button
    cc_load_policy: 0,      // Hide closed captions
    iv_load_policy: 3,      // Hide the Video Annotations
    start: startSeconds,
    end: endSeconds,
    autohide: 0, // Hide video controls when playing
  },
  events: {
       'onStateChange': onStateChange,       // reference to Iframe API
        onReady: function(e) {              // mute the video when loaded
        e.target.mute();             
      }
    }
};
//excute the video in div
function onYouTubePlayerAPIReady() {

  player = new YT.Player('myvideo', playerConfig);

}
//repload the video when onStateChange=YT.PlayerState.ENDED)
function onStateChange(state) {
  if (state.data === YT.PlayerState.ENDED) {
    player.loadVideoById({
      videoId: videoId,
      startSeconds: startSeconds,
      endSeconds: endSeconds

    });
  }
}

function exampleFunction() {
	alert("I am embedded into the HTML file!")
	}

</script>

</html>