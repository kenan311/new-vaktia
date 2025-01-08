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
let count = 0;
const counterDisplay = document.getElementById('counter');
const countButton = document.getElementById('count-btn');
const resetButton = document.getElementById('reset-btn');

countButton.addEventListener('click', () => {
    count++;
    counterDisplay.textContent = count;
    counterDisplay.style.animation = 'pop 0.3s ease';
    setTimeout(() => {
      counterDisplay.style.animation = '';
    }, 300);
    createSparkleEffect(countButton);
});

resetButton.addEventListener('click', () => {
    count = 0;
    counterDisplay.textContent = count;
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

// Llogaritja e drejtimit të Kiblas nga koordinatat
function calculateQiblaDirection(lat, lon) {
    const qiblaLat = 21.4225;  // Latituda e Qiblës (Mekka)
    const qiblaLon = 39.8262;  // Longituda e Qiblës (Mekka)

    const deltaLon = qiblaLon - lon;
    const y = Math.sin(deltaLon) * Math.cos(qiblaLat);
    const x = Math.cos(lat) * Math.sin(qiblaLat) - Math.sin(lat) * Math.cos(qiblaLat) * Math.cos(deltaLon);

    const qiblaDirection = Math.atan2(y, x) * (180 / Math.PI);  // Llogaritja e drejtimit në gradë

    // Sigurohemi që drejtimi të jetë nga 0 deri në 360 gradë
    return (qiblaDirection + 360) % 360;
}

// Thirrja e funksionit kur ngarkohet faqja
updateQiblaDirection();
