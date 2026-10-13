import './style.css'

// 1. Live Clock and Date Logic
function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById('clock');
  const dateEl = document.getElementById('date');

  if (clockEl) clockEl.textContent = now.toLocaleTimeString();
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
setInterval(updateClock, 1000);
updateClock();


// 2. NASA APOD Fetch Pipeline (Guide Integration + Date Navigation)
const API_KEY = import.meta.env.VITE_NASA_API_KEY;

function fetchNASA(dateQuery = '') {
  const nasaContainer = document.querySelector("#nasa-content");
  if (!nasaContainer) return;

  // Show loading state immediately so the page is never blank
  nasaContainer.innerHTML = "<p>loading...</p>";

  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  if (dateQuery) {
    url += `&date=${dateQuery}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let media;

      // Handle media types: image, YouTube iframe, or direct video file
      if (data.media_type === "image") {
        media = `<img src="${data.url}" alt="${data.title}"/>`;
      } else if (data.url && data.url.includes("youtube")) {
        media = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        media = `<video src="${data.url}" controls></video>`;
      }

      // Inject the complete layout safely into the NASA card
      nasaContainer.innerHTML = `
        <h4>${data.title}</h4>
        ${media}
        <p>${data.explanation ? data.explanation.substring(0, 120) : ''}...</p>
      `;
    })
    .catch(err => {
      nasaContainer.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}

// Initial fetch for today's picture
fetchNASA();


// 3. Date Picker Event Listener for Interactive NASA Navigation
const datePicker = document.getElementById('date-picker');
if (datePicker) {
  datePicker.addEventListener('change', (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      fetchNASA(selectedDate);
    }
  });
}