/**
 * The function `addSubtaskinEditModal` retrieves subtasks for a specific task and adds them to the
 * edit modal container.
 * @param id - The `id` parameter in the `addSubtaskinEditModal` function is used to identify the task
 * for which subtasks need to be added in the edit modal.
 * @returns If the `tasks` array is empty or if the `subTaskInput` is falsy, the function will return
 * early and not execute the rest of the code.
 */

function addSubtaskinEditModal(id) {
  let subTaskContainer = document.getElementById("editSubtasks-container");
  let tasks = allTasks.filter((t) => t["id"] === id);
  if (tasks.length === 0) {
    return;
  }
  let subTaskInput = tasks[0].subtasks;
  if (!subTaskInput) {
    return;
  }
  subTaskInput.forEach((subTask, index) => {
    subTaskCount = index + 1;
    subTaskContainer.innerHTML += addSubtaskTemplateinModal(subTask, subTaskCount);
  });
}

/**
 * The function `handleButtonClick` determines whether to reset a button or add an additional subtask
 * in an edit modal based on the type of pointer event.
 * @param event - The `event` parameter in the `handleButtonClick` and
 * `addAdditionalSubtaskinEditModal` functions represents the event that occurred, such as a mouse
 * click or touch event. It contains information about the event, like the type of pointer used (mouse,
 * touch, pen) and allows you
 * @param id - The `id` parameter in the functions `handleButtonClick`,
 * `addAdditionalSubtaskinEditModal`, and `deleteSubtaskModal` is used to identify the specific task that the function is operating on. It helps in targeting and manipulating the correct
 * elements or data related to that particular
 */
function handleButtonClick(event, id) {
  if (["mouse", "touch", "pen"].includes(event.pointerType)) {
    resetButtonEdit(id);
  } else {
    addAdditionalSubtaskinEditModal(event, id);
  }
}

/**
 * Adds a new subtask to the edit modal for a specific task.
 * 
 * This function handles the addition of a new subtask in the edit modal by 
 * appending the subtask to the subtask container and updating the task's 
 * subtask list. It also resets the input field and updates the edit modal buttons.
 * 
 * @param {Event} event - The event object triggered by the form submission or button click.
 * @param {number} id - The unique identifier of the task to which the subtask belongs.
 * 
 * @returns {void} This function does not return a value.
 */
function addAdditionalSubtaskinEditModal(event, id) {
  event.preventDefault();
  event.stopPropagation();
  let subTaskInputRef = document.getElementById("new-subtask-input-Edit");
  let subTaskInput = subTaskInputRef.value.trim();
  let subTaskContainer = document.getElementById("editSubtasks-container");
  if (!subTaskInput) {
    return;
  }
  let tasks = allTasks.filter((t) => t["id"] === id);
  let numberOfSubTaskInput = tasks[0]?.subtasks?.length || 0;
  let subTaskCount = numberOfSubTaskInput + 1;
  subTaskContainer.innerHTML += addSubtaskTemplateinModal(subTaskInput, subTaskCount);
  subTaskInputRef.value = "";
  resetButtonEdit(id);
}

/**
 * Deletes a subtask element from the DOM based on its unique identifier.
 *
 * @param {number|string} id - The unique identifier of the subtask to be removed.
 *                             This ID is used to locate the subtask element in the DOM.
 *
 * @example
 * // Assuming there is an element with the ID "editSubTaskUnit1" in the DOM:
 * deleteSubtaskModal(1);
 * // The element with ID "editSubTaskUnit1" will be removed from the DOM.
 */
function deleteSubtaskModal(id) {
  const removeSubtask = document.getElementById(`editSubTaskUnit${id}`);
  removeSubtask.remove();
}

/**
 * The functions `transformButtonEdit` and `resetButtonEdit` manipulate the DOM to transform and reset
 * a button element respectively.
 * @param id - The `id` parameter in the `transformButtonEdit` and `resetButtonEdit` functions is used
 * to identify the specific element that needs to be transformed or reset. It is a unique identifier
 * that helps target the correct element in the DOM for manipulation.
 * @returns In the `transformButtonEdit` function, the `addtransformedButton` function is being called
 * and its return value is being used to replace the `outerHTML` of the `buttonContainer`.
 */
function transformButtonEdit(id) {
  const buttonContainer = document.querySelector("#iconAddButtonEdit");
  if (!buttonContainer) return;
  buttonContainer.outerHTML = addtransformedButton(id);
}

/**
 * Resets the content of the button edit wrapper by replacing its inner HTML
 * with the transformed button HTML for the specified ID.
 *
 * @param {string} id - The unique identifier used to generate the transformed button HTML.
 */
function resetButtonEdit(id) {
  const inputWrapper = document.getElementById("inputWrapperEdit");
  inputWrapper.innerHTML = returnTransformedButton(id);
}

/**
 * The functions `editSubtaskinModal` and `acceptEdit` are used to edit and accept changes to a subtask
 * in a modal window.
 * @param id - The `id` parameter in the `editSubtaskinModal` function and the `acceptEdit` function
 * refers to the unique identifier of the subtask that is being edited or accepted. This identifier is
 * used to target specific elements in the HTML document related to that particular subtask.
 * @param subTaskInput - Subtask input is the content of the subtask that needs to be edited or
 * updated.
 */
function editSubtaskinModal(id, subTaskInput) {
  let editSubtask = document.getElementById(`editSubTaskUnit${id}`);
  editSubtask.innerHTML = "";
  editSubtask.classList.add("editing");
  editSubtask.innerHTML = addInputFieldinModal(id, subTaskInput);
}

/**
 * Handles the acceptance of an edited subtask in a modal.
 * 
 * This function retrieves the value of an edited subtask input field by its ID.
 * If the input value is empty, it deletes the subtask from the modal. Otherwise,
 * it removes the existing subtask element from the DOM and appends a new subtask
 * element with the updated value to the container.
 * 
 * @param {number|string} id - The unique identifier of the subtask being edited.
 */
function acceptEdit(id) {
  let subTaskContainer = document.getElementById("editSubtasks-container");
  let newSubTask = document.getElementById(`inputSubtask${id}`).value;
  if (!newSubTask) {
    deleteSubtaskModal(`${id}`);
    return;
  }
  const removeSubtask = document.getElementById(`editSubTaskUnit${id}`);
  removeSubtask.remove();
  subTaskContainer.innerHTML += addSubtaskTemplateinModal(newSubTask, id);
}

/**
 * The `saveEditTask` function in JavaScript gathers task data, validates it, saves it to a server, and
 * handles any errors that may occur during the process.
 * @param id - The `id` parameter in the `saveEditTask` function represents the unique identifier of
 * the task that is being edited or updated. This identifier is used to specify which task should be
 * updated in the database.
 * @returns The `saveEditTask` function is an async function that saves edited task data. It gathers
 * task data using the `gatherTaskData` function, validates the data using the `validateTaskData`
 * function, and then saves the data using the `saveTaskData` function. If the data is successfully
 * saved, an alert message is shown, and the form is cleared. If there is an error
 */
async function saveEditTask(id) {
  const taskData = gatherTaskData();
  if (!validateTaskData(taskData)) return;
  try {
    await saveTaskData(id, taskData);
    alert("Task successfully created!");
    clearForm();
  } catch (error) {
    console.error("Error saving the task:", error);
  }
}

/**
 * Gathers task data from the input fields in the DOM and returns it as an object.
 * 
 * @returns {Object} An object containing the task data.
 * @property {string} title - The title of the task, trimmed of whitespace.
 * @property {string} description - The description of the task, trimmed of whitespace.
 * @property {string} dueDate - The due date of the task in ISO format.
 * @property {string} category - The category of the task.
 * @property {Array} assignedContacts - An array of selected contacts assigned to the task.
 * @property {string} priority - The selected priority level of the task.
 * @property {string} status - The status of the task, determined by the `determineStatusAddTask` function.
 * @property {string} createdAt - The ISO timestamp of when the task was created.
 */
function gatherTaskData() {
  return {
    title: document.getElementById("inputField").value.trim(),
    description: document.getElementById("description").value.trim(),
    dueDate: document.getElementById("due-date").value,
    category: document.getElementById("category").value,
    assignedContacts: selectedContacts,
    priority: selectedPriority,
    status: determineStatusAddTask(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Validates the task data to ensure all required fields are present.
 *
 * @param {Object} taskData - The task data to validate.
 * @param {string} taskData.title - The title of the task.
 * @param {string} taskData.description - The description of the task.
 * @param {string} taskData.dueDate - The due date of the task in a valid date format.
 * @param {string} taskData.category - The category of the task.
 * @param {string} taskData.priority - The priority level of the task.
 * @returns {boolean} Returns `true` if all fields are present and valid, otherwise `false`.
 */
function validateTaskData({ title, description, dueDate, category, priority }) {
  if (!title || !description || !dueDate || !category || !priority) {
    return false;
  }
  return true;
}

/**
 * Saves task data to the server by sending a PUT request to the specified endpoint.
 *
 * @async
 * @function saveTaskData
 * @param {string} id - The unique identifier of the task to be updated.
 * @param {Object} taskData - The data object containing the updated task details.
 * @throws {Error} Throws an error if the server response is not OK (status not in the range 200-299).
 * @returns {Promise<void>} A promise that resolves when the task data is successfully saved.
 */
async function saveTaskData(id, taskData) {
  const response = await fetch(`${BASE_URL}/tasks/${id}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error(`Error while saving the task: ${response.status}`);
  }
}

/**
 * The functions above in the JavaScript code handle all aspects of the content selection process. Toggling contact selection, updating selected
 * contacts, filtering contacts, toggling dropdown visibility, and determining assigned contacts in an
 * edit modal.
 */

window.toggleContactSelectionEdit = function (contactId, contactName, contactColor) {
  const checkbox = document.getElementById(`edit-contact-${contactId}`);
  const container = checkbox.closest(".customCheckboxContainer");
  const input = document.getElementById("search-contacts-edit");
  if (!checkbox) return;
  if (checkbox.checked) {
    if (!selectedContacts.some((c) => c.id === contactId)) {
      container.classList.add("checked");
      selectedContacts.push({ id: contactId, name: contactName, color: contactColor });
      input.value = "";
      filterContactsEdit();
    }
  } else {
    container.classList.remove("checked");
    selectedContacts = selectedContacts.filter((c) => c.id !== contactId);
  }
  updateSelectedContactsEdit();
};

// function handleCheckedState(contactId, contactName, contactColor, container, input) {
//   if (!selectedContacts.some((c) => c.id === contactId)) {
//     container.classList.add("checked");
//     selectedContacts.push({ id: contactId, name: contactName, color: contactColor });
//     input.value = "";
//     filterContactsEdit();
//   }
// }

function handleUncheckedState(contactId, container) {
  container.classList.remove("checked");
  selectedContacts = selectedContacts.filter((c) => c.id !== contactId);
}

/**
 * Updates the "selected-contacts-Edit" container with the currently selected contacts.
 * Clears the container and dynamically creates and appends a visual representation
 * of each selected contact, including their initials and background color.
 *
 * @function
 * @returns {void}
 */
function updateSelectedContactsEdit() {
  const selectedContactsContainer = document.getElementById("selected-contacts-Edit");
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

/**
 * Filters the list of contacts in the edit modal based on the search input.
 * 
 * This function retrieves the search term entered by the user in the input field
 * with the ID "search-contacts-edit", converts it to lowercase, and compares it
 * against the text content of elements with the class "subtasksUnit" inside
 * elements with the class "customCheckboxContainer". If the text content matches
 * the search term, the corresponding container is displayed; otherwise, it is hidden.
 * 
 * @function
 * @returns {void}
 */
function filterContactsEdit() {
  const searchTerm = document.getElementById("search-contacts-edit").value.toLowerCase();
  document.querySelectorAll(".customCheckboxContainer").forEach((label) => {
    const name = label.querySelector(".subtasksUnit").textContent.toLowerCase();
    label.style.display = name.includes(searchTerm) ? "flex" : "none";
  });
}

/**
 * Toggles the visibility of the dropdown menu for editing assignments and updates the display of the dropdown icons.
 * 
 * @param {Event} event - The event object triggered by the user interaction.
 * @returns {void}
 * 
 * @description
 * This function prevents the event from propagating further, then toggles the visibility of the dropdown menu
 * with the ID "assigned-dropdown-Edit". It also switches the display of the dropdown icons between a "down" icon
 * and an "up" icon based on the visibility state of the dropdown menu.
 * 
 * - When the dropdown becomes visible:
 *   - The "down" icon is hidden.
 *   - The "up" icon is displayed.
 * - When the dropdown is hidden:
 *   - The "down" icon is displayed.
 *   - The "up" icon is hidden.
 */
function toggleDropdownEdit(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("assigned-dropdown-Edit");
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


/**
 * Closes a dropdown menu when a click is detected outside of the dropdown or its toggle button.
 *
 * @param {Event} event - The click event triggered by the user.
 * @param {string} dropdownId - The ID of the dropdown element to be closed.
 * @param {string} toggleId - The ID of the toggle button associated with the dropdown.
 * @param {string} [iconId] - The optional ID of an icon element to reset its rotation.
 *
 * @description
 * This function checks if the click event occurred outside the specified dropdown and its toggle button.
 * If so, it hides the dropdown, resets the rotation of the icon (if provided), and adjusts the display
 * of specific dropdown-related elements when the dropdown ID matches "assigned-dropdown-Edit".
 */
document.addEventListener("click", function (event) {
  closeDropdownOnOutsideClickEdit(event, "assigned-dropdown-Edit", "assigned-input-Edit", null);
});

function closeDropdownOnOutsideClickEdit(event, dropdownId, toggleId, iconId) {
  const dropdown = document.getElementById(dropdownId);
  const toggleButton = document.getElementById("assigned-input-Edit");

  if (!dropdown || !toggleButton) return;

  if (!toggleButton.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("visible");
    if (iconId) {
      document.getElementById(iconId).style.transform = "rotate(0deg)";
    }
    if (dropdownId === "assigned-dropdown-Edit") {
      document.querySelector(".dropDown").style.display = "block";
      document.querySelector(".dropDown-up").style.display = "none";
    }
  }
}
