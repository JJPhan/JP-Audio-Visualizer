"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AudioPlayer =
/*#__PURE__*/
function () {
  function AudioPlayer() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.audioPlayer';
    var audio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, AudioPlayer);

    this.playerElem = document.querySelector(selector);
    this.audio = audio;
    this.currentAudio = null;
    this.audioContext = null;
    this.nowPlaying = "";
    this.red = document.getElementById("red").value;
    this.blue = document.getElementById("blue").value;
    this.green = document.getElementById("green").value;
    this.createPlayerElements();
    this.colorSlider();
  } // to do 
  // progress bar 
  //  [  ]  
  // space -> play / pause
  //  [  ]               
  // upload feature
  //  [  ]  
  // change visual
  //  [  ]  
  // CRUD feature => local storage  
  //  [  ]  


  _createClass(AudioPlayer, [{
    key: "createVisualizer",
    value: function createVisualizer() {
      this.audioContext = new AudioContext();
      var src = this.audioContext.createMediaElementSource(this.audioElem);
      var analyser = this.audioContext.createAnalyser();
      var canvas = this.visualiserElem;
      var ctx = canvas.getContext('2d');
      src.connect(analyser);
      analyser.connect(this.audioContext.destination);
      analyser.fftSize = 128;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      var barWidth = canvas.width / bufferLength * 1.5;

      function renderFrame() {
        requestAnimationFrame(renderFrame);
        var bar = 0;
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < bufferLength; i++) {
          var barHeight = dataArray[i] - 130;
          var r = barHeight + 1 / 10 * (i / bufferLength); // ctx.fillStyle = `rgb(${r}, 105, 65`; //

          var red = document.getElementById("red").value;
          var blue = document.getElementById("blue").value;
          var green = document.getElementById("green").value;
          ctx.fillStyle = "rgb(".concat(red, " , ").concat(green, ", ").concat(blue); // ctx.fillStyle = 'rgb(12,115,4)'

          ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
          bar += barWidth + 3;
        }
      }

      renderFrame();
    } // use innerHTML to save case variables
    // can be like the waves
    // can be bars
    // create buttons to change innerHTML 

  }, {
    key: "createPlayerElements",
    value: function createPlayerElements() {
      var containerElem = document.createElement('div');
      containerElem.classList.add('container');
      this.audioElem = document.createElement('audio');
      this.audioElem.addEventListener('timeupdate', this.updateTime.bind(this));
      var playListElem = document.createElement('div');
      playListElem.classList.add('playlist');
      this.visualiserElem = document.createElement('canvas');
      containerElem.appendChild(this.audioElem);
      containerElem.appendChild(playListElem);
      containerElem.appendChild(this.visualiserElem);
      var progressBarElem = document.createElement('div');
      progressBarElem.classList.add("progressBar");
      this.playerElem.appendChild(containerElem);
      this.playerElem.appendChild(progressBarElem);
      this.createPlaylistElements(playListElem);
      this.createProgressBarElements(progressBarElem);
      var nowPlayin = document.createElement('marquee');
      nowPlayin.classList.add("now-playin");
      nowPlayin.setAttribute("direction", "right"); // nowPlayin.setAttribute("scroll-d", "up")

      containerElem.appendChild(nowPlayin);
      nowPlayin.setAttribute("target", "_blank");
      nowPlayin.innerHTML = "Now Playing: ".concat(this.nowPlaying); // nowPlayin.innerHTML = ` Now Playing: ${this.nowPlaying} <a href="https://github.com/JJPhan"> Visit My GitHub! </a>`
    }
  }, {
    key: "createProgressBarElements",
    value: function createProgressBarElements(progressBarElem) {
      var container = document.createElement('div');
      container.classList.add('button-container');
      var previousBtn = document.createElement("button");
      previousBtn.classList.add("playback-buttons");
      var nextBtn = document.createElement('button');
      nextBtn.classList.add("playback-buttons");
      nextBtn.innerHTML = "<i class=\"fas fa-forward\"></i>";
      previousBtn.innerHTML = "<i class=\"fas fa-backward\"></i>";
      nextBtn.addEventListener('click', this.playNext.bind(this));
      previousBtn.addEventListener('click', this.playPrevious.bind(this)); // why this.timer why not let timer = 

      this.progressBar = document.createElement('canvas');
      this.progressBar.classList.add("progress-bar-canvas");
      this.timer = document.createElement("div");
      this.timer.classList.add('timer');
      container.appendChild(previousBtn);
      container.appendChild(this.timer);
      container.appendChild(nextBtn);
      progressBarElem.appendChild(container);
      progressBarElem.appendChild(this.progressBar);
    } // iterate through audio array, 
    // for each audio object create audioItem, audioArtist, audioDiv anchor tag
    // display the icon, track, artist in a row
    // slap event listener to audioDiv(the row)
    // shove it inside the main playlist element

  }, {
    key: "createPlaylistElements",
    value: function createPlaylistElements(playListElem) {
      var _this = this;

      this.audioElements = this.audio.map(function (audio) {
        var audioItem = document.createElement('a');
        var audioArtist = document.createElement('a');
        var audioDiv = document.createElement('div');
        audioDiv.classList.add("track-information");
        audioDiv.appendChild(audioItem);
        audioDiv.appendChild(audioArtist); // set attribute vs ln 95
        // get attribute vs audioItem.name/artist

        audioItem.setAttribute("name", "".concat(audio.name));
        audioItem.setAttribute("artist", "".concat(audio.artist));
        audioItem.href = audio.url;
        audioItem.innerHTML = "<i class= \"fa fa-play\"></i> ".concat(audio.name);
        audioArtist.innerHTML = "".concat(audio.artist);

        _this.setupEventListener(audioDiv, audioItem);

        playListElem.appendChild(audioDiv);
        return audioItem;
      });
      this.currentAudio = this.audioElements[0];
    } // chain setUpEventListener => 
    // this.nowPlaying =>
    //Render Div

  }, {
    key: "setupEventListener",
    value: function setupEventListener(audioDiv, audioItem) {
      var _this2 = this;

      audioDiv.addEventListener('click', function (e) {
        e.preventDefault();

        if (!_this2.audioContext) {
          _this2.createVisualizer();
        }

        var isCurrentAudio = audioItem.getAttribute('href') === (_this2.currentAudio && _this2.currentAudio.getAttribute('href'));

        if (isCurrentAudio && !_this2.audioElem.paused) {
          _this2.setPlayIcon(_this2.currentAudio);

          _this2.audioElem.pause();
        } else if (isCurrentAudio && _this2.audioElem.paused) {
          _this2.setPauseIcon(_this2.currentAudio);

          _this2.audioElem.play();
        } else {
          if (_this2.currentAudio) {
            _this2.setPlayIcon(_this2.currentAudio);
          }

          _this2.currentAudio = audioItem;
          _this2.nowPlaying = "".concat(audioItem.getAttribute("name"), " - ").concat(audioItem.getAttribute("artist"));
          var nowPlayin = document.querySelector(".now-playin");
          nowPlayin.innerHTML = "Now Playing: ".concat(_this2.nowPlaying);

          _this2.setPauseIcon(_this2.currentAudio);

          _this2.audioElem.src = _this2.currentAudio.getAttribute('href');

          _this2.audioElem.play();
        }
      });
    }
  }, {
    key: "createSlider",
    value: function createSlider(r) {
      var slider = document.createElement("input");
      slider.setAttribute("type", "range");
      slider.setAttribute("min", "0");
      slider.setAttribute("max", "100");
      slider.setAttribute("value", "0");
    }
  }, {
    key: "setPlayIcon",
    value: function setPlayIcon(elem) {
      var icon = elem.querySelector('i');
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    }
  }, {
    key: "setPauseIcon",
    value: function setPauseIcon(elem) {
      var icon = elem.querySelector('i');
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
    }
  }, {
    key: "colorSlider",
    value: function colorSlider() {
      var input = document.querySelectorAll("input");

      for (var i = 0; i < input.length; i++) {
        input[i].addEventListener("input", function () {
          var red = document.getElementById("red").value;
          var blue = document.getElementById("blue").value;
          var green = document.getElementById("green").value;
          var display = document.getElementById("display");
          display.style.background = "rgb(".concat(red, " , ").concat(green, ", ").concat(blue, ")");
        });
      }
    }
  }, {
    key: "updateTime",
    value: function updateTime() {
      var parseTime = function parseTime(time) {
        var seconds = String(Math.floor(time % 60 || 0)).padStart('2', '0');
        var minutes = String(Math.floor(time / 60) || 0).padStart('2', '0');
        return "".concat(minutes, ":").concat(seconds);
      };

      var _this$audioElem = this.audioElem,
          currentTime = _this$audioElem.currentTime,
          duration = _this$audioElem.duration;
      this.timer.innerHTML = "".concat(parseTime(currentTime), "/").concat(parseTime(duration));
      this.updateProgressBar();
    }
  }, {
    key: "updateProgressBar",
    value: function updateProgressBar() {
      var progressSize = function progressSize(current, overall, width) {
        return current / overall * width;
      };

      var _this$audioElem2 = this.audioElem,
          currentTime = _this$audioElem2.currentTime,
          duration = _this$audioElem2.duration;
      var progressCtx = this.progressBar.getContext('2d');
      progressCtx.fillStyle = "#000";
      progressCtx.fillRect(0, 0, this.progressBar.width, this.progressBar.height);
      progressCtx.fillStyle = '#65ac6b';
      progressCtx.fillRect(0, 0, progressSize(currentTime, duration, this.progressBar.width), this.progressBar.height);
    }
  }, {
    key: "updateCurrentAudio",
    value: function updateCurrentAudio(nextAudio) {
      if (!this.audioContext) {
        this.createVisualizer();
      }

      this.setPlayIcon(this.currentAudio);
      this.currentAudio = nextAudio;
      this.setPauseIcon(this.currentAudio);
      this.audioElem.src = this.currentAudio.getAttribute('href');
      this.audioElem.play();
    }
  }, {
    key: "playNext",
    value: function playNext() {
      var _this3 = this;

      var index = this.audioElements.findIndex(function (audioItem) {
        return audioItem.getAttribute('href') === _this3.currentAudio.getAttribute('href');
      });
      var nextAudio = index >= this.audioElements.length - 1 ? this.audioElements[0] : this.audioElements[index + 1];
      this.updateCurrentAudio(nextAudio);
      this.nowPlaying = "".concat(nextAudio.getAttribute("name"), " - ").concat(nextAudio.getAttribute("artist"));
      var nowPlayin = document.querySelector(".now-playin");
      nowPlayin.innerHTML = "Now Playing: ".concat(this.nowPlaying);
    }
  }, {
    key: "playPrevious",
    value: function playPrevious() {
      var _this4 = this;

      var index = this.audioElements.findIndex(function (audioItem) {
        return audioItem.getAttribute('href') === _this4.currentAudio.getAttribute('href');
      });
      var nextAudio = index <= 0 ? this.audioElements[this.audioElements.length - 1] : this.audioElements[index - 1];
      this.updateCurrentAudio(nextAudio);
      this.nowPlaying = "".concat(nextAudio.getAttribute("name"), " - ").concat(nextAudio.getAttribute("artist"));
      var nowPlayin = document.querySelector(".now-playin");
      nowPlayin.innerHTML = "Now Playing: ".concat(this.nowPlaying);
    }
  }]);

  return AudioPlayer;
}();

exports["default"] = AudioPlayer;