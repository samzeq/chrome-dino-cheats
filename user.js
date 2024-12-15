(function() {
  // Check if the game is running
  const runnerInstance = window.Runner && window.Runner.instance_;
  if (!runnerInstance || runnerInstance.paused) {
    alert("Please start the game and wait for it to begin before using the mod menu.");
    return;
  }

  // Disable pausing when switching tabs/windows by overriding stop function
  const originalStop = runnerInstance.stop;
  runnerInstance.stop = function() {}; // Disable the stop function so the game doesn't pause

  // Correct implementation of God Mode: Disable game over
  const originalGameOver = Runner.prototype.gameOver;
  Runner.prototype.gameOver = function() {}; // Prevent the game from triggering game over

  // Create a pop-up window for the mod menu
  const modMenuWindow = window.open('', 'Dino Mod Menu', 'width=300,height=400,scrollbars=yes,resizable=yes');
  if (!modMenuWindow) {
    alert("Please allow pop-ups on this page.");
    return;
  }

  modMenuWindow.document.write(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: white;
            background-color: #333;
            padding: 10px;
          }
          h4 {
            text-align: center;
            color: #fff;
          }
          .mod-btn {
            background-color: #444;
            color: #fff;
            border: 1px solid #555;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
          }
          .mod-btn:hover {
            background-color: #555;
          }
          input[type="number"] {
            background-color: #222;
            color: #fff;
            border: 1px solid #444;
            width: 50px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h4>Dino Mod Menu</h4>

        <!-- Speed adjustment -->
        <label>Game Speed:</label>
        <input type="number" id="speedInput" value="1" min="0.1" max="5" step="0.1">
        <br>

        <!-- Toggle God Mode -->
        <button class="mod-btn" id="godModeButton">Activate God Mode</button><br>

        <!-- Toggle Auto Jump -->
        <button class="mod-btn" id="autoJumpButton">Activate Auto Jump</button><br>

        <!-- Speed Hack -->
        <button class="mod-btn" id="speedHackButton">Activate Speed Hack</button><br>

        <!-- Morph Options -->
        <h4>Choose Morph:</h4>
        <button class="mod-btn" id="morphSonic">Morph to Sonic</button><br>
        <button class="mod-btn" id="morphDinosaur">Morph to Dinosaur</button><br>

        <script>
          const modMenuWindow = window;
          const speedInput = modMenuWindow.document.getElementById('speedInput');
          const godModeButton = modMenuWindow.document.getElementById('godModeButton');
          const autoJumpButton = modMenuWindow.document.getElementById('autoJumpButton');
          const speedHackButton = modMenuWindow.document.getElementById('speedHackButton');
          const morphSonicButton = modMenuWindow.document.getElementById('morphSonic');
          const morphDinosaurButton = modMenuWindow.document.getElementById('morphDinosaur');

          let godModeActive = false;
          let autoJumpActive = false;
          let speedHackActive = false;

          // Update game speed
          speedInput.addEventListener('input', function() {
            const speed = parseFloat(speedInput.value);
            Runner.instance_.setSpeed(speed); // Adjust speed
          });

          // Toggle God Mode (no game over)
          godModeButton.onclick = function() {
            godModeActive = !godModeActive;
            if (godModeActive) {
              Runner.prototype.gameOver = function() {}; // Disable game over
              godModeButton.innerText = 'Deactivate God Mode';
            } else {
              Runner.prototype.gameOver = originalGameOver; // Re-enable game over
              godModeButton.innerText = 'Activate God Mode';
            }
          };

          // Toggle Auto Jump
          autoJumpButton.onclick = function() {
            autoJumpActive = !autoJumpActive;
            if (autoJumpActive) {
              setInterval(() => {
                Runner.instance_.tRex.startJump(0); // Automatically jump every 50ms
              }, 50);
              autoJumpButton.innerText = 'Deactivate Auto Jump';
            } else {
              autoJumpButton.innerText = 'Activate Auto Jump';
            }
          };

          // Toggle Speed Hack
          speedHackButton.onclick = function() {
            speedHackActive = !speedHackActive;
            if (speedHackActive) {
              Runner.instance_.setSpeed(5); // Speed up the game
              speedHackButton.innerText = 'Deactivate Speed Hack';
            } else {
              Runner.instance_.setSpeed(1); // Normal speed
              speedHackButton.innerText = 'Activate Speed Hack';
            }
          };

          // Morph to Sonic
          morphSonicButton.onclick = function() {
            morphTo("sonic");
          };

          // Morph to Dinosaur (reset)
          morphDinosaurButton.onclick = function() {
            morphTo("dinosaur");
          };

          function morphTo(type) {
            const tRex = Runner.instance_.tRex;

            // Different morphs based on type
            if (type === "sonic") {
              tRex.setSprite(SonicSprite); // Assuming SonicSprite is preloaded
            } else if (type === "dinosaur") {
              tRex.setSprite(DinosaurSprite); // Default T-Rex sprite
            }
          }

          // Preload Sonic Sprite (from sprite sheet)
          const SonicSprite = new Image();
          SonicSprite.src = 'https://i.imgur.com/0fuGJRB.png'; // URL of the Sonic sprite sheet

          // Function to crop and use specific frames for Sonic animation
          SonicSprite.onload = function() {
            // Slicing the sprite sheet into individual frames
            const frameWidth = 88;  // Frame width of Sonic sprite
            const frameHeight = 92; // Frame height of Sonic sprite
            const totalFrames = 10; // Total number of frames in the sheet

            let sonicFrames = [];
            for (let i = 0; i < totalFrames; i++) {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = frameWidth;
              canvas.height = frameHeight;
              context.drawImage(SonicSprite, i * frameWidth, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
              sonicFrames.push(canvas);
            }

            // Function to animate Sonic
            let frameIndex = 0;
            setInterval(() => {
              tRex.setSprite(sonicFrames[frameIndex]);
              frameIndex = (frameIndex + 1) % sonicFrames.length; // Loop through frames
            }, 100); // Change frame every 100ms
          };
        </script>
      </body>
    </html>
  `);
})();
