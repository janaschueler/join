const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = [];
let signedInName;

async function init() {
    await fetchData();
    renderTopBar();
    renderSummary();
    renderAllStatus(); 
    greetings()   
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
        const currentData = allTasks[i];
        summaryRef.innerHTML = templateSummary(signedInName); 
              
    }        
}

function greetings() {
    let greetingsRef = document.getElementById('greeting_content');
    let currentHour = new Date().getHours();
    let greeting;
    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good Morning,";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good Afternoon,";
    } else {
        greeting = "Good Evening,";
    }
    greetingsRef.textContent = greeting;
}

function renderAllStatus() {
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
    let foundTasks = allTasks.length;      
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findStatusOne() {
    let toDoRef = document.getElementById('toDoOne_content');
    let foundTasks = allTasks.filter(element => element.status === 1).length;    
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findStatusTwo() {
    let toDoRef = document.getElementById('toDoTwo_content');
    let foundTasks = allTasks.filter(element => element.status === 2).length;    
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findStatusThree() {
    let toDoRef = document.getElementById('toDoThree_content');
    let foundTasks = allTasks.filter(element => element.status === 3).length;    
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findStatusFour() {
    let toDoRef = document.getElementById('toDoFour_content');
    let foundTasks = allTasks.filter(element => element.status === 4).length;    
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findUrgent () {
    let urgentRef = document.getElementById('urgent_content');    
    let foundUrgent = allTasks.filter(element => element.priority === "urgent").length;    
    urgentRef.innerHTML = `<div>${foundUrgent}</div>`;
}

function findDeadline() {
    let deadlineRef = document.getElementById('deadline_content');
    let farthestDate = allTasks
        .map(task => task.dueDate) 
        .sort((a, b) => new Date(b) - new Date(a))[0]; 
    deadlineRef.textContent = farthestDate || "No deadlines found.";
}