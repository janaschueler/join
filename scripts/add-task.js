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
        console.log("Lade Kontakte aus Firebase...");
        const response = await fetch(`${BASE_URL}/contacts.json`);

        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Kontakte! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data) {
            console.warn("Keine Kontakte in Firebase gefunden!");
            return;
        }

        contacts = Object.entries(data).map(([id, contact]) => ({
            id,
            name: contact.name || "Unbekannt",
            email: contact.email || "",
            color: contact.color || getRandomColor()
        }));

        console.log("Kontakte erfolgreich geladen:", contacts);
        populateAssignedToSelect(contacts);
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
    }
}

async function saveContact(contact) {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`, {
            method: "POST", // Firebase erstellt eine eigene ID
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Speichern des Kontakts: ${response.status}`);
        }

        console.log("✅ Kontakt gespeichert:", await response.json());
    } catch (error) {
        console.error("Fehler beim Speichern des Kontakts:", error);
    }
}


async function saveSubtask(subtaskText) {
    try {
        const response = await fetch(`${BASE_URL}/subtasks.json`, {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: subtaskText })
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Speichern des Subtasks: ${response.status}`);
        }

        console.log("Subtask gespeichert:", await response.json());
    } catch (error) {
        console.error("Fehler beim Speichern des Subtasks:", error);
    }
}


async function addTask() {
    const title = document.getElementById("inputField").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("due-date").value.trim();
    const category = document.getElementById("category").value;

    const selectedCheckboxes = document.querySelectorAll('#assigned-select option:checked');
    const selectedContactIds = Array.from(selectedCheckboxes).map(option => option.value);
    const assignedContacts = contacts.filter(contact => selectedContactIds.includes(contact.id));

    if (!title || !dueDate || !category || !selectedPriority) {
        alert("Bitte alle Pflichtfelder ausfüllen und eine Priorität auswählen.");
        return;
    }

    const subtaskItems = document.querySelectorAll(".subtask-text");
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

    try {
        const response = await fetch(`${BASE_URL}/tasks.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Speichern der Aufgabe: ${response.status}`);
        }

        console.log("✅ Aufgabe erfolgreich gespeichert:", await response.json());
        
        
        window.location.href = "board.html";

    } catch (error) {
        console.error("Fehler beim Speichern der Aufgabe:", error);
        alert("Es gab einen Fehler beim Speichern der Aufgabe. Bitte prüfe die Konsole.");
    }
}

async function fetchSubtasks() {
    try {
        console.log("📡 Lade Subtasks...");
        const response = await fetch(`${BASE_URL}/subtasks.json`);

        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Subtasks! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data) {
            console.warn("Keine Subtasks in Firebase gefunden!");
            return;
        }

        const subtasks = Object.entries(data).map(([id, subtask]) => ({
            id,
            text: subtask.text
        }));

        console.log("Subtasks erfolgreich geladen:", subtasks);
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

async function addSubtask() {
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

    const subtaskData = { text: subTaskInput };
    await saveSubtask(subTaskInput);  

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


function populateAssignedToSelect(contacts) {
    const selectElement = document.getElementById("assigned-select");
    if (!selectElement) {
        console.error("Fehler: Element mit ID 'assigned-select' nicht gefunden!");
        return;
    }

    // Standardoption beibehalten
    selectElement.innerHTML = `<option value="">Select contacts to assign</option>`;

    contacts.forEach((contact) => {
        const option = document.createElement("option");
        option.value = contact.id;
        option.textContent = contact.name;
        option.dataset.contact = JSON.stringify(contact);
        selectElement.appendChild(option);
    });
}

function handleContactSelection(event) {
    const selectedContactId = event.target.value;
    if (!selectedContactId) return;

    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedContact = JSON.parse(selectedOption.dataset.contact);

    if (!selectedContact) return;

    updateSelectedContacts(selectedContact, true);
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

    const selectElement = document.getElementById("assigned-select");
    if (selectElement) {
        selectElement.value = "";
    }
}

function getInitials(name) {
    return name.split(" ").map(word => word[0]).join("").toUpperCase();
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener("DOMContentLoaded", fetchContacts);
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
