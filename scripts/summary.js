const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = [];

async function init() {
    await fetchData();
    renderTopBarSummary();
    renderSummary();
    renderStatus()
}

async function fetchData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let data = await response.json();
    if (data.tasks) {
        Object.values(data.tasks).forEach(task => allTasks.push(task));
    }
    return data;
}

function renderSummary() {
    let summaryRef = document.getElementById('summary_content');
    for (let i = 0; i < allTasks.length; i++) {
        const currentData = allTasks[i];
        summaryRef.innerHTML = templateSummary(currentData);
    }
}

function renderStatus() {
    findTasksBoard();
    findStatusOne();
    findStatusFour();
    findStatusThree();
    findStatusTwo();
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