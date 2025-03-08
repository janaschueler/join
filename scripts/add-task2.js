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
  resetButtonAddTask();
}

function clearForm() {
  document.getElementById("new-subtask-input").value = "";
  resetButtonAddTask();
}

function transformButtonAddTask() {
  const buttonContainer = document.getElementById("iconAddButton");
  if (!buttonContainer) {
    return;
  }
  buttonContainer.outerHTML = `
        <button id="clearInput" onclick="esetButtonAddTask()" class="resetSubtaskInput"></button>
        <span class="clearSubtask"></span>
        <span class="lineSubtaskAddnewSubtask"></span>
        <button id="editBtnModal" onclick="addSubtask()" class="acceptBtnSubtask"></button>
    `;
}

function resetButtonAddTask() {
  const inputWrapper = document.getElementById("inputWrapper");

  inputWrapper.innerHTML = `
        <input 
            type="text" 
            id="new-subtask-input" 
            placeholder="add new sub task" 
            onfocus="transformButtonAddTask()" 
            onblur="resetButtonAddTask()"/>
           <button id="iconAddButton" class="iconAdd" type="button" onclick="addSubtask()"></button>
    `;
}

function handleButtonClickAddTask() {
  if (["mouse", "touch", "pen"].includes(event.pointerType)) {
    resetButtonAddTask();
  } else {
    addSubtask();
  }
}
