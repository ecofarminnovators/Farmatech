// Navigation
function showSection(id){
    document.querySelectorAll('main section').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Gamification
let points = 0;
let badges = [];
let crops = [];

// Pre-filled leaderboard demo
let leaderboard = [
  {name:"Alice", points:80}, {name:"Bob", points:65}, {name:"You", points:0}
];

// Pre-filled challenges
const challenges = [
  {task:"Use organic fertilizer", points:10, badge:"Organic Beginner"},
  {task:"Reduce pesticide usage", points:20, badge:"Eco Warrior"},
  {task:"Implement drip irrigation", points:30, badge:"Water Saver"},
  {task:"Plant 5 trees", points:40, badge:"Tree Planter"}
];

// Load Challenges
function loadChallenges(){
  const ul = document.getElementById('challenge-list');
  ul.innerHTML="";
  challenges.forEach((c,i)=>{
    const li = document.createElement('li');
    li.innerHTML=`<span>${c.task}</span>
                  <button class="complete-btn" onclick="completeChallenge(${i},this)">Complete</button>`;
    ul.appendChild(li);
  });
}

// Complete Challenge
function completeChallenge(i,btn){
  const c = challenges[i];
  points+=c.points;
  if(!badges.includes(c.badge)) badges.push(c.badge);
  document.getElementById('points').textContent=points;
  updateProgress(); updateLevel(); loadBadges();
  btn.disabled=true; btn.textContent="Completed"; btn.style.backgroundColor="#9e9e9e";
  confetti({particleCount:150,spread:100,colors:['#4caf50','#8bc34a','#ffeb3b']});
  updateLeaderboard();
}

// Load Badges
function loadBadges(){
  const container = document.getElementById('badges');
  container.innerHTML='';
  if(badges.length===0){container.innerHTML='<p>No badges yet 🌱</p>'; return;}
  badges.forEach(b=>{
    const span=document.createElement('span'); span.classList.add('badge');
    span.innerHTML=`<i class="fa-solid fa-leaf"></i> ${b}`; container.appendChild(span);
  });
}

// Progress & Level
function updateProgress(){ document.getElementById('progress').style.width=Math.min(points,100)+'%'; }
function updateLevel(){ document.getElementById('level').textContent=Math.floor(points/50)+1; }

// Leaderboard
function updateLeaderboard(){
  const ol=document.getElementById('leaderboard-list');
  ol.innerHTML="";
  leaderboard.find(u=>u.name==="You").points=points;
  leaderboard.sort((a,b)=>b.points-a.points);
  leaderboard.forEach(u=>{
    const li=document.createElement('li');
    li.textContent=`${u.name} - ${u.points} pts`;
    ol.appendChild(li);
  });
}

// Crop Tracker
document.getElementById('crop-form').addEventListener('submit',function(e){
  e.preventDefault();
  const name = document.getElementById('crop-name').value;
  const date = document.getElementById('plant-date').value;
  crops.push({name:name, date:date, task:"None"});
  document.getElementById('crop-name').value='';
  document.getElementById('plant-date').value='';
  renderCrops();
});

function renderCrops(){
  const ul = document.getElementById('crop-list');
  ul.innerHTML
