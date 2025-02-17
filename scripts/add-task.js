const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";
let tasks = [];
let subTaskCount;
let selectedPriority = null;
let contacts = [];
let subtaskClickCount = 0;

function initAddTask() {
    initPriorityButtons();
    fetchContacts();
    fetchSubtasks();
 
   
}




function toggleDropdown() {
    const dropdownContent = document.getElementById("dropdown-content");
    if (!dropdownContent) {
        console.error("Fehler: Element mit ID 'dropdown-content' nicht gefunden!");
        return;
    }
    dropdownContent.classList.toggle("visible");
}

async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        contacts = Object.entries(data || {}).map(([id, contact]) => ({
            id,
            name: contact.name || "Unbekannt",
            email: contact.email || "",
            color: contact.color || getRandomColor()
        }));

        populateAssignedToSelect(contacts);
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
    }
}

async function fetchSubtasks() {
    try {
        const response = await fetch(`${BASE_URL}/subtasks.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data) {
            return;
        }

        const subtasks = Object.entries(data).map(([id, subtask]) => ({
            id,
            text: subtask.text
        }));

        displaySubtasks(subtasks);
    } catch (error) {
        console.error("Fehler beim Abrufen der Subtasks:", error);
    }
}

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
    const priorityValue = clickedButton.classList[0];
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
}



function resetButtonState(button) {
    button.style.backgroundColor = "#FFFFFF";
    button.style.color = "black";
    button.querySelector("img").src = `assets/icons/${button.classList[0]}.svg`;
}

function highlightButton(button) {
    const priorityColors = {
        urgent: "#FF3D00",
        medium: "#FFA800",
        low: "#7AE229"
    };

    button.style.backgroundColor = priorityColors[button.classList[0]];
    button.style.color = "white";
    button.querySelector("img").src = `assets/icons/${button.classList[0]}-white.svg`;
}

function addSubtask() {
    let subTaskInputRef = document.getElementById("new-subtask-input");
    let subTaskInput = subTaskInputRef.value.trim();
    let subTaskContainer = document.getElementById("subtasks-container");

    if (!subTaskInput) {
        return;
    }

    if (!subTaskCount) {
        subTaskCount = 0;
    }

    subTaskCount += 1;

    const subtaskElement = document.createElement("div");
    subtaskElement.id = `subTaskUnit${subTaskCount}`;
    subtaskElement.classList.add("subtask-item");
    subtaskElement.innerHTML = `
        <span class="subtask-text">${subTaskInput}</span>
        <button onclick="deleteSubtask(${subTaskCount})">X</button>
    `;

    subTaskContainer.appendChild(subtaskElement);
    subTaskInputRef.value = "";
}

function deleteSubtask(id) {
    const removeSubtask = document.getElementById(`subTaskUnit${id}`);
    removeSubtask.remove();
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function createContactSVG(contact, size = 32) {
    const initials = contact.name.split(" ").map(word => word[0]).join("").toUpperCase();
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 32 32");
    svg.setAttribute("fill", "none");
    svg.classList.add("contact-svg");

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "16");
    circle.setAttribute("cy", "16");
    circle.setAttribute("r", "15");
    circle.setAttribute("fill", contact.color || "#ccc");
    circle.setAttribute("stroke", "white");

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "55%");
    text.setAttribute("font-family", "Arial, sans-serif");
    text.setAttribute("font-size", "12");
    text.setAttribute("fill", "white");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.textContent = initials;

    svg.appendChild(circle);
    svg.appendChild(text);
    return svg;
}

function updateSelectedContacts(contact, isChecked) {
    const selectedContactsContainer = document.getElementById("selected-contacts");
    if (isChecked) {
        if (!document.getElementById(`selected-${contact.id}`)) {
            const contactElement = document.createElement("div");
            contactElement.id = `selected-${contact.id}`;
            contactElement.classList.add("selected-contact");
            contactElement.style.backgroundColor = contact.color;
            contactElement.innerHTML = `
                <span class="selected-contact-initials">${getInitials(contact.name)}</span>
                <button class="remove-contact-btn" onclick="removeSelectedContact('${contact.id}')">X</button>
            `;
            selectedContactsContainer.appendChild(contactElement);
        }
    } else {
        removeSelectedContact(contact.id);
    }
}

function removeSelectedContact(contactId) {
    const contactElement = document.getElementById(`selected-${contactId}`);
    if (contactElement) {
        contactElement.remove();
    }
    const checkbox = document.querySelector(`input[data-contact-id="${contactId}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
}

function getInitials(name) {
    return name.split(" ").map(word => word[0]).join("").toUpperCase();
}


function addTask() {
    const title = document.getElementById("inputField").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("due-date").value.trim();
    const category = document.getElementById("category").value;

    const selectedCheckboxes = document.querySelectorAll('#assigned .dropdown-content input[type="checkbox"]:checked');
    const selectedContactIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.contactId);
    const assignedContacts = contacts.filter(contact => selectedContactIds.includes(contact.id));

    if (!title || !dueDate || !category || !selectedPriority) {
        alert("Bitte alle Pflichtfelder ausfüllen und eine Priorität auswählen.");
        return;
    }

    const subtaskItems = document.querySelectorAll(".subtask-text-item");
    const subtasks = Array.from(subtaskItems).map(item => item.textContent.trim());

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
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Task added:", data);
        clearForm();
        window.location.href = "board.html";
    })
    .catch(error => {
        console.error("Error adding task:", error);
        alert("There was an error adding the task. Please check the console for details.");
    });
}

function populateAssignedToSelect(contacts) {
    const assignedToSelect = document.getElementById("assigned");
    if (!assignedToSelect) {
        console.error("Fehler: Element mit ID 'assigned' nicht gefunden!");
        return;
    }
}


function populateAssignedToSelect(contacts) {
    const dropdownContent = document.getElementById("dropdown-content");
    if (!dropdownContent) {
        console.error("Fehler: Element mit ID 'dropdown-content' nicht gefunden!");
        return;
    }

    // Lösche nur alte Kontakte, aber nicht das Dropdown selbst
    dropdownContent.innerHTML = "";

    contacts.forEach((contact) => {
        const label = document.createElement("label");
        label.classList.add("dropdown-option");

        const optionContent = document.createElement("div");
        optionContent.classList.add("option-content");

        // SVG-Icon für den Kontakt
        const contactSVG = createContactSVG(contact, 32);

        // Name des Kontakts
        const nameSpan = document.createElement("span");
        nameSpan.textContent = contact.name;
        nameSpan.classList.add("contact-name");

        // Checkbox für Auswahl
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = contact.id;
        checkbox.dataset.contactId = contact.id;
        checkbox.classList.add("contact-checkbox");
        checkbox.addEventListener("change", () => updateSelectedContacts(contact, checkbox.checked));

        const leftContent = document.createElement("div");
        leftContent.classList.add("dropdown-left");
        leftContent.appendChild(contactSVG);
        leftContent.appendChild(nameSpan);

        optionContent.appendChild(leftContent);
        optionContent.appendChild(checkbox);

        label.appendChild(optionContent);
        dropdownContent.appendChild(label);
    });
}


function clearForm() {
    document.getElementById("inputField").value = "";
    document.getElementById("description").value = "";
    document.getElementById("due-date").value = "";
    document.getElementById("category").selectedIndex = 0;
    document.getElementById("new-subtask-input").value = "";
    document.getElementById("subtasks-container").innerHTML = "";
    subtaskClickCount = 0;
    selectedPriority = null;
}

function init() {
    initAddTask();
}
