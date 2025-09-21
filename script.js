// Navigation
function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Gamification variables
let points = 0;
let badges = [];
let crops = [];

// Load saved progress
window.onload = () => {
    points = parseInt(localStorage.getItem('points')) || 0;
    badges = JSON.parse(localStorage.getItem('badges')) || [];
    crops = JSON.parse(localStorage.getItem('crops')) || [];
    document.getElementById('points').textContent = points;
    updateProgress();
    updateLevel();
    loadBadges();
    loadWeather();
    loadCrops();
    updateLeaderboard();
};

// Challenges
const challenges = [
    {task: 'Use organic fertilizer', points: 10, badge: 'Organic Beginner'},
    {task: 'Reduce pesticide usage', points: 20, badge: 'Eco Warrior'},
    {task: 'Implement drip irrigation', points: 30, badge: 'Water Saver'},
    {task: 'Plant 5 trees', points: 40, badge: 'Tree Planter'}
];

// Populate challenges
const challengeList = document.getElementById('challenge-list');
challenges.forEach((ch, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${ch.task}</span>
                    <button class="complete-btn" onclick="completeChallenge(${index}, this)">Complete</button>`;
    challengeList.appendChild(li);
});

// Complete challenge
function completeChallenge(index, btn) {
    const ch = challenges[index];
    points += ch.points;
    if (!badges.includes(ch.badge)) badges.push(ch.badge);
    document.getElementById('points').textContent = points;
    updateProgress();
    updateLevel();
    loadBadges();
    btn.disabled = true; btn.textContent = 'Completed'; btn.style.backgroundColor = '#9e9e9e';

    // Confetti
    confetti({ particleCount: 150, spread: 100, origin: {y:0.6}, colors:['#4caf50','#8bc34a','#ffeb3b']});
    localStorage.setItem('points', points);
    localStorage.setItem('badges', JSON.stringify(badges));
}

// Update progress bar
function updateProgress() {
    document.getElementById('progress').style.width = Math.min(points,100)+'%';
}

// Update level
function updateLevel() {
    const levelEl = document.getElementById('level');
    const level = Math.floor(points/50)+1;
    if(level>parseInt(levelEl.textContent)) {
        levelEl.classList.add('level-up');
        setTimeout(()=>levelEl.classList.remove('level-up'),500);
    }
    levelEl.textContent = level;
}

// Load badges
function loadBadges() {
    const container = document.getElementById('badges');
    container.innerHTML = '';
    if(badges.length===0){ container.innerHTML='<p>No badges yet 🌱</p>'; return; }
    badges.forEach(b=>{
        const span = document.createElement('span');
        span.classList.add('badge'); span.innerHTML=`<i class="fa-solid fa-leaf"></i> ${b}`;
        container.appendChild(span);
    });
}

// Weather API
function loadWeather() {
    const weatherEl = document.getElementById('weather');
    const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // replace with your key
    navigator.geolocation.getCurrentPosition(pos=>{
        const lat = pos.coords.latitude, lon = pos.coords.longitude;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(res=>res.json())
        .then(data=>{
            weatherEl.innerHTML = `🌡 Temp: ${data.main.temp}°C, ☁ ${data.weather[0].main}`;
        }).catch(()=>weatherEl.textContent="Weather data unavailable");
    },()=>weatherEl.textContent="Location required for weather");
}

// Crop Tracker
const cropForm = document.getElementById('crop-form');
cropForm.addEventListener('submit
