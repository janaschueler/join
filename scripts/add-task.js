let tasks = [];
let selectedPriority = null;
let contacts = [];
let selectedContacts = [];
let subTaskCount;
let subtaskClickCount = 0;

/**
 * Initializes the application by performing necessary setup tasks.
 * - Fetches the list of contacts required for the application.
 * - Sets up the priority buttons for task management.
 */
function init() {
  fetchContacts();
  initPriorityButtons();
}

/**
 * Toggles the visibility of the category dropdown menu and rotates the dropdown icon.
 * Prevents the click event from propagating further.
 * Closes all other dropdowns before toggling the current one.
 *
 * @param {Event} event - The click event that triggers the dropdown toggle.
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
 * Toggles the visibility of the assigned dropdown menu.
 *
 * This function stops the propagation of the event, checks the current state of the dropdown,
 * closes all other dropdowns, and then toggles the visibility of the assigned dropdown based on its current state.
 * It also adjusts the display properties of elements with the classes "dropDown" and "dropDown-up".
 *
 * @param {Event} event - The event object associated with the dropdown toggle action.
 */
function toggleAssignedDropdown(event) {
  event.stopPropagation();
  let dropdown = document.getElementById("assigned-dropdown");
  let isOpen = dropdown.classList.contains("visible");
  closeAllDropdowns();
  if (!isOpen) {
    dropdown.classList.add("visible");
    document.querySelector(".dropDown").style.display = "none";
    document.querySelector(".dropDown-up").style.display = "block";
  } else {
    document.querySelector(".dropDown").style.display = "block";
    document.querySelector(".dropDown-up").style.display = "none";
  }
}
document.addEventListener("click", function (event) {
  closeDropdownOnOutsideClick(event, "category-dropdown", "custom-category", "category-dropdown-icon");
  closeDropdownOnOutsideClick(event, "assigned-dropdown", "assigned-input", null);
});

/**
 * Closes a dropdown menu when a click is detected outside of it.
 *
 * @param {Event} event - The click event that triggers the function.
 * @param {string} dropdownId - The ID of the dropdown element to be closed.
 * @param {string} toggleId - The ID of the button that toggles the dropdown.
 * @param {string} [iconId] - The optional ID of the icon element to be rotated.
 */
function closeDropdownOnOutsideClick(event, dropdownId, toggleId, iconId) {
  const dropdown = document.getElementById(dropdownId);
  const toggleButton = document.getElementById(toggleId);
  if (!dropdown || !toggleButton) {
    return;
  }
  if (!toggleButton.contains(event.target) && !dropdown.contains(event.target)) {
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
 * Closes all dropdown menus on the page.
 *
 * This function hides the category dropdown and all assigned dropdowns by
 * removing the "visible" class from their respective elements. It also
 * resets the rotation of the category dropdown icon and toggles the
 * display properties of elements with classes "dropDown" and "dropDown-up".
 */
function closeAllDropdowns() {
  document.getElementById("category-dropdown").classList.remove("visible");
  const assignedDropdowns = document.querySelectorAll('[id*="assigned-dropdown"]');
  assignedDropdowns.forEach((dropdown) => {
    dropdown.classList.remove("visible");
  });
  document.getElementById("category-dropdown-icon").style.transform = "rotate(0deg)";
  document.querySelector(".dropDown").style.display = "block";
  document.querySelector(".dropDown-up").style.display = "none";
}

/**
 * Updates the selected category in the UI and validates the selection.
 *
 * This function updates the displayed category label, sets the hidden input value,
 * hides the category dropdown, and removes the "selected" class from all dropdown options.
 * Additionally, it triggers category validation if the corresponding validation function exists.
 *
 * @param {string} label - The label of the selected category.
 */
function selectCategory(label) {
  document.querySelector("#category-input span").textContent = label;
  document.getElementById("category").value = label;
  document.getElementById("category-dropdown").classList.remove("visible");
  document.querySelectorAll("#category-dropdown .dropdown-option").forEach((option) => {
    option.classList.remove("selected");
  });
  if (typeof validateCategoryOnBlurModal === "function") {
    validateCategoryOnBlurModal();
  } else if (typeof validateCategoryOnBlur === "function") {
    validateCategoryOnBlur();
  }
}

/**
 * Fetches contacts from the server and processes them into a usable format.
 *
 * This function makes an asynchronous request to retrieve contact data from a specified URL.
 * It then processes the data into an array of contact objects, each containing an id, name, email, and color.
 * If the contact's name or email is missing, default values are provided.
 * If the contact's color is missing, a random color is assigned.
 * Finally, it calls the `populateAssignedToSelect` function to update the UI with the fetched contacts.
 *
 * @async
 * @function fetchContacts
 * @throws {Error} Throws an error if the HTTP request fails.
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
 * Collects and validates the task data, then sends it to the server.
 * @param {string} statusTask - The status of the task to be added.
 */
async function addTask(statusTask) {
  const taskData = collectTaskData(statusTask);
  if (!taskData) return;
  try {
    await saveTaskToServer(taskData);
    setTimeout(() => { location.href = "board.html"; }, 100);
  } catch (err) {
    alert(err.message);
  }
}

/**
 * Collects task data from the DOM and validates the necessary fields.
 * @param {string} statusTask - The status of the task to be added.
 * @returns {Object|null} The task data object or null if validation fails.
 */
function collectTaskData(statusTask) {
  const title = document.getElementById("inputField")?.value.trim();
  const description = document.getElementById("description")?.value.trim();
  const dueDate = document.getElementById("due-date")?.value.trim();
  const category = document.getElementById("category")?.value;
  const dueDateCheck = dueDateValidity(dueDate);
  const subtasks = [...document.querySelectorAll(".subtask-text")].map((el) => el.textContent.trim());
  validateTaskFields(title, dueDate, category);
  if (!title || !dueDate || !category || !dueDateCheck) return null;
  return {
    title, description, dueDate, category, priority: selectedPriority,
    subtasks, assignedContacts: selectedContacts, status: determineStatusAddTask(statusTask),
    createdAt: new Date().toISOString()
  };
}

/**
 * Saves the task data to the server via a POST request.
 * 
 * @param {Object} taskData - The task data object to be saved.
 * @throws {Error} Throws an error if the task saving fails.
 */
async function saveTaskToServer(taskData) {
  const res = await fetch(`${BASE_URL}/tasks.json`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error(`Error saving task: ${res.status}`);
}


/**
 * Validates the input fields for a task creation form.
 *
 * This function checks if the task title, due date, and category fields are valid.
 * It applies or removes a red border to indicate invalid fields.
 *
 * @param {string} title - The title of the task. Must not be empty.
 * @param {string} dueDate - The due date of the task in a valid date format.
 * @param {string} category - The category of the task. Must not be empty or the default "Select task category".
 */
function validateTaskFields(title, dueDate, category) {
  toggleRedBorder("inputField", !title);
  if (category == "Select task category" || category == "") {
    toggleRedBorder("category-input", true);
  } else {
    toggleRedBorder("category-input", false);
  }
  const { dueDateElement, inputDate, today } = getDueDateValidationData(dueDate);
  if (!dueDate || inputDate < today) {
    toggleRedBorder(dueDateElement.id, true);
  } else {
    toggleRedBorder(dueDateElement.id, false);
  }
}

/**
 * Retrieves and processes the due date validation data.
 * This function selects the due date input element, creates a Date object from the provided due date,
 * and creates a Date object for today's date with the time set to midnight.
 *
 * @param {string} dueDate - The due date string to be validated, typically in 'YYYY-MM-DD' format.
 * @returns {Object} An object containing:
 *   - dueDateElement: The DOM element corresponding to the due date input field.
 *   - inputDate: The Date object representing the provided due date.
 *   - today: The Date object representing today's date, with time set to midnight.
 */
function getDueDateValidationData(dueDate) {
  const dueDateElement = document.querySelector("[id^='due-date']");
  const inputDate = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return { dueDateElement, inputDate, today };
}

/**
 * Validates the provided due date to ensure it is not empty and is not in the past.
 *
 * @param {string} dueDate - The due date to validate, typically in a string format (e.g., "YYYY-MM-DD").
 * @returns {boolean} - Returns `true` if the due date is valid (not empty and not in the past), otherwise `false`.
 */
function dueDateValidity(dueDate) {
  const { dueDateElement, inputDate, today } = getDueDateValidationData(dueDate);
  if (!dueDate || inputDate < today) {
    return false;
  }
  return true;
}

/**
 * Toggles a red border on an HTML element based on a condition.
 *
 * @param {string} elementId - The ID of the HTML element to apply the red border to.
 * @param {boolean} condition - A boolean value that determines whether to add or remove the red border.
 *                              If true, the "red-border" class is added; if false, it is removed.
 */
function toggleRedBorder(elementId, condition) {
  const element = document.getElementById(elementId);
  if (condition) {
    element.classList.add("red-border");
  } else {
    element.classList.remove("red-border");
  }
}

/**
 * Validates the selected category when the input loses focus.
 * If the selected category is the default placeholder ("Select task category"),
 * it adds a red border to the category input element to indicate an error.
 * Otherwise, it removes the red border.
 */
function validateCategoryOnBlur() {
  let category = document.getElementById("category-selection").textContent.trim();
  if (category == "Select task category") {
    document.getElementById("category-input").classList.add("red-border");
  } else {
    document.getElementById("category-input").classList.remove("red-border");
  }
}

/**
 * Validates an input field's value when it loses focus (on blur).
 * Checks if the input value is empty or represents a date earlier than today.
 * If the validation fails, it adds a "red-border" class to the input element.
 * Otherwise, it removes the "red-border" class.
 *
 * @param {HTMLInputElement} input - The input element to validate.
 */
function validateOnBlur(input) {
  const inputDate = new Date(input.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!input.value.trim() || inputDate < today) {
    input.classList.add("red-border");
  } else {
    input.classList.remove("red-border");
  }
}

/**
 * Determines the status of a task to be added.
 *
 * @param {number} statusTask - The status of the task. If not provided, defaults to 1.
 * @returns {number} The determined status of the task.
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
 * Saves a subtask to the server.
 *
 * This function sends a POST request to the server to save a subtask with the provided text.
 *
 * @param {string} subtaskText - The text of the subtask to be saved.
 * @returns {Promise<void>} A promise that resolves when the subtask is successfully saved.
 * @throws {Error} Throws an error if the request fails.
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
 * Populates the "Assigned To" dropdown with a list of contacts.
 * 
 * This function dynamically generates the dropdown options based on the `contacts` array.
 * Each contact is rendered using the `addTaskTemplate` function, and the dropdown is updated
 * with the generated HTML. If a contact is already selected (exists in `selectedContacts`),
 * it will be marked accordingly in the dropdown.
 * 
 * @returns {void} This function does not return a value.
 */
function populateAssignedToSelect() {
  const dropdown = document.getElementById("assigned-dropdown");
  if (!dropdown || !Array.isArray(contacts) || contacts.length === 0) return;
  dropdown.innerHTML = contacts
    .map((contact) =>
      addTaskTemplate(
        contact,
        selectedContacts.some((c) => c.id === contact.id)
      )
    )
    .join("");
  addContactCheckboxListeners();
}

/**
 * Adds event listeners to all elements with the class "contact-checkbox".
 * When a checkbox's state changes, it triggers the `toggleContactSelection` function
 * with the checkbox element as its context.
 *
 * This function is used to manage the selection state of contact checkboxes dynamically.
 */
function addContactCheckboxListeners() {
  document.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      toggleContactSelection(this);
    });
  });
}

/**
 * Toggles the selection of a contact based on the state of a checkbox.
 * Updates the `selectedContacts` array and applies or removes the "checked" class
 * to the parent container of the checkbox. Also triggers an update to the displayed
 * selected contacts.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element that was toggled.
 *   Its `value` attribute should correspond to the `id` of a contact.
 */
function toggleContactSelection(checkbox) {
  const contact = contacts.find((c) => c.id === checkbox.value);
  if (!contact) return;
  const parentContainer = checkbox.closest(".customCheckboxContainer");
  if (checkbox.checked) {
    selectedContacts.push(contact);
    parentContainer.classList.add("checked");
  } else {
    selectedContacts = selectedContacts.filter((c) => c.id !== contact.id);
    parentContainer.classList.remove("checked");
  }
  updateSelectedContacts();
}


/**
 * Updates the selected contacts container by clearing its current content
 * and appending a new div element for each contact in the selectedContacts array.
 * Each contact element displays the contact's initials and is styled with the contact's color.
 */
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

/**
 * Removes a contact from the selected contacts list by their ID.
 *
 * @param {number} contactId - The ID of the contact to be removed.
 */
function removeSelectedContact(contactId) {
  selectedContacts = selectedContacts.filter((contact) => contact.id !== contactId);
  const checkbox = document.getElementById(`contact-${contactId}`);
  if (checkbox) {
    checkbox.checked = false;
  }
  updateSelectedContacts();
}

/**
 * Filters the list of contacts based on the search term entered by the user.
 *
 * This function retrieves the search term from an input element with the ID "search-contacts",
 * converts it to lowercase, and then iterates over all elements with the class "customCheckboxContainer".
 * It compares the text content of each element's child with the class "subtasksUnit" to the search term.
 * If the text content includes the search term, the element is displayed; otherwise, it is hidden.
 */
function filterContacts() {
  const searchTerm = document.getElementById("search-contacts").value.toLowerCase();
  document.querySelectorAll(".customCheckboxContainer").forEach((label) => {
    const name = label.querySelector(".subtasksUnit").textContent.toLowerCase();
    label.style.display = name.includes(searchTerm) ? "flex" : "none";
  });
}

/**
 * Generates the initials from a given name.
 *
 * @param {string} name - The full name from which to extract initials. 
 *                        If the name is empty or undefined, "??" is returned.
 * @returns {string} The initials of the name in uppercase. If the name is empty,
 *                   "??" is returned. If no valid initials can be extracted,
 *                   the first character of the name (in uppercase) is returned.
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

/**
 * Deletes a subtask element from the DOM based on its unique ID.
 *
 * @param {number|string} id - The unique identifier of the subtask element to be removed.
 *                             This ID is used to locate the element with the corresponding
 *                             `subTaskUnit{id}` ID in the DOM.
 */
function deleteSubtask(id) {
  const removeSubtask = document.getElementById(`subTaskUnit${id}`);
  removeSubtask.remove();
}

/**
 * Edits a subtask by replacing its content with an input field for editing.
 *
 * @param {number} id - The unique identifier of the subtask to be edited.
 * @param {string} subTaskInput - The current value of the subtask to be placed in the input field.
 */
function editSubtask(id, subTaskInput) {
  let editSubtask = document.getElementById(`subTaskUnit${id}`);
  editSubtask.innerHTML = "";
  editSubtask.classList.add("editing");
  editSubtask.innerHTML = addInputField(id, subTaskInput);
}

/**
 * Accepts a subtask input, removes the input field, and adds the subtask to the subtask container.
 *
 * @param {number} id - The unique identifier for the subtask input and subtask unit elements.
 */
function accept(id) {
  let subTaskContainer = document.getElementById("subtasks-container");
  let newSubTask = document.getElementById(`inputSubtask${id}`).value;
  const removeSubtask = document.getElementById(`subTaskUnit${id}`);
  removeSubtask.remove();
  subTaskContainer.innerHTML += addSubtaskTemplate(newSubTask, id);
}


/**
 * Clears the task form by resetting input fields, selections, and error messages.
 * Also resets the selected contacts array and sets the default priority to "medium".
 *
 * @param {Event} event - The event object triggered by the form submission.
 */
function clearForm(event) {
  event.preventDefault();
  resetInputFields();
  resetSelections();
  resetErrors();
  selectedContacts = [];
  const defaultMediumButton = document.querySelector(".priority .medium");
  handlePriorityClick(defaultMediumButton);
}

/**
 * Resets the input fields of a task form to their default values.
 * 
 * This function clears the values of the input fields for task title, 
 * description, due date, and category. It also resets the category 
 * display text to "Select task category".
 */
function resetInputFields() {
  document.getElementById("inputField").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("category-input").querySelector("span").textContent = 
    "Select task category";
  document.getElementById("category").value = "";
}

/**
 * Resets the selections in the task creation form.
 * 
 * This function clears the selected contacts and subtasks containers,
 * unchecks all contact checkboxes, and removes the "checked" class
 * from their parent elements to visually reset the state.
 */
function resetSelections() {
  document.getElementById("selected-contacts").innerHTML = "";
  document.getElementById("subtasks-container").innerHTML = "";
  document.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.closest(".customCheckboxContainer").classList.remove("checked");
  });
}

/**
 * Resets error indicators in the DOM by performing the following actions:
 * - Removes the "red-border" class from all elements that have it.
 * - Hides all elements with the "error-message" class by setting their display style to "none".
 */
function resetErrors() {
  document.querySelectorAll(".red-border").forEach((element) => {
    element.classList.remove("red-border");
  });
  document.querySelectorAll(".error-message").forEach((error) => {
    error.style.display = "none";
  });
}

/**
 * Generates a random hexadecimal color code.
 *
 * @returns {string} A string representing a random color in hexadecimal format (e.g., "#A1B2C3").
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Sets the minimum selectable date for all input elements with an ID containing "due-date" 
 * to the current date. The function ensures that users cannot select a date earlier than today.
 * It formats the current date as "YYYY-MM-DD" and applies it as the "min" attribute to the 
 * relevant input elements.
 */
function setMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (mm < 10) mm = "0" + mm;
  if (dd < 10) dd = "0" + dd;
  const todayDate = `${yyyy}-${mm}-${dd}`;
  const dueDateElements = document.querySelectorAll('[id*="due-date"]');
  dueDateElements.forEach((element) => {
    element.setAttribute("min", todayDate);
  });
}
