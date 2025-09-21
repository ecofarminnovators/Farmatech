// Firebase config (replace with your Firebase project config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Authentication
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            currentUser = userCredential.user;
            db.collection("users").doc(currentUser.uid).set({
                points: 0,
                badges: 0,
                challenges: {}
            });
            alert("Registered successfully!");
        })
        .catch(err => alert(err.message));
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            currentUser = userCredential.user;
            loadDashboard();
            loadLeaderboard();
            alert("Logged in successfully!");
        })
        .catch(err => alert(err.message));
}

// Dashboard & Badges
function loadDashboard() {
    db.collection("users").doc(currentUser.uid).get()
        .then(doc => {
            const data = doc.data();
            document.getElementById("points").innerText = data.points;
            document.getElementById("badges").innerText = data.badges;

            const container = document.getElementById("badge-container");
            container.innerHTML = "";
            for(let i=0; i<data.badges; i++) {
                const badge = document.createElement("div");
                badge.classList.add("badge");
                badge.innerText = "🏅";
                container.appendChild(badge);
            }
        });
}

function completeChallenge(challenge, value) {
    db.collection("users").doc(currentUser.uid).get().then(doc => {
        let data = doc.data();
        if(!data.challenges[challenge]) {
            data.points += value;
            data.badges = Math.floor(data.points / 50);
            data.challenges[challenge] = true;
            db.collection("users").doc(currentUser.uid).set(data)
                .then(() => {
                    loadDashboard();
                    loadLeaderboard();
                    alert(`🎉 Challenge completed! You earned ${value} points.`);
                });
        } else {
            alert("✅ Challenge already completed!");
        }
    });
}

// Farm Simulation
function startSimulation() {
    const harvest = Math.floor(Math.random() * 50) + 10;
    db.collection("users").doc(currentUser.uid).get().then(doc => {
        let data = doc.data();
        data.points += harvest;
        data.badges = Math.floor(data.points / 50);
        db.collection("users").doc(currentUser.uid).set(data)
            .then(() => {
                loadDashboard();
                loadLeaderboard();
                alert(`🌾 Simulation complete! You earned ${harvest} points.`);
            });
    });
}

// Leaderboard
function loadLeaderboard() {
    db.collection("users").orderBy("points", "desc").limit(10).get().then(snapshot => {
        const list = document.getElementById("leaderboard-list");
        list.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement("li");
            li.innerText = `${doc.id} - ${data.points} pts`;
            list.appendChild(li);
        });
    });
}

// Auth listener
auth.onAuthStateChanged(user => {
    if(user) {
        currentUser = user;
        loadDashboard();
        loadLeaderboard();
    }
});
