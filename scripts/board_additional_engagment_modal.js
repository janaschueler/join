/**
 * Retrieves a checkbox element from the DOM based on the provided contact ID.
 *
 * @constant
 * @type {HTMLElement | null}
 * @param {string} contactId - The unique identifier for the contact.
 * @returns {HTMLElement | null} The checkbox element associated with the contact ID, or null if not found.
 */
window.toggleContactSelectionEditPreselected = function (contactId, contactName, contactColor) {
  const checkbox = document.getElementById(`edit-contact-${contactId}`);
  if (!checkbox) return;
  setTimeout(() => {
    const container = checkbox.closest(".customCheckboxContainer");
    const input = document.getElementById("search-contacts-edit");
    if (!checkbox.checked) {
      handlePreselectedState(contactId, contactName, contactColor, container, input, checkbox);
    }
    updateSelectedContactsEdit();
  }, 0);
};
function handlePreselectedState(contactId, contactName, contactColor, container, input, checkbox) {
  checkbox.checked = true;
  container.classList.add("checked");
  if (!selectedContacts.some((c) => c.id === contactId)) {
    selectedContacts.push({ id: contactId, name: contactName, color: contactColor });
  }
  input.value = "";
  filterContactsEdit();
}

/**
 * The function `addTaskModal` in the JavaScript code snippet handles the addition and updating of
 * tasks by sending data to a server and redirecting to a board page upon successful save.
 * @param id - The `id` parameter in your functions represents the unique identifier of a task. It is
 * used to determine whether the task being modified is an existing task or a new task. If the `id` is
 * provided, it indicates an existing task is being edited, and if it is not provided, it
 * @param status - The `status` parameter in the `addTaskModal` and `addTaskModalNewTask` functions
 * represents the status of the task being added. It is used to determine the initial status of the
 * task, whether it's a new task or an existing task being updated. The status can be passed
 * @returns The `addTaskModal` function returns either `undefined` or nothing explicitly (implicit
 * return).
 */
async function addTaskModal(id, status) {
  const title = document.getElementById("inputField")?.value.trim();
  const dueDate = document.getElementById("due-date-edit")?.value.trim();
  if (!validateTaskFieldsAndCheck(title, dueDate)) return;

  const taskData = prepareTask(id, status);
  if (!taskData) return;

  await sendDataAndCloseModal(id, taskData);
}

/**
 * Validates the task fields and checks if the provided title and due date are valid.
 *
 * @param {string} title - The title of the task to validate.
 * @param {string} dueDate - The due date of the task in a valid date format.
 * @returns {boolean} - Returns `true` if the title, due date, and due date validity checks pass; otherwise, `false`.
 */
function validateTaskFieldsAndCheck(title, dueDate) {
  const category = document.getElementById("category")?.value;
  validateTaskFields(title, dueDate, category);
  return title && dueDate && dueDateValidity(dueDate);
}

/**
 * Prepares a task based on the provided ID and status.
 * If no ID is provided, it attempts to retrieve the category from the DOM
 * and creates a new task modal if the category exists. Otherwise, it returns null.
 * If an ID is provided, it prepares the task data using the given ID and status.
 *
 * @param {string|null} id - The ID of the task to prepare. If null, a new task modal is created.
 * @param {string} status - The status of the task to prepare or create.
 * @returns {Object|null} - Returns the prepared task data if an ID is provided,
 *                          or null if no category is found or a new task modal is created.
 */
function prepareTask(id, status) {
  if (!id) {
    const category = document.getElementById("category")?.value;
    if (!category) return null;
    addTaskModalNewTask(status);
    return null;
  }
  return prepareTaskData(id, status);
}

/**
 * Sends updated task data to the server and refreshes the board content upon success.
 *
 * @async
 * @function sendDataAndCloseModal
 * @param {string} id - The unique identifier of the task to be updated.
 * @param {Object} taskData - The updated task data to be sent to the server.
 * @throws Will log an error to the console if the request fails.
 *
 * @description
 * This function sends a PUT request to update a task on the server using the provided `id` and `taskData`.
 * If the request is successful, it closes the modal, fetches updated tasks and contacts, and reloads the board content.
 */
async function sendDataAndCloseModal(id, taskData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      closeModalAddTask();
      allTasks = await getDataTasks();
      allContacts = await getDataContacts();
      loadBoardContent();
    }
  } catch (error) {
    console.error("Error saving:", error);
  }
}

/**
 * Prepares task data for submission or processing by gathering input values and formatting them into an object.
 *
 * @param {string} id - The identifier for the task, used to determine category and priority.
 * @param {string} status - The current status of the task (e.g., "open", "in-progress", "completed").
 * @returns {Object|null} An object containing the task data if all required fields are provided, or `null` if any required field is missing.
 *
 * @property {string} title - The title of the task, retrieved from the input field.
 * @property {string} description - The description of the task, retrieved from the description input field.
 * @property {Array} assignedContacts - The list of contacts assigned to the task.
 * @property {string} dueDate - The due date of the task, retrieved from the due date input field.
 * @property {string} category - The category of the task, determined by the `determineCategory` function.
 * @property {string} priority - The priority of the task, determined by the `determinePriority` function.
 * @property {Array<string>} subtasks - An array of subtasks, retrieved from elements with the class `.subtask-text`.
 * @property {string} createdAt - The ISO string representation of the task's creation date and time.
 * @property {string} status - The current status of the task.
 */
function prepareTaskData(id, status) {
  const title = document.getElementById("inputField").value.trim();
  const dueDate = document.getElementById("due-date-edit").value.trim();
  const category = determineCategory(id);
  const selectedPriority = determinePriority(id);
  if (!title || !dueDate || !category) return null;
  return {
    title,
    description: document.getElementById("description").value.trim(),
    assignedContacts: selectedContacts,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks: Array.from(document.querySelectorAll(".subtask-text")).map((item) => item.textContent.trim()),
    createdAt: new Date().toISOString(),
    status,
  };
}

/**
 * Determines the category of a task based on the provided ID or the value from a form input.
 *
 * @param {number|string} id - The unique identifier of the task.
 * @returns {string} The category of the task. If a category is selected in the form input with ID "category",
 *                   it returns that value. Otherwise, it retrieves the category of the task with the matching ID
 *                   from the `allTasks` array.
 */
function determineCategory(id) {
  let formCategory = document.getElementById("category").value;
  if (formCategory) {
    return formCategory;
  } else {
    let task = allTasks.filter((t) => t["id"] === id);
    let category = task[0].category;
    return category;
  }
}

/**
 * Determines the priority based on the background color of buttons within the ".priority" container.
 *
 * This function iterates through all buttons inside elements with the class "priority". It checks
 * the computed background color of each button. If a button's background color is not white
 * (rgb(255, 255, 255)), it extracts the button's class list, converts it to a lowercase string,
 * trims any extra whitespace, and returns it as the priority. If no button has a non-white
 * background color, the function defaults to returning "medium".
 *
 * @returns {string} The determined priority as a lowercase string, or "medium" if no priority is set.
 */
function determinePriority() {
  const priorityButtons = document.querySelectorAll(".priority button");
  for (let button of priorityButtons) {
    const backgroundColor = window.getComputedStyle(button).backgroundColor;
    if (backgroundColor !== "rgb(255, 255, 255)") {
      priority = String(button.classList).toLowerCase().trim();
      return priority;
    }
  }
  return "medium";
}

/**
 * Handles the creation of a new task through the modal interface.
 * Prepares the task data based on the provided status, saves the new task,
 * reloads the board content, and closes the modal.
 *
 * @async
 * @function
 * @param {string} status - The status to assign to the new task (e.g., "To Do", "In Progress", "Done").
 * @returns {Promise<void>} Resolves when the task is successfully saved and the UI is updated.
 */
async function addTaskModalNewTask(status) {
  const taskData = prepareNewTaskData(status);
  if (!taskData) {
    return;
  }
  await saveNewTask(taskData);
  reloadBoardContent();
  closeModalAddTask();
}

/**
 * Prepares a new task data object based on user input and the provided status.
 *
 * @param {string} status - The status of the task (e.g., "todo", "in-progress", "done").
 * @returns {Object|null} Returns a task object containing the task details if all required fields are valid; otherwise, returns null.
 *
 * @property {string} title - The title of the task, retrieved from the input field.
 * @property {string} description - The description of the task, retrieved from the description input field.
 * @property {Array} assignedContacts - The list of contacts assigned to the task, retrieved from the `selectedContacts` variable.
 * @property {string} dueDate - The due date of the task, retrieved from the due date input field.
 * @property {string} category - The category of the task, retrieved from the category input field.
 * @property {string} priority - The priority of the task, retrieved from the `selectedPriority` variable.
 * @property {Array<string>} subtasks - An array of subtasks, retrieved from elements with the class `.subtask-text`.
 * @property {string} createdAt - The ISO string representing the creation date and time of the task.
 * @property {string} status - The status of the task, passed as a parameter.
 *
 * @throws {Error} Throws an error if any of the required fields (title, dueDate, category) are invalid.
 */
function prepareNewTaskData(status) {
  const title = document.getElementById("inputField").value.trim();
  const dueDate = document.getElementById("due-date-edit").value.trim();
  const category = document.querySelector("#category-input span").textContent.trim();
  validateTaskFields(title, dueDate, category);
  if (!title || !dueDate || !category) return null;
  return {
    title,
    description: document.getElementById("description").value.trim(),
    assignedContacts: selectedContacts,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks: Array.from(document.querySelectorAll(".subtask-text")).map((item) => item.textContent.trim()),
    createdAt: new Date().toISOString(),
    status,
  };
}

/**
 * Saves a new task to the server by sending a POST request with the task data.
 *
 * @async
 * @function saveNewTask
 * @param {Object} taskData - The data of the task to be saved.
 * @param {string} taskData.title - The title of the task.
 * @param {string} taskData.description - The description of the task.
 * @param {string} taskData.dueDate - The due date of the task in ISO format.
 * @param {string} taskData.priority - The priority level of the task (e.g., "low", "medium", "high").
 * @param {string} taskData.assignee - The name or ID of the person assigned to the task.
 * @throws {Error} Logs an error to the console if the request fails.
 * @returns {Promise<void>} Redirects to "board.html" if the task is saved successfully.
 */
async function saveNewTask(taskData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) window.location.href = "board.html";
  } catch (error) {
    console.error("Error saving task:", error);
  }
}

/**
 * Validates the selected category in a modal when the input loses focus.
 * If the selected category is the default placeholder ("Select task category"),
 * it adds a red border to the input element to indicate an error.
 * Otherwise, it removes the red border.
 *
 * @function
 * @returns {void}
 */
function validateCategoryOnBlurModal() {
  let categoryInput = document.getElementById("category-input");
  let categorySpan = categoryInput.querySelector("span");
  let category = categorySpan.textContent.trim();
  if (category === "Select task category") {
    categoryInput.classList.add("red-border");
  } else {
    categoryInput.classList.remove("red-border");
  }
}

/**
 * Validates the category input field when it loses focus (on blur event).
 * If the category input field contains the default text "Select task category",
 * it adds a red border to indicate an invalid selection. Otherwise, it removes
 * the red border if it was previously added.
 *
 * @function validateCategoryOnBlurModal
 */
function validateCategoryOnBlurModal() {
  let category = document.getElementById("category-input").textContent.trim();
  if (category) {
    if (category == "Select task category") {
      document.getElementById("category-input").classList.add("red-border");
    } else {
      document.getElementById("category-input").classList.remove("red-border");
    }
  }
}

/**
 * The function `openDatePickerModal` opens a date picker modal for the element with the ID
 * "due-date-edit".
 */
function openDatePickerModal() {
  setMinDate();
  let dateInput = document.getElementById("due-date-edit");
  dateInput.showPicker();
}

/**
 * Closes the task summary modal by hiding it and its backdrop.
 *
 * This function adds a "hide" class to both the modal and its backdrop,
 * and after a delay of 500ms, it sets their visibility to "hidden" and
 * removes the "show" class. This ensures a smooth transition effect.
 *
 * Prerequisites:
 * - The modal element must have the ID "modalTaskSummary".
 * - The backdrop element must have the ID "taskSummaryModal".
 * - CSS classes "hide" and "show" must be defined to handle visibility and transitions.
 *
 * Note:
 * - If either the modal or the backdrop element is not found, the function does nothing.
 */
function closeSummaryModal() {
  var modal = document.getElementById("modalTaskSummary");
  var backdrop = document.getElementById("taskSummaryModal");
  if (modal && backdrop) {
    modal.classList.add("hide");
    backdrop.classList.add("hide");
    setTimeout(function () {
      modal.style.visibility = "hidden";
      backdrop.style.visibility = "hidden";
      modal.classList.remove("show");
      backdrop.classList.remove("show");
    }, 500);
  }
}

/**
 * Handles the button click event based on the current screen width.
 * If the screen width is less than or equal to 768 pixels, the user is redirected to the "add_task.html" page.
 * Otherwise, it opens the edit modal with the provided status and empty parameters for other fields.
 *
 * @param {string} status - The status to be passed to the `openEditModal` function when the screen width is greater than 768 pixels.
 */
function handleButtonClickStatus(status) {
  if (window.innerWidth <= 768) {
    window.location.href = "/add_task.html";
  } else {
    openEditModal("", "", "", "", "", "", status);
  }
}

/**
 * The function closeModalAddTask closes a modal for adding a task when triggered by a specific event.
 * @param event - The `event` parameter in the `closeModalAddTask` function is an event object that
 * represents the event that triggered the function. It is typically passed as an argument when the
 * function is called in response to an event, such as a click or keypress event. The function uses the
 * event object
 * @returns The function `closeModalAddTask` returns nothing (`undefined`) if the `event` parameter is
 * falsy (null, undefined, false, 0, NaN, or an empty string).
 */
function closeModalAddTask() {
  var modal = document.getElementById("modalEditTask");
  var backdrop = document.getElementById("editTaskSectionModal");
  if (!event || event.target === backdrop || event.target.classList.contains("secondaryButton-clear") || event.target.classList.contains("modalCloseButtonAddTask")) {
    modal.classList.add("hide");
    backdrop.classList.add("hide");
    setTimeout(function () {
      modal.style.visibility = "hidden";
      backdrop.style.visibility = "hidden";
      modal.classList.remove("show");
    }, 500);
  }
}