const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";
let tasks = [];

function addTask() {
    
    const title = document.getElementById("inputField").value.trim();
    const description = document.getElementById("description").value.trim();
    const assignedTo = document.getElementById("assigned").value.trim();
    const dueDate = document.getElementById("due-date").value.trim();
    const category = document.getElementById("category").value.trim();
   
    const subtasksInputs = document.querySelectorAll(".add-subtask input");
    const subtasks = Array.from(subtasksInputs).map(input => input.value.trim()).filter(value => value !== "");


    let priority = document.querySelector(".priority .selected")?.textContent || "Medium";

    if (!title || !dueDate || !category) {
        alert("Bitte alle Pflichtfelder ausfüllen.");
        return;
    }

    const taskData = {
        title,
        description,
        assignedTo,
        dueDate,
        category,
        priority,
        subtasks,
        createdAt: new Date().toISOString() 
    };

  
    fetch(`${BASE_URL}/tasks.json`, {
        method: "POST",
        body: JSON.stringify(taskData),
        headers: {
            "Content-Type": "application/json"
        }
    });
}


document.querySelectorAll(".priority button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".priority button").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});



function clearForm() {
    document.getElementById("inputField").value = "";
    document.getElementById("description").value = "";
    document.getElementById("assigned").selectedIndex = 0; 
    document.getElementById("due-date").value = "";
    document.getElementById("category").selectedIndex = 0;  

    let subtaskInputs = document.querySelectorAll('.add-subtask input');
    subtaskInputs.forEach(input => input.value = "");
}
