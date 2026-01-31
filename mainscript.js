document.addEventListener("DOMContentLoaded", () => {
  const but = document.getElementById("but");
  const video = document.getElementById("vid");
  const mediaDevices = navigator.mediaDevices;
  video.muted = true;

  but.addEventListener("click", async (event) => {
    event.preventDefault(); // prevent reload
    show_output(); // show both control buttons and output section

    // Start camera if not already running
    if (!video.srcObject) {
      try {
        const stream = await mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        video.srcObject = stream;
        await video.play();
        // wait for camera to stabilize
        setTimeout(() => capture(), 1000);
      } catch (err) {
        alert("Camera access denied or unavailable: " + err);
      }
    } else {
      // capture again if already streaming
      capture();
    }
  });
});

window.addEventListener("resize", () => {
  const output = document.getElementById("output");
  const camera = document.getElementById("camera");

  if (window.innerWidth <= 1000) {
    camera.style.width = "90vw";
    output.style.width = "90vw";
  } else {
    camera.style.width = "50vw";
    output.style.width = "50vw";
  }
});


function show_output() {
  const output = document.getElementById("output");
  const camera = document.getElementById("camera");

  camera.style.width = "50vw";
  output.style.width = "50vw";
  output.style.display = "flex";
}

async function capture() {
  const video = document.getElementById("vid");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/png");

  try {
    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    });

    const data = await res.json();
    console.log("Response from backend:", data);
    const feelingEl = document.getElementById("feeling");

    if (data.error || !data.emotion|| Object.keys(data.emotion).length === 0) {
        feelingEl.innerHTML = "No Face Detected";
        controls.style.display = "none";
        return;
    }

    const avgBrightness = checkBrightness(canvas, context);
    if (avgBrightness < 10) {
        feelingEl.innerHTML = "No Face Detected";
         controls.style.display = "none";
      return;
    }

  function checkBrightness(canvas, context) {
  const frame = context.getImageData(0, 0, canvas.width, canvas.height);
  let totalBrightness = 0;
  for (let i = 0; i < frame.data.length; i += 4) {
    const r = frame.data[i];
    const g = frame.data[i + 1];
    const b = frame.data[i + 2];
    totalBrightness += (r + g + b) / 3;
  }
  const avgBrightness = totalBrightness / (frame.data.length / 4);
  return avgBrightness;
}



    const emotion = data.emotion
    feelingEl.textContent = emotion; // store current detected emotion inside div

    if (feelingEl.innerText.trim() !== "") {
      handleEmotionDisplay(emotion);
    }
  } catch (err) {
    document.getElementById("feeling").innerHTML = "Error: " + err.message;
  }
}

function handleEmotionDisplay(emotion) {
  emotion = emotion.trim();

  const current = document.getElementById("current");
  const improve = document.getElementById("improve");
  const controls = document.getElementById("controls");

  if (!current || !improve || !controls) return;

  controls.style.display = "flex";
  current.style.display = "none";
  improve.style.display = "none";

  if (["angry", "fear", "sad"].includes(emotion)) {
    current.style.display = "inline-block";
    improve.style.display = "inline-block";
  } else if (["happy", "surprise"].includes(emotion)) {
    current.style.display = "inline-block";
  } else if (["neutral", "disgust"].includes(emotion)) {
    improve.style.display = "inline-block";
  } else {
    current.style.display = "inline-block";
    improve.style.display = "inline-block";
  }
}

/* ------------------- PLAYLIST SECTIONS ------------------- */


function showplaylists_current() {
  const emotionText = document.getElementById("feeling").innerText.replace("you are:", "").trim().toLowerCase();

  const playlists_current = {
    angry: [
      "https://open.spotify.com/playlist/72CroLZJseND2LGdsqQBuQ",
      "https://open.spotify.com/playlist/76ICNiyhmtbTOyIlrHUzcX",
      "https://open.spotify.com/playlist/1UgAmSY4n1vYyehZPeOrYg",
      "https://open.spotify.com/playlist/25OuJKBFt5SH7Ksd8LAWqNc",
      "https://open.spotify.com/playlist/1h5VpAiwhyxgRvnuOuAKmU",
      "https://open.spotify.com/playlist/47EcgAImw3Lj0pEfhlvqqz",
      "https://open.spotify.com/playlist/34eOiudnpwO9bBt1cCpmRMf",
      "https://open.spotify.com/playlist/37kdOsNnHtzwncTBnI3J17w",
      "https://open.spotify.com/playlist/0XAkJnlXZOygA0SjbWgwGX",
      "https://open.spotify.com/playlist/37i9dQZF1DX5mB2C8gBeUM"
    ],
    fear: [
      "https://open.spotify.com/playlist/37i9dQZF1DX8WDM2w3ubjS",
      "https://open.spotify.com/playlist/37i9dQZF1DX4eRPd9frC1m",
      "https://open.spotify.com/playlist/2CSXxEPmQdWvOd3UCxjcOo",
      "https://open.spotify.com/playlist/37i9dQZF1DX8D9ZRypldtO",
      "https://open.spotify.com/playlist/37i9dQZF1DX5Q5wA1hY6bS",
      "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
      "https://open.spotify.com/playlist/37i9dQZF1DX5uokaTN4Ftr"
    ],
    happy: [
      "https://open.spotify.com/playlist/0okKcRyYEwq8guFxzAPtlB",
      "https://open.spotify.com/playlist/7jgspZkQqGrrfd2Q7lP3BR",
      "https://open.spotify.com/playlist/4JkkvMpVl4lSioqQjeAL0q",
      "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
      "https://open.spotify.com/playlist/37i9dQZF1DX0UrRvztWcAU",
      "https://open.spotify.com/playlist/37i9dQZF1DX0yEZaMOXna3",
      "https://open.spotify.com/playlist/37i9dQZF1DX7KNKjOK0o75",
      "https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr",
      "https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL",
      "https://open.spotify.com/playlist/37i9dQZF1DWVDCraF986xg"
    ],
    sad: [
      "https://open.spotify.com/playlist/57MYpys8HjRBegVjxXYShi",
      "https://open.spotify.com/playlist/37i9dQZF1DX2pSTOxoPbx9",
      "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634",
      "https://open.spotify.com/playlist/37i9dQZF1DWVV27DiNWxkR",
      "https://open.spotify.com/playlist/4Sdc0wQI8JxWeUOgKizMg0",
      "https://open.spotify.com/playlist/37i9dQZF1DX9ZP1N6tit9h",
      "https://open.spotify.com/playlist/37i9dQZF1DWVrtsSlLKzro",
      "https://open.spotify.com/playlist/37i9dQZF1DX4E3UdUs7fUx",
      "https://open.spotify.com/playlist/37i9dQZF1DWVx5PdcQ0R8N",
      "https://open.spotify.com/playlist/37i9dQZF1DX7gIoKXt0gmx"
    ],
    surprise: [
      "https://open.spotify.com/playlist/37i9dQZF1DX2ovYpiK7gx9",
      "https://open.spotify.com/playlist/37i9dQZF1DX5T6K5WZLw5w",
      "https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa",
      "https://open.spotify.com/playlist/37i9dQZF1DX0BcQWzuB7ZO",
      "https://open.spotify.com/playlist/37i9dQZF1DX4E3UdUs7fUx",
      "https://open.spotify.com/playlist/37i9dQZF1DWVx5PdcQ0R8N",
      "https://open.spotify.com/playlist/37i9dQZF1DX5q67ZpWyRrZ",
      "https://open.spotify.com/playlist/37i9dQZF1DX0UrRvztWcAU",
      "https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr",
      "https://open.spotify.com/playlist/37i9dQZF1DX8FwnYE6PRvL"
    ]
  };

  if (playlists_current[emotionText]) {
    const randomPlaylist = playlists_current[emotionText][Math.floor(Math.random() * playlists_current[emotionText].length)];
    window.open(randomPlaylist, "_blank", "noopener,noreferrer"); // ✅ opens in new tab safely
  } else {
    alert("Emotion not detected yet or invalid!");
  }
}

function showplaylists_improve() {
  const emotionText = document.getElementById("feeling").innerText.replace("you are:", "").trim().toLowerCase();

  const playlists_improve = {
    angry: [
      "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY",
      "https://open.spotify.com/playlist/37i9dQZF1DX3b9Bhku6QQX",
      "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
      "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7",
      "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
      "https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8",
      "https://open.spotify.com/playlist/37i9dQZF1DWVqfgj8NZEp1",
      "https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd",
      "https://open.spotify.com/playlist/37i9dQZF1DX0b1hHYQtJjp"
    ],
    disgust: [
      "https://open.spotify.com/playlist/37i9dQZF1DX7K31D69s4M1",
      "https://open.spotify.com/playlist/37i9dQZF1DWUvQoIOFMFUT",
      "https://open.spotify.com/playlist/37i9dQZF1DWSpF87bP6JSF",
      "https://open.spotify.com/playlist/37i9dQZF1DX7zH9H5uXJ3E",
      "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6",
      "https://open.spotify.com/playlist/37i9dQZF1DX4E3UdUs7fUx",
      "https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8",
      "https://open.spotify.com/playlist/37i9dQZF1DX0UrRvztWcAU",
      "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7",
      "https://open.spotify.com/playlist/37i9dQZF1DWX83CujKHHOn"
    ],
    fear: [
      "https://open.spotify.com/playlist/37i9dQZF1DX3b9Bhku6QQX",
      "https://open.spotify.com/playlist/37i9dQZF1DX4pAtJteyweF",
      "https://open.spotify.com/playlist/37i9dQZF1DX0jgyAiPl8Af",
      "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
      "https://open.spotify.com/playlist/37i9dQZF1DWU13kKnk03AP",
      "https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8",
      "https://open.spotify.com/playlist/37i9dQZF1DX5bjCEbRU4SJ",
      "https://open.spotify.com/playlist/37i9dQZF1DXaXB8fQg7xif",
      "https://open.spotify.com/playlist/37i9dQZF1DWVqfgj8NZEp1",
      "https://open.spotify.com/playlist/37i9dQZF1DWSpF87bP6JSF"
    ],
    sad: [
      "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
      "https://open.spotify.com/playlist/37i9dQZF1DX7KNKjOK0o75",
      "https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL",
      "https://open.spotify.com/playlist/37i9dQZF1DXaXB8fQg7xif",
      "https://open.spotify.com/playlist/37i9dQZF1DX0UrRvztWcAU",
      "https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr",
      "https://open.spotify.com/playlist/37i9dQZF1DWVV27DiNWxkR",
      "https://open.spotify.com/playlist/37i9dQZF1DWX83CujKHHOn",
      "https://open.spotify.com/playlist/37i9dQZF1DX8hY56Fq3fM0",
      "https://open.spotify.com/playlist/37i9dQZF1DX8a1tdzq5tbM"
    ],
    neutral: [
      "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
      "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7",
      "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY",
      "https://open.spotify.com/playlist/37i9dQZF1DX0b1hHYQtJjp",
      "https://open.spotify.com/playlist/37i9dQZF1DWU13kKnk03AP",
      "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6",
      "https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8",
      "https://open.spotify.com/playlist/37i9dQZF1DWSpF87bP6JSF",
      "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634"
    ]
  };

  if (playlists_improve[emotionText]) {
    const randomPlaylist = playlists_improve[emotionText][Math.floor(Math.random() * playlists_improve[emotionText].length)];
    window.open(randomPlaylist, "_blank", "noopener,noreferrer"); // ✅ open in new tab
  } else {
    alert("Emotion not detected yet or invalid!");
  }
}
