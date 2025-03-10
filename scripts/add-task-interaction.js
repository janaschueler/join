/**
 * Initialisiert die Prioritätsbuttons und setzt die Standardpriorität.
 *
 * @param {string} [priority] - Die Priorität, die gesetzt werden soll (optional). 
 *                              Mögliche Werte sind "low", "medium", "high".
 *
 * Diese Funktion fügt allen Prioritätsbuttons einen Klick-Event-Listener hinzu.
 * Wenn keine Priorität angegeben ist, wird die Standardpriorität "medium" gesetzt.
 * Wenn eine ungültige Priorität angegeben wird, wird ebenfalls die Standardpriorität "medium" gesetzt.
 */
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

/**
 * Behandelt das Klicken auf eine Prioritätsschaltfläche.
 * 
 * Diese Funktion wird aufgerufen, wenn eine Prioritätsschaltfläche angeklickt wird.
 * Sie aktualisiert den Zustand der Schaltflächen und hebt die ausgewählte Priorität hervor.
 * 
 * @param {HTMLElement} clickedButton - Die angeklickte Prioritätsschaltfläche.
 */
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

/**
 * Setzt den Zustand eines Buttons zurück, indem die Hintergrundfarbe und die Textfarbe auf die Standardwerte gesetzt werden.
 * Zusätzlich werden die Farben der SVG-Pfade basierend auf der Priorität des Buttons aktualisiert.
 *
 * @param {HTMLElement} button - Der Button, dessen Zustand zurückgesetzt werden soll.
 */
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

// Sorgt für die Farben, wenn die Prioritöt ausgewählt wird
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

// öffnet Kalaender
function openDatePicker() {
  let dateInput = document.getElementById("due-date");
  dateInput.showPicker();
}

/**
 * Öffnet das Bearbeitungsfenster für eine Aufgabe und füllt es mit den gegebenen Informationen.
 *
 * category - Die Kategorie der Aufgabe.
 *  title - Der Titel der Aufgabe.
 *  description - Die Beschreibung der Aufgabe.
 *  DueDate - Das Fälligkeitsdatum der Aufgabe.
 *  priority - Die Priorität der Aufgabe.
 *  id - Die eindeutige ID der Aufgabe.
 */
function openEditTask(category, title, description, DueDate, priority, id) {
  const editTaskContainer = document.getElementById("modalAddTask");
  editTaskContainer.innerHTML = "";
  editTaskContainer.innerHTML = addEditTask(category, title, description, DueDate, priority, id);
}

/**
 * Fügt eine neue Unteraufgabe zur Liste der Unteraufgaben hinzu.
 * 
 * Diese Funktion liest den Wert des Eingabefelds für neue Unteraufgaben aus,
 * erstellt eine neue Unteraufgabe und fügt sie dem Container für Unteraufgaben hinzu.
 * Wenn das Eingabefeld leer ist, wird die Funktion beendet.
 * 
 * @function
 * @name addSubtask
 */
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
  resetButtonAddTask();
}


function clearForm() {
  document.getElementById("new-subtask-input").value = "";
  resetButtonAddTask();
}

/**
 * Transformiert den "Add Task"-Button.
 *
 * Diese Funktion sucht nach einem Element mit der ID "iconAddButton".
 * Wenn das Element gefunden wird, wird es durch ein transformiertes
 * Button-Element ersetzt, das von der Funktion `getTransformedButton` 
 * zurückgegeben wird.
 *
 * @returns {void} Gibt nichts zurück.
 */
function transformButtonAddTask() {
  const buttonContainer = document.getElementById("iconAddButton");
  if (!buttonContainer) {
    return;
  }
  buttonContainer.outerHTML = getTransformedButton();
}

function resetButtonAddTask() {
  const inputWrapper = document.getElementById("inputWrapper");
  inputWrapper.innerHTML = transformedResetButton();
}

function handleButtonClickAddTask() {
  if (["mouse", "touch", "pen"].includes(event.pointerType)) {
    resetButtonAddTask();
  } else {
    addSubtask();
  }
}
