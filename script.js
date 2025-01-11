// Funksioni për hapjen dhe mbylljen e dropdown menu
function toggleMenu() {
  const dropdown = document.getElementById('dropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Funksioni për të kaluar ndërmjet seksioneve
document.getElementById('vakti').addEventListener('click', () => {
  document.getElementById('vakti-section').style.display = 'block';
  document.getElementById('istighfar-section').style.display = 'none';
  document.getElementById('qibla-section').style.display = 'none';
});

document.getElementById('istighfar').addEventListener('click', () => {
  document.getElementById('vakti-section').style.display = 'none';
  document.getElementById('istighfar-section').style.display = 'block';
  document.getElementById('qibla-section').style.display = 'none';
});

document.getElementById('qibla').addEventListener('click', () => {
  document.getElementById('vakti-section').style.display = 'none';
  document.getElementById('istighfar-section').style.display = 'none';
  document.getElementById('qibla-section').style.display = 'block';
});

// Funksioni për të përditësuar orët e namazit në bazë të qytetit
document.getElementById('city-select').addEventListener('change', (event) => {
  const city = event.target.value;
  fetchNamazTimes(city);  // Thirrja e API për qytetin e zgjedhur
});

function fetchNamazTimes(city) {
  fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Kosovo&method=2`)
      .then(response => response.json())
      .then(data => {
          const namazTimes = document.getElementById('times');
          const timings = data.data.timings;
          // Azhurnimi i orëve të namazit në HTML
          namazTimes.innerHTML = `
              <p><strong>Fajr:</strong> ${timings.Fajr}</p>
              <p><strong>Shuruq:</strong> ${timings.Sunrise}</p>
              <p><strong>Dhuhr:</strong> ${timings.Dhuhr}</p>
              <p><strong>Asr:</strong> ${timings.Asr}</p>
              <p><strong>Maghrib:</strong> ${timings.Maghrib}</p>
              <p><strong>Isha:</strong> ${timings.Isha}</p>
          `;
      })
      .catch(error => {
          console.error('Error fetching namaz times:', error);
          alert('Për të marrë kohët e namazit, ju lutem provoni më vonë!');
      });
}

// Funksioni për Istighfar Counter
let dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};
let currentCount = 0; // Ruajmë numërimin aktual për seancën
const counterDisplay = document.getElementById('counter');
const countButton = document.getElementById('count-btn');
const resetButton = document.getElementById('reset-btn');
const dailyStatsBody = document.getElementById('daily-stats-body');

// Funksioni për të ruajtur statistikat në LocalStorage
function saveStatsToLocalStorage() {
  localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
}

// Përditësimi i statistikave ditore në tabelë
function updateDailyStats() {
  dailyStatsBody.innerHTML = '';
  Object.keys(dailyStats).forEach(date => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${date}</td>
          <td>${dailyStats[date]}</td>
      `;
      dailyStatsBody.appendChild(row);
  });
}

// Kur butoni klikohet
countButton.addEventListener('click', () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Përditëson numrin e statistikave ditore
  if (!dailyStats[today]) {
      dailyStats[today] = 0;
  }
  dailyStats[today]++;
  currentCount++;
  counterDisplay.textContent = currentCount;

  saveStatsToLocalStorage(); // Ruaj në LocalStorage
  updateDailyStats(); // Përditëso tabelën
});

// Resetimi i vetëm counter-it aktual
resetButton.addEventListener('click', () => {
  currentCount = 0;
  counterDisplay.textContent = currentCount;
});

// Ngarkimi i statistikave nga LocalStorage kur faqja hapet
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  currentCount = 0; // Reset i seancës së re
  counterDisplay.textContent = currentCount;
  updateDailyStats();
});

// Krijimi i efektit të shkëndijës
function createSparkleEffect(element) {
  const sparkle = document.createElement('span');
  sparkle.classList.add('sparkle');
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  element.appendChild(sparkle);
  setTimeout(() => {
      sparkle.remove();
  }, 1000);
}

// Funksioni për llogaritjen e drejtimit të Kiblas
function calculateQiblaDirection(latitude, longitude) {
  const qiblaLat = 21.4225;  // Gjerësia e Qabes (Meke)
  const qiblaLon = 39.8262;  // Gjatësia e Qabes (Meke)

  const deltaLon = qiblaLon - longitude;
  const y = Math.sin(deltaLon) * Math.cos(qiblaLat);
  const x = Math.cos(latitude) * Math.sin(qiblaLat) - Math.sin(latitude) * Math.cos(qiblaLat) * Math.cos(deltaLon);
  const qiblaAngle = Math.atan2(y, x);  // Këndi i Kiblas

  // Ktheni këndin në gradë
  return (qiblaAngle * 180 / Math.PI + 360) % 360;
}

// Funksioni për të marrë vendndodhjen dhe përditësuar kompasin
function updateQiblaDirection() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          // Këtu do të llogaritim drejtimin e Kiblas
          const qiblaAngle = calculateQiblaDirection(userLat, userLon);

          // Përditësojmë kompasin për të treguar drejtimin e Kiblas
          const needle = document.getElementById('needle');
          needle.style.transform = `rotate(${qiblaAngle}deg)`;  // Rrotullimi i gishti të kompasit

          // Përditësojmë tekstin e Kiblas
          document.getElementById('qibla-direction').textContent = `Drejtimi i Kiblas: ${Math.round(qiblaAngle)}° nga veriu`;
      }, (error) => {
          console.error('Geolocation error:', error);
          alert('Nuk mund të merret vendndodhja juaj.');
      });
  } else {
      alert('Geolokacioni nuk është i disponueshëm në këtë shfletues.');
  }
}

// Thirrja e funksionit kur ngarkohet faqja
updateQiblaDirection();
