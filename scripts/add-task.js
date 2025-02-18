const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";
let tasks = [];
let selectedPriority = null;
let contacts = [];
let selectedContacts = [];
let subTaskCount;
let subtaskClickCount = 0;

function init() {
    fetchContacts();
    initPriorityButtons();
    fetchSubtasks();
}

// **Dropdown auf- & zuklappen**
function toggleDropdown() {
    const dropdown = document.getElementById("assigned-dropdown");
    dropdown.classList.toggle("visible");
}

document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("assigned-dropdown");
    const inputField = document.getElementById("assigned-input");

    if (!inputField.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove("visible");
    }
});


function toggleCategoryDropdown() {
  const dropdown = document.getElementById("category-dropdown");
  dropdown.classList.toggle("visible");
}

// Schließt das Dropdown, wenn außerhalb geklickt wird
document.addEventListener("click", function(event) {
  const dropdown = document.getElementById("category-dropdown");
  const inputField = document.getElementById("category-input");

  if (!inputField.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.remove("visible");
  }
});

function selectCategory(label, value) {
  document.getElementById("category-input").textContent = label; // Zeigt die gewählte Kategorie an
  document.getElementById("category").value = value; // Speichert den Wert im versteckten Input
  document.getElementById("category-dropdown").classList.remove("visible");

  // Entferne alte Markierung und markiere die gewählte Option
  document.querySelectorAll("#category-dropdown .dropdown-option").forEach(option => {
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
            color: contact.color || getRandomColor()
        }));

        populateAssignedToSelect();
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
    }
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
      checkbox.dataset.index = "0";
      checkbox.dataset.status = "1";

      // Benutzerdefinierte Checkbox
      const customCheckbox = document.createElement("span");
      customCheckbox.classList.add("customCheckbox");

      // Event: Wenn die Checkbox geändert wird
      checkbox.addEventListener("change", function () {
          if (this.checked) {
              label.classList.add("checked"); // Klasse für aktivierten Zustand hinzufügen
              customCheckbox.style.backgroundImage = "url('../assets/icons/check_withBox.svg')"; // Icon setzen
          } else {
              label.classList.remove("checked");
              customCheckbox.style.backgroundImage = "url('../assets/icons/checkbox_empty.svg')"; 
          }
      });

      // SVG des Kontakts
      const svgContainer = document.createElement("div");
      svgContainer.classList.add("svg-container");
      svgContainer.appendChild(createContactSVG(contact));

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

      // Alles zusammenfügen
      label.appendChild(checkbox); // Die unsichtbare Checkbox kommt vor die Zeile
      label.appendChild(contactRow);
      dropdown.appendChild(label);
  });
}


// **SVG für Kontakte erstellen**
function createContactSVG(contact) {
    const initials = getInitials(contact.name);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "50");
    svg.setAttribute("height", "50");
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
    text.setAttribute("font-size", "10");
    text.setAttribute("fill", "white");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.textContent = initials;

    svg.appendChild(circle);
    svg.appendChild(text);
    return svg;
}

// **Kontakte in der Auswahl anzeigen**
function updateSelectedContacts(contact, isChecked) {
    const selectedContactsContainer = document.getElementById("selected-contacts");

    if (isChecked) {
        if (!selectedContacts.some(c => c.id === contact.id)) {
            selectedContacts.push(contact);
        }
    } else {
        selectedContacts = selectedContacts.filter(c => c.id !== contact.id);
    }

    selectedContactsContainer.innerHTML = "";
    selectedContacts.forEach(contact => {
        const contactElement = document.createElement("div");
        contactElement.classList.add("selected-contact");
        contactElement.style.backgroundColor = contact.color;
        contactElement.innerHTML = `
            <span class="selected-contact-initials">${getInitials(contact.name)}</span>
            <button class="remove-contact-btn" onclick="removeSelectedContact('${contact.id}')">X</button>
        `;
        selectedContactsContainer.appendChild(contactElement);
    });
}

// **Kontakte aus der Auswahl entfernen**
function removeSelectedContact(contactId) {
    selectedContacts = selectedContacts.filter(contact => contact.id !== contactId);
    updateSelectedContacts(null, false);

    const checkbox = document.querySelector(`input[data-contact-id="${contactId}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
}

function getInitials(name) {
    return name.split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
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

function accept(id, subTaskInput) {
  let subTaskContainer = document.getElementById("subtasks-container");

  const removeSubtask = document.getElementById(`subTaskUnit${id}`);
  removeSubtask.remove();

  subTaskContainer.innerHTML += addSubtaskTemplate(subTaskInput, id);
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
function initPriorityButtons() {
  const priorityButtons = document.querySelectorAll(".priority button");
  priorityButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
          event.preventDefault();
          handlePriorityClick(button);
      });
  });

  // Medium-Priorität standardmäßig auswählen
  const defaultMediumButton = document.querySelector(".priority .medium");
  if (defaultMediumButton) {
      handlePriorityClick(defaultMediumButton);
  }
}


// **Prioritätsbutton klicken**
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
  button.style.backgroundColor = "#FFFFFF"; 
  button.style.color = "black"; 

  const priorityColors = {
      urgent: "#FF3D00",
      medium: "#FFA800",
      low: "#7AE229"
  };

  const svgPaths = button.querySelectorAll("svg path");
  svgPaths.forEach(path => {
      path.style.fill = priorityColors[button.classList[0]]; // Setzt die Originalfarbe zurück
  });
}


function highlightButton(button) {
  const priorityColors = {
      urgent: "#FF3D00",
      medium: "#FFA800",
      low: "#7AE229"
  };

  button.style.backgroundColor = priorityColors[button.classList[0]];
  button.style.color = "white";

  const svgPaths = button.querySelectorAll("svg path");
  svgPaths.forEach(path => {
      path.style.fill = "white"; // Setzt das Icon auf Weiß, wenn ausgewählt
  });
}

function init() {
  fetchContacts(); 
  initPriorityButtons(); 
}
