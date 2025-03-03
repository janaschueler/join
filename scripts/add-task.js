let BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = [];
let selectedPriority = null;
let contacts = [];
let selectedContacts = [];
let subTaskCount;
let subtaskClickCount = 0;

function init() {
  fetchContacts();
  initPriorityButtons();
}

function toggleDropdown(event) {
  event.stopPropagation();

  const dropdown = document.getElementById("assigned-dropdown");
  const iconDown = document.querySelector(".dropDown");
  const iconUp = document.querySelector(".dropDown-up");

  dropdown.classList.toggle("visible");

  if (dropdown.classList.contains("visible")) {
    iconDown.style.display = "none";
    iconUp.style.display = "block";
  } else {
    iconDown.style.display = "block";
    iconUp.style.display = "none";
  }
}

function toggleCategoryDropdown() {
  const dropdown = document.getElementById("category-dropdown");
  dropdown.classList.toggle("visible");
}

// Schließt das Dropdown, wenn außerhalb geklickt wird
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("category-dropdown");
  const inputField = document.getElementById("category-input");

  if (!dropdown || !inputField) return; // Falls eins der Elemente nicht existiert, Funktion abbrechen

  if (!inputField.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("visible");
  }
});

function selectCategory(label, value) {
  document.querySelector("#category-input span").textContent = label;
  document.getElementById("category").value = label; // Speichert den Wert im versteckten Input
  document.getElementById("category-dropdown").classList.remove("visible");

  // Entferne alte Markierung und markiere die gewählte Option
  document.querySelectorAll("#category-dropdown .dropdown-option").forEach((option) => {
    option.classList.remove("selected");
  });
  event.target.classList.add("selected");
}

// **Kontakte aus Firebase abrufen**
async function fetchContacts() {
  try {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    contacts = Object.entries(data || {}).map(([id, contact]) => ({
      id,
      name: contact.name || "Unbekannt",
      email: contact.email || "",
      color: contact.color || getRandomColor(),
    }));

    populateAssignedToSelect();
  } catch (error) {
    console.error("Fehler beim Abrufen der Kontakte:", error);
  }
}

async function addTask(statusTask) {
  const title = document.getElementById("inputField").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("due-date").value.trim();
  const category = document.getElementById("category").value;
  const assignedContacts = selectedContacts;
  const status = determineStatusAddTask(statusTask);

  if (!title || !dueDate || !category || !selectedPriority) {
    alert("Bitte alle Pflichtfelder ausfüllen und eine Priorität auswählen.");
    return;
  }

  const subtaskItems = document.querySelectorAll(".subtask-text");
  const subtasks = Array.from(subtaskItems).map((item) => item.textContent.trim());

  const taskData = {
    title,
    description,
    assignedContacts: assignedContacts,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks,
    createdAt: new Date().toISOString(),
    status,
  };

  try {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
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

function determineStatusAddTask(statusTask) {
  let status;
  if (!statusTask) {
    status = 1;
  } else {
    status = statusTask;
  }
  return status;
}

async function saveSubtask(subtaskText) {
  try {
    const response = await fetch(`${BASE_URL}/subtasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: subtaskText }),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Speichern des Subtasks: ${response.status}`);
    }

    console.log("Subtask gespeichert:", await response.json());
  } catch (error) {
    console.error("Fehler beim Speichern des Subtasks:", error);
  }
}

function populateAssignedToSelect() {
  const dropdown = document.getElementById("assigned-dropdown");
  if (!dropdown) {
    return;
  }

  dropdown.innerHTML = ""; // Zurücksetzen

  contacts.forEach((contact) => {
    const label = document.createElement("label");
    label.classList.add("customCheckboxContainer");

    // Standard Checkbox (versteckt)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("contact-checkbox");
    checkbox.id = `contact-${contact.id}`;
    checkbox.name = `contact-${contact.id}`;
    checkbox.value = contact.id;

    // Benutzerdefinierte Checkbox
    const customCheckbox = document.createElement("span");
    customCheckbox.classList.add("customCheckbox");

    // SVG-Profilbild
    const svgContainer = document.createElement("div");
    svgContainer.classList.add("svg-container");
    svgContainer.style.backgroundColor = contact.color;
    svgContainer.innerHTML = `<span class="contact-initials">${getInitials(contact.name)}</span>`;

    // Name des Kontakts
    const contactName = document.createElement("span");
    contactName.classList.add("subtasksUnit");
    contactName.textContent = contact.name;

    // Flex-Container für Name + Checkbox
    const contactRow = document.createElement("div");
    contactRow.classList.add("contact-row");
    contactRow.appendChild(svgContainer);
    contactRow.appendChild(contactName);
    contactRow.appendChild(customCheckbox);

    // Falls der Kontakt bereits ausgewählt wurde, Checkbox aktivieren
    if (selectedContacts.some((c) => c.id === contact.id)) {
      checkbox.checked = true;
      label.classList.add("checked");
    }

    // Event-Listener für Checkbox
    checkbox.addEventListener("change", function () {
      toggleContactSelection(contact.id, contact.name, contact.color);
    });

    // Zusammenbauen
    label.appendChild(checkbox);
    label.appendChild(contactRow);
    dropdown.appendChild(label);
  });
}

function createContactSVG(contact) {
  const initials = getInitials(contact.name);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "32");
  svg.setAttribute("height", "32");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("fill", "none");

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
  text.setAttribute("font-size", "12"); // Etwas größer für bessere Sichtbarkeit
  text.setAttribute("fill", "white"); // Farbe der Initialen auf Weiß setzen
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("alignment-baseline", "middle");
  text.textContent = initials;

  svg.appendChild(circle);
  svg.appendChild(text);
  return svg;
}

window.toggleContactSelection = function (contactId, contactName, contactColor) {
  const checkbox = document.getElementById(`contact-${contactId}`);
  const container = checkbox.closest(".customCheckboxContainer");
  const input = document.getElementById("search-contacts");

  if (!checkbox) return;

  if (checkbox.checked) {
    if (!selectedContacts.some((c) => c.id === contactId)) {
      container.classList.add("checked");
      selectedContacts.push({ id: contactId, name: contactName, color: contactColor });
      input.value = "";
      filterContacts();
    }
  } else {
    container.classList.remove("checked");
    selectedContacts = selectedContacts.filter((c) => c.id !== contactId);
  }

  updateSelectedContacts();
};

function updateSelectedContacts() {
  const selectedContactsContainer = document.getElementById("selected-contacts");
  selectedContactsContainer.innerHTML = "";

  selectedContacts.forEach((contact) => {
    const contactElement = document.createElement("div");
    contactElement.classList.add("selected-contact");
    contactElement.style.backgroundColor = contact.color;

    contactElement.innerHTML = `
          <span class="selected-contact-initials">${getInitials(contact.name)}</span>`;

    selectedContactsContainer.appendChild(contactElement);
  });
}

function removeSelectedContact(contactId) {
  selectedContacts = selectedContacts.filter((contact) => contact.id !== contactId);

  const checkbox = document.getElementById(`contact-${contactId}`);
  if (checkbox) {
    checkbox.checked = false;
  }

  updateSelectedContacts();
}

/* **Kontakte filtern** */
function filterContacts() {
  const searchTerm = document.getElementById("search-contacts").value.toLowerCase();
  document.querySelectorAll(".customCheckboxContainer").forEach((label) => {
    const name = label.querySelector(".subtasksUnit").textContent.toLowerCase();
    label.style.display = name.includes(searchTerm) ? "flex" : "none";
  });
}
// ** Initialen aus Namen generieren **
function getInitials(name) {
  if (!name) return "??";

  const initials = name
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials.length > 0 ? initials : name[0].toUpperCase();
}

function deleteSubtask(id) {
  const removeSubtask = document.getElementById(`subTaskUnit${id}`);
  removeSubtask.remove();
}

function editSubtask(id, subTaskInput) {
  let editSubtask = document.getElementById(`subTaskUnit${id}`);
  editSubtask.innerHTML = "";
  editSubtask.classList.add("editing");
  editSubtask.innerHTML = addInputField(id, subTaskInput);
}

function accept(id) {
  let subTaskContainer = document.getElementById("subtasks-container");
  let newSubTask = document.getElementById(`inputSubtask${id}`).value;

  const removeSubtask = document.getElementById(`subTaskUnit${id}`);
  removeSubtask.remove();

  subTaskContainer.innerHTML += addSubtaskTemplate(newSubTask, id);
}

function clearForm() {
  document.getElementById("inputField").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("selected-contacts").innerHTML = "";
  selectedContacts = [];
  selectedPriority = null;
}

// **Zufällige Farbe für Kontakte generieren**
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// **Prioritäts-Buttons initialisieren**
// function initPriorityButtons() {
//   const priorityButtons = document.querySelectorAll(".priority button");
//   priorityButtons.forEach((button) => {
//     button.addEventListener("click", (event) => {
//       event.preventDefault();
//       handlePriorityClick(button);
//     });
//   });

//   const defaultMediumButton = document.querySelector(".priority .medium");
//   if (defaultMediumButton) {
//     handlePriorityClick(defaultMediumButton);
//   }
// }

function initPriorityButtons(priority) {
  const priorityButtons = document.querySelectorAll(".priority button");

  priorityButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      handlePriorityClick(button);
    });
  });

  const defaultMediumButton = document.querySelector(".priority .medium");

  if (!priority) {
    handlePriorityClick(defaultMediumButton);
  } else {
    const priorityButton = document.querySelector(`.priority .${priority}`);
    if (priorityButton) {
      handlePriorityClick(priorityButton);
    } else {
      console.warn("Invalid priority, falling back to default.");
      handlePriorityClick(defaultMediumButton);
    }
  }
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

  console.log("Ausgewählte Priorität:", selectedPriority);
}

function resetButtonState(button) {
  button.style.backgroundColor = "#FFFFFF";
  button.style.color = "black";

  const priorityColors = {
    urgent: "#FF3D00",
    medium: "#FFA800",
    low: "#7AE229",
  };

  const svgPaths = button.querySelectorAll("svg path");
  svgPaths.forEach((path) => {
    path.style.fill = priorityColors[button.classList[0]];
  });
}

function highlightButton(button) {
  const priorityColors = {
    urgent: "#FF3D00",
    medium: "#FFA800",
    low: "#7AE229",
  };

  button.style.backgroundColor = priorityColors[button.classList[0]];
  button.style.color = "white";

  const svgPaths = button.querySelectorAll("svg path");
  svgPaths.forEach((path) => {
    path.style.fill = "white";
  });
}

function start() {
  fetchContacts();
  initPriorityButtons();
  renderTopBar();
}

function openDatePicker() {
  let dateInput = document.getElementById("due-date");
  dateInput.showPicker(); // Funktioniert in modernen Browsern wie Chrome
}

function openEditTask(category, title, description, DueDate, priority, id) {
  const editTaskContainer = document.getElementById("modalAddTask");
  editTaskContainer.innerHTML = "";
  editTaskContainer.innerHTML = addEditTask(category, title, description, DueDate, priority, id);
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

  subTaskContainer.innerHTML += addSubtaskTemplate(subTaskInput, subTaskCount);
  subTaskInputRef.value = "";
  resetButton();
}

function clearForm() {
  document.getElementById("new-subtask-input").value = "";
  resetButton();
}

function transformButton() {
  const buttonContainer = document.getElementById("iconAddButton");
  buttonContainer.outerHTML = `
      <button id="clearInput" onclick="resetButton()" class="editSubtask"></button>
      <span class="clearSubtask"></span>
      <span class="lineSubtaskAddnewSubtask"></span>
      <button id="editBtnModal" onclick="addSubtask()" class="acceptBtnSubtask"></button>
  `;
}

function resetButton() {
  const inputWrapper = document.getElementById("inputWrapper");

  inputWrapper.innerHTML = `
      <input 
          type="text" 
          id="new-subtask-input" 
          placeholder="add new sub task" 
          onfocus="transformButton()" 
          onblur="resetButton()" 
      />
      <button id="iconAddButton" class="iconAdd" type="button" onclick="addSubtask()"></button>
  `;
}
