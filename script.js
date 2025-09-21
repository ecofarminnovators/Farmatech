// Navigation
function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Gamification variables
let points = 0;
let badges = [];

// Sample challenges
const challenges = [
    {task: 'Use organic fertilizer on 1 plot', points: 10, badge: 'Organic Beginner'},
    {task: 'Reduce pesticide usage by 20%', points: 20, badge: 'Eco Warrior'},
    {task: 'Implement drip irrigation', points: 30, badge: 'Water Saver'}
];

// Populate challenges
const challengeList = document.getElementById('challenge-list');
challenges.forEach((ch, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
        ${ch.task} 
        <button class="complete-btn" onclick="completeChallenge(${index}, this)">
            Complete
        </button>`;
    challengeList.appendChild(li);
});

// Complete challenge function
function completeChallenge(index, btn) {
    const ch = challenges[index];
    points += ch.points;

    if (!badges.includes(ch.badge)) {
        badges.push(ch.badge);
        const badgeEl = document.createElement('span');
        badgeEl.classList.add('badge');
        badgeEl.innerHTML = `<i class="fa-solid fa-leaf"></i> ${ch.badge}`;
        const badgesContainer = document.getElementById('badges');
        if(badgesContainer.querySelector('p')) badgesContainer.innerHTML = '';
        badgesContainer.appendChild(badgeEl);
    }

    // Update points and progress
    document.getElementById('points').textContent = points;
    const progress = document.getElementById('progress');
    progress.style.width = Math.min(points, 100) + '%';

    // Button feedback
    btn.disabled = true;
    btn.textContent = 'Completed';
    btn.style.backgroundColor = '#9e9e9e';

    // Celebration effect
    alert(`🎉 Challenge completed! +${ch.points} points, Badge: ${ch.badge}`);
}

// Sample leaderboard
const leaderboard = [
    {name: 'Alice', points: 120},
    {name: 'Bob', points: 100},
    {name: 'Charlie', points: 80},
];

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.sort((a,b) => b.points - a.points);
    leaderboard.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-trophy"></i> ${user.name} - ${user.points} pts`;
        leaderboardList.appendChild(li);
    });
}

updateLeaderboard();
