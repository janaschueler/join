const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allData = [];
console.log(allData);

function init() {
    fetchData();
    renderSummary();
    renderTopBarSummary();
}

async function fetchData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let data = await response.json();
    allData.push(data.tasks);
    return data;
}

function renderSummary() {
    let summaryRef = document.getElementById('summary_content');
    for (let i = 0; i < allData.length; i++) {
        
        
        const current = allData[i];        
    }
    summaryRef.innerHTML += templateSummary();
}
