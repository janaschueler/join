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

/**
 * Schaltet das Kategorie-Dropdown-Menü um.
 * 
 * Diese Funktion stoppt die Ereignisweiterleitung, schließt alle Dropdown-Menüs
 * und schaltet das Sichtbarkeitsstatus des Kategorie-Dropdown-Menüs um. Wenn das
 * Dropdown-Menü geschlossen ist, wird es geöffnet und das Symbol wird gedreht.
 * 
 * @param {Event} event - Das Ereignis, das durch das Klicken auf das Dropdown-Menü ausgelöst wird.
 */
function toggleCategoryDropdown(event) {
  event.stopPropagation();
  let dropdown = document.getElementById("category-dropdown");
  let icon = document.getElementById("category-dropdown-icon");
  let isOpen = dropdown.classList.contains("visible");
  closeAllDropdowns();
  if (!isOpen) {
    dropdown.classList.add("visible");
    icon.style.transform = "rotate(180deg)";
  }
}

/**
 */
/**
 * Schaltet das Zuweisungs-Dropdown um.
 * 
 * Diese Funktion wird durch ein Ereignis ausgelöst und stoppt die Ereignisweitergabe.
 * Sie schließt alle anderen Dropdowns und schaltet die Sichtbarkeit des Zuweisungs-Dropdowns um.
 * Zusätzlich wird die Anzeige der Dropdown-Pfeile entsprechend angepasst.
 * 
 * @param {Event} event - Das auslösende Ereignis.
 */

function toggleAssignedDropdown(event) {
  event.stopPropagation();
  let dropdown = document.getElementById("assigned-dropdown");
  let isOpen = dropdown.classList.contains("visible");
  closeAllDropdowns();
  dropdown.classList.toggle("visible", !isOpen);
  document.querySelector(".dropDown").style.display = isOpen ? "block" : "none";
  document.querySelector(".dropDown-up").style.display = isOpen ? "none" : "block";
}

document.addEventListener("click", (event) => {
  closeDropdownOnOutsideClick(event, "category-dropdown", "custom-category", "category-dropdown-icon");
  closeDropdownOnOutsideClick(event, "assigned-dropdown", "assigned-input");
});



/**
 * Schließt das Dropdown-Menü, wenn außerhalb des Dropdowns geklickt wird.
 *
 * @param {Event} event - Das Klick-Ereignis.
 * @param {string} dropdownId - Die ID des Dropdown-Elements.
 * @param {string} toggleId - Die ID des Umschalt-Buttons.
 * @param {string} [iconId] - Optional, die ID des Icons, das gedreht werden soll.
 */
function closeDropdownOnOutsideClick(event, dropdownId, toggleId, iconId) {
  const dropdown = document.getElementById(dropdownId);
  const toggleButton = document.getElementById(toggleId);
  if (!dropdown || !toggleButton) return;
  if (
    !toggleButton.contains(event.target) &&
    !dropdown.contains(event.target)
  ) {
    dropdown.classList.remove("visible");
    if (iconId) {
      document.getElementById(iconId).style.transform = "rotate(0deg)";
    }
    if (dropdownId === "assigned-dropdown") {
      document.querySelector(".dropDown").style.display = "block";
      document.querySelector(".dropDown-up").style.display = "none";
    }
  }
}


/**
 * Schließt alle Dropdown-Menüs auf der Seite.
 * 
 * Diese Funktion entfernt die "visible"-Klasse vom Kategorie-Dropdown
 * und allen zugewiesenen Dropdowns. Zusätzlich wird das Symbol des
 * Kategorie-Dropdowns zurückgesetzt und die Anzeige der Dropdown-Elemente
 * entsprechend angepasst.
 */
function closeAllDropdowns() {
  document.getElementById("category-dropdown").classList.remove("visible");
  const assignedDropdowns = document.querySelectorAll(
    '[id*="assigned-dropdown"]'
  );
  assignedDropdowns.forEach((dropdown) => {
    dropdown.classList.remove("visible");
  });

  document.getElementById("category-dropdown-icon").style.transform =
    "rotate(0deg)";
  document.querySelector(".dropDown").style.display = "block";
  document.querySelector(".dropDown-up").style.display = "none";
}


/**
 * Wählt eine Kategorie aus und aktualisiert die Anzeige und den Wert des Kategorie-Eingabefelds.
 *
 * @param {string} label - Der Name der auszuwählenden Kategorie.
 */
function selectCategory(label) {
  document.querySelector("#category-input span").textContent = label;
  document.getElementById("category").value = label;
  document.getElementById("category-dropdown").classList.remove("visible");
  document
    .querySelectorAll("#category-dropdown .dropdown-option")
    .forEach((option) => {
      option.classList.remove("selected");
    });
}

/**
 * Ruft die Kontaktliste vom Server ab und verarbeitet die Daten.
 * 
 * Diese Funktion sendet eine HTTP-Anfrage an den Server, um die Kontaktliste im JSON-Format abzurufen.
 * Die abgerufenen Daten werden in ein Array von Kontaktobjekten umgewandelt und in der globalen Variable `contacts` gespeichert.
 * Jedes Kontaktobjekt enthält die Felder `id`, `name`, `email` und `color`.
 * Falls ein Feld in den abgerufenen Daten fehlt, werden Standardwerte verwendet.
 * Nach dem Abrufen und Verarbeiten der Daten wird die Funktion `populateAssignedToSelect` aufgerufen, um die Auswahloptionen zu aktualisieren.
 * 
 * @async
 * @function fetchContacts
 * @throws {Error} Wenn ein HTTP-Fehler auftritt.
 */
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
  } catch (error) {}
}

/**
 * Fügt eine neue Aufgabe hinzu.
 *
 * @param {string} statusTask - Der Status der Aufgabe, die hinzugefügt wird.
 * @returns {void}
 * @throws {Error} Wenn das Speichern der Aufgabe fehlschlägt.
 *
 * @description
 * Diese Funktion sammelt die Eingabedaten aus verschiedenen Feldern, erstellt ein Aufgabenobjekt und sendet es an den Server.
 * Wenn die Eingabefelder für Titel, Fälligkeitsdatum, Kategorie oder Priorität leer sind, wird eine Warnung angezeigt.
 * Nach erfolgreichem Speichern der Aufgabe wird der Benutzer zur "board.html" Seite weitergeleitet.
 */
async function addTask(statusTask) {
  const title = inputField.value.trim(),
    description = description.value.trim(),
    dueDate = dueDate.value.trim(),
    category = category.value,
    subtasks = [...document.querySelectorAll(".subtask-text")].map((el) => el.textContent.trim());
  if (!title || !dueDate || !category || !selectedPriority) return alert("Please fill in all required fields.");
  const taskData = { title, description, dueDate, category, priority: selectedPriority, subtasks, assignedContacts: selectedContacts, status: determineStatusAddTask(statusTask), createdAt: new Date().toISOString() };
  try {
    const response = await fetch(`${BASE_URL}/tasks.json`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(taskData) });
    if (!response.ok) throw new Error(`Error saving task: ${response.status}`);
    location.href = "board.html";
  } catch (err) {}
}

/**
 * Bestimmt den Status einer Aufgabe.
 *
 * @param {number} [statusTask] - Der aktuelle Status der Aufgabe. Wenn kein Status angegeben wird, wird der Standardwert 1 verwendet.
 * @returns {number} Der bestimmte Status der Aufgabe.
 */
function determineStatusAddTask(statusTask) {
  let status;
  if (!statusTask) {
    status = 1;
  } else {
    status = statusTask;
  }
  return status;
}

/**
 * Speichert eine Unteraufgabe auf dem Server.
 *
 * Diese Funktion sendet eine POST-Anfrage an den Server, um eine neue Unteraufgabe zu speichern.
 *
 * @param {string} subtaskText - Der Text der Unteraufgabe, die gespeichert werden soll.
 * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn die Anfrage abgeschlossen ist.
 * @throws {Error} - Wirft einen Fehler, wenn die Anfrage fehlschlägt.
 */
async function saveSubtask(subtaskText) {
  try {
    const response = await fetch(`${BASE_URL}/subtasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: subtaskText }),
    });
  } catch (error) {}
}

/**
 * Füllt das Dropdown-Menü "assigned-dropdown" mit Kontakten und fügt Event-Listener zu den Checkboxen hinzu.
 * 
 * Diese Funktion überprüft, ob das Dropdown-Element und das Array der Kontakte vorhanden sind und ob das Array nicht leer ist.
 * Wenn diese Bedingungen erfüllt sind, wird das Dropdown-Menü mit den Kontakten gefüllt.
 * Jeder Kontakt wird mit einer Checkbox versehen, die einen Event-Listener erhält.
 * Wenn die Checkbox geändert wird, wird die Funktion `toggleContactSelection` aufgerufen, um die Auswahl des Kontakts zu aktualisieren.
 * 
 * @function
 * @name populateAssignedToSelect
 */
function populateAssignedToSelect() {
  const dropdown = document.getElementById("assigned-dropdown");
  if (!dropdown || !Array.isArray(contacts) || contacts.length === 0) return;
  dropdown.innerHTML = contacts.map(contact => addTaskTemplate(contact, selectedContacts.some(c => c.id === contact.id))).join("");
  document.querySelectorAll(".contact-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", function () {
      const label = this.closest(".customCheckboxContainer");
      if (!label) return;
      const contactRow = label.querySelector(".contact-row");
      const name = contactRow.querySelector(".subtasksUnit")?.textContent || "Unbekannt";
      const color = contactRow.querySelector(".svg-container")?.style.backgroundColor || "#000";
      toggleContactSelection(this.value, name, color);
    });
  });
}

function updateSelectedContacts() {
  const container = document.getElementById("selected-contacts");
  container.innerHTML = selectedContacts.map(contact => `<div class="selected-contact" style="background-color:${contact.color};"><span class="selected-contact-initials">${getInitials(contact.name)}</span></div>`).join("");
}


/**
 * Entfernt einen ausgewählten Kontakt aus der Liste der ausgewählten Kontakte.
 *
 * @param {number} contactId - Die ID des zu entfernenden Kontakts.
 */
function removeSelectedContact(contactId) {
  selectedContacts = selectedContacts.filter(
    (contact) => contact.id !== contactId
  );
  const checkbox = document.getElementById(`contact-${contactId}`);
  if (checkbox) {
    checkbox.checked = false;
  }
  updateSelectedContacts();
}


/**
 * Filtert die Liste der Kontakte basierend auf dem vom Benutzer eingegebenen Suchbegriff.
 * 
 * Diese Funktion ruft den Suchbegriff aus einem Eingabeelement mit der ID "search-contacts" ab,
 * konvertiert ihn in Kleinbuchstaben und iteriert dann über alle Elemente mit der Klasse "customCheckboxContainer".
 * Sie überprüft, ob der Textinhalt eines Kindelements mit der Klasse "subtasksUnit" den Suchbegriff enthält.
 * Wenn ja, wird der Anzeigestil des Elternelements auf "flex" gesetzt; andernfalls wird er auf "none" gesetzt.
 */
function filterContacts() {
  const searchTerm = document.getElementById("search-contacts").value.toLowerCase();
  document.querySelectorAll(".customCheckboxContainer").forEach((label) => {
   const name = label.querySelector(".subtasksUnit").textContent.toLowerCase();
    label.style.display = name.includes(searchTerm) ? "flex" : "none";
  });
}

/**
 * Gibt die Initialen eines Namens zurück.
 *
 * @param {string} name - Der vollständige Name, aus dem die Initialen extrahiert werden sollen.
 * @returns {string} Die Initialen des Namens in Großbuchstaben. Wenn der Name leer ist, wird "??" zurückgegeben.
 */
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


// ermöglicht das löschen der Unteraufgabe
function deleteSubtask(id) {
  const removeSubtask = document.getElementById(`subTaskUnit${id}`);
  removeSubtask.remove();
}

// erlaubt das bearbeiten der Unteraufgabe

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

// leert die Form - Es leert jede Form & auch Inputfelder
function clearForm() {
  document.getElementById("inputField").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("selected-contacts").innerHTML = "";
  selectedContacts = [];
  selectedPriority = null;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
