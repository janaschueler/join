const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = [];
let signedInName;

async function init() {
    let checkedAuthority = await checkAccessAuthorization();
    if (checkedAuthority) {
        await fetchData();
        renderTopBar();
        renderSummary();
        await renderAllStatus();
        greetings();
        disableLoadingSpinner();
    } else {
        window.location.href = "login.html";
    }
}

async function fetchData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let data = await response.json();
    signedInName = data.signedIn.contactName[0];
    if (data.tasks) {
        Object.values(data.tasks).forEach(task => allTasks.push(task));
    }
    return data;
}

function renderSummary() {
    let summaryRef = document.getElementById('summary_content');
    for (let i = 0; i < allTasks.length; i++) {
        summaryRef.innerHTML = templateSummary(signedInName);
    }
}

function disableLoadingSpinner() {
    let loadingSpinnerRef = document.getElementById('spinner_content');
    function updateSpinnerVisibility() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            loadingSpinnerRef.classList.add('d_none');
        } else {
            loadingSpinnerRef.classList.remove('d_none');
        }
    }
    setTimeout(() => {
        updateSpinnerVisibility();
        window.addEventListener("resize", updateSpinnerVisibility);
    }, 1500);
}

function greetings() {
    let greetingsRef = document.getElementById('greeting_content');
    let greetingsMobileRef = document.getElementById('greeting_Mobile_content');
    let currentHour = new Date().getHours();
    let greeting;
    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }
    greetingsRef.textContent = greeting;
    greetingsMobileRef.textContent = greeting;
}

async function renderAllStatus() {
    findTasksBoard();
    findStatusOne();
    findStatusFour();
    findStatusThree();
    findStatusTwo();
    findUrgent();
    findDeadline();
}

function findTasksBoard() {
    let toDoRef = document.getElementById('toDoBoard_content');
    let foundTasks = allTasks.length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findStatusOne() {
    let toDoRef = document.getElementById('toDoOne_content');
    let foundTasks = allTasks.filter(element => element.status === 1).length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findStatusTwo() {
    let toDoRef = document.getElementById('toDoTwo_content');
    let foundTasks = allTasks.filter(element => element.status === 2).length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findStatusThree() {
    let toDoRef = document.getElementById('toDoThree_content');
    let foundTasks = allTasks.filter(element => element.status === 3).length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findStatusFour() {
    let toDoRef = document.getElementById('toDoFour_content');
    let foundTasks = allTasks.filter(element => element.status === 4).length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findUrgent() {
    let urgentRef = document.getElementById('urgent_content');
    let foundUrgent = allTasks.filter(element => element.priority === "urgent").length || 0;
    urgentRef.innerHTML = `<div>${foundUrgent}</div>`;
}

function findDeadline() {
    let deadlineRef = document.getElementById('deadline_content');
    let today = new Date().toISOString().split('T')[0];
    let nextDate = allTasks
        .filter(task => task.dueDate >= today)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .map(task => task.dueDate)[0];
    deadlineRef.textContent = nextDate || "No upcoming deadlines.";
}