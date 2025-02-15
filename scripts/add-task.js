const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";
let tasks = [];
let subTaskCount;

function addTask() {
  const title = document.getElementById("inputField").value.trim();
  const description = document.getElementById("description").value.trim();
  const assignedTo = document.getElementById("assigned").value.trim();
  const dueDate = document.getElementById("due-date").value.trim();
  const category = document.getElementById("category").value.trim();

  const subtasksInputs = document.querySelectorAll(".add-subtask input");
  const subtasks = Array.from(subtasksInputs)
    .map((input) => input.value.trim())
    .filter((value) => value !== "");

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
    createdAt: new Date().toISOString(),
  };

  fetch(`${BASE_URL}/tasks.json`, {
    method: "POST",
    body: JSON.stringify(taskData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

document.querySelectorAll(".priority button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".priority button").forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

function clearForm() {
  document.getElementById("inputField").value = "";
  document.getElementById("description").value = "";
  document.getElementById("assigned").selectedIndex = 0;
  document.getElementById("due-date").value = "";
  document.getElementById("category").selectedIndex = 0;

  let subtaskInputs = document.querySelectorAll(".add-subtask input");
  subtaskInputs.forEach((input) => (input.value = ""));
}

let selectedPriority = null; // Einzelne Priorität (oder null)
let contacts = []; // Hier werden die Kontakte gespeichert
let subtaskClickCount = 0; // Zähler für Subtask-Vorschläge

// --- Initialisierung ---

function initAddTask() {
  initPriorityButtons();
  fetchContacts(); // Kontakte laden *bevor* das Formular gerendert wird
}

// --- Prioritäts-Buttons ---

function initPriorityButtons() {
  const priorityButtons = document.querySelectorAll(".priority button");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      handlePriorityClick(button);
    });
  });
}

function handlePriorityClick(clickedButton) {
  const priorityValue = clickedButton.classList[0]; // "urgent", "medium" oder "low"
  const priorityButtons = document.querySelectorAll(".priority button");

  if (selectedPriority === priorityValue) {
    clickedButton.classList.remove("selected");
    resetButtonState(clickedButton);
    selectedPriority = null;
  } else {
    priorityButtons.forEach((button) => {
      if (button !== clickedButton) {
        button.classList.remove("selected");
        resetButtonState(button);
      }
    });
    clickedButton.classList.add("selected");
    selectedPriority = priorityValue;
    highlightButton(clickedButton);
  }
  console.log("Ausgewählte Priorität:", selectedPriority);
}

function resetButtonState(button) {
  if (button.classList.contains("urgent")) {
    button.style.backgroundColor = "#FFFFFF";
    button.querySelector("img").src = "assets/icons/urgent.svg";
  } else if (button.classList.contains("medium")) {
    button.style.backgroundColor = "#FFFFFF";
    button.querySelector("img").src = "assets/icons/medium.svg";
  } else if (button.classList.contains("low")) {
    button.style.backgroundColor = "#FFFFFF";
    button.querySelector("img").src = "assets/icons/low.svg";
  }
  button.style.color = "black";
}

function highlightButton(button) {
  if (button.classList.contains("urgent")) {
    button.style.backgroundColor = "#FF3D00";
    button.querySelector("img").src = "assets/icons/urgent-white.svg";
    button.style.color = "white";
  } else if (button.classList.contains("medium")) {
    button.style.backgroundColor = "#FFA800";
    button.querySelector("img").src = "assets/icons/medium-white.svg";
    button.style.color = "white";
  } else if (button.classList.contains("low")) {
    button.style.backgroundColor = "#7AE229";
    button.querySelector("img").src = "assets/icons/low-white.svg";
    button.style.color = "white";
  }
}

function addSubtask() {
  let subTaskInputRef = document.getElementById("new-subtask-input");
  let subTaskInput = subTaskInputRef.value;

  let subTaskContainer = document.getElementById("subtasks-container");

  if (!subTaskInput) {
    return;
  }
  if (!subTaskCount) {
    subTaskCount = 0;
  }
  subTaskCount = subTaskCount + 1;
  subTaskContainer.innerHTML += addSubtaskTemplate(subTaskInput, subTaskCount);
  subTaskInputRef.value = "";
}

function deleteSubtask(id) {
  const removeSubtask = document.getElementById(`subTaskUnit${id}`);
  removeSubtask.remove();
}

// --- Kontakt-Funktionen ---
function createContactSVG(contact) {
  const initials = contact.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("fill", "none");
  svg.classList.add("circle", "small_circle");

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "16");
  circle.setAttribute("cy", "16");
  circle.setAttribute("r", "15.5");
  circle.setAttribute("fill", contact.color || "#ccc");
  circle.setAttribute("stroke", "white");

  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "50%");
  text.setAttribute("y", "50%");
  text.setAttribute("font-family", "Arial");
  text.setAttribute("font-size", "10");
  text.setAttribute("fill", "white");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("alignment-baseline", "central");
  text.textContent = initials;

  svg.appendChild(circle);
  svg.appendChild(text);
  return svg;
}

function populateAssignedToSelect(contacts) {
  const assignedToSelect = document.getElementById("assigned");
  assignedToSelect.innerHTML = '<option value="">Select contacts to assign</option>';

  contacts.forEach((contact) => {
    const option = document.createElement("option");
    option.value = contact.id;

    const optionContent = document.createElement("div");
    optionContent.style.display = "flex";
    optionContent.style.alignItems = "center";

    const svgContainer = document.createElement("div");
    svgContainer.appendChild(createContactSVG(contact));
    svgContainer.style.marginRight = "8px";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = contact.name;

    optionContent.appendChild(svgContainer);
    optionContent.appendChild(nameSpan);
    option.appendChild(optionContent);

    assignedToSelect.appendChild(option);
  });
}

function fetchContacts() {
  fetch(`${BASE_URL}/contacts.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((contactData) => {
      if (contactData) {
        contacts = Object.entries(contactData).map(([id, data]) => ({
          id,
          ...data,
          color: data.color || getRandomColor(),
        }));
        populateAssignedToSelect(contacts);
      }
    })
    .catch((error) => {
      console.error("Error fetching contacts:", error);
      alert("Error fetching contacts. See console for details.");
    });
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// --- addTask und clearForm ---

function addTask() {
  const title = document.getElementById("inputField").value.trim();
  const description = document.getElementById("description").value.trim();
  const assignedToSelect = document.getElementById("assigned");
  const dueDate = document.getElementById("due-date").value.trim();
  const category = document.getElementById("category").value;
  const selectedContactIds = Array.from(assignedToSelect.selectedOptions).map((option) => option.value);
  const assignedContacts = selectedContactIds
    .map((contactId) => {
      const contact = contacts.find((c) => c.id === contactId);
      return contact ? contact.name : null;
    })
    .filter((name) => name !== null);

  if (!title || !dueDate || !category || !selectedPriority) {
    alert("Bitte alle Pflichtfelder ausfüllen und eine Priorität auswählen.");
    return;
  }

  const subtaskItems = document.querySelectorAll(".subtask-text-item");
  const subtasks = Array.from(subtaskItems).map((item) => item.textContent.replace("• ", "").trim());

  const taskData = {
    title,
    description,
    assignedTo: assignedContacts,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks,
    createdAt: new Date().toISOString(),
  };

  fetch(`${BASE_URL}/tasks.json`, {
    method: "POST",
    body: JSON.stringify(taskData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Task added:", data);
      clearForm();
      window.location.href = "board.html";
    })
    .catch((error) => {
      console.error("Error adding task:", error);
      alert("There was an error adding the task.  Please check the console for details.");
    });
}

function clearForm() {
  document.getElementById("inputField").value = "";
  document.getElementById("description").value = "";
  document.getElementById("assigned").selectedIndex = 0;
  document.getElementById("due-date").value = "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("new-subtask-input").value = "";
  const subtasksContainer = document.getElementById("subtasks-container");
  subtasksContainer.innerHTML = "";
  subtaskClickCount = 0;

  const inputField = document.getElementById("new-subtask-input");
  if (inputField) {
    removeInputButtons(inputField);
    inputField.classList.remove("plus-active");
  }

  const priorityButtons = document.querySelectorAll(".priority button");
  priorityButtons.forEach((button) => {
    button.classList.remove("selected");
    resetButtonState(button);
  });
  selectedPriority = null;
}

function init() {
  initAddTask();
}
