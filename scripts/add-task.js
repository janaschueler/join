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

function selectCategory(label) {
  document.querySelector("#category-input span").textContent = label;
  document.getElementById("category").value = label;
  document.getElementById("category-dropdown").classList.remove("visible");
  document.querySelectorAll("#category-dropdown .dropdown-option").forEach((option) => {
    option.classList.remove("selected");
  });
  validateCategoryOnBlurModal();
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
 * Adds a new task with the provided status.
 *
 * This function collects task details from input fields, validates the input,
 * constructs a task object, and sends it to the server to be saved.
 * If the task is successfully saved, the user is redirected to the board page.
 * If there is an error during the save process, an alert is shown with the error message.
 *
 * @param {string} statusTask - The status of the task to be added.
 * @returns {Promise<void>} - A promise that resolves when the task is added.
 * @throws {Error} - Throws an error if the task could not be saved.
 */
async function addTask(statusTask) {
  const title = document.getElementById("inputField")?.value.trim();
  const description = document.getElementById("description")?.value.trim();
  const dueDate = document.getElementById("due-date")?.value.trim();
  const category = document.getElementById("category")?.value;
  const subtasks = [...document.querySelectorAll(".subtask-text")].map((el) => el.textContent.trim());
  validateTaskFields(title, dueDate, category);
  if (!title || !dueDate || !category) {
    return;
  }
  const taskData = { title, description, dueDate, category, priority: selectedPriority, subtasks, assignedContacts: selectedContacts, status: determineStatusAddTask(statusTask), createdAt: new Date().toISOString() };
  try {
    const res = await fetch(`${BASE_URL}/tasks.json`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(taskData) });
    if (!res.ok) throw new Error(`Error saving task: ${res.status}`);
    setTimeout(() => {
      location.href = "board.html";
    }, 100); // Warte 100ms
  } catch (err) {
    alert(err.message);
  }
}

function validateTaskFields(title, dueDate, category) {
  toggleRedBorder("inputField", !title);
  const dueDateElement = document.querySelector("[id^='due-date']");
  const inputDate = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!dueDate || inputDate < today) {
    toggleRedBorder(dueDateElement.id, true);
  } else {
    toggleRedBorder(dueDateElement.id, false);
  }
  if (category == "Select task category" || category == "") {
    toggleRedBorder("category-input", true);
  } else {
    toggleRedBorder("category-input", false);
  }
}

function toggleRedBorder(elementId, condition) {
  const element = document.getElementById(elementId);
  if (condition) {
    element.classList.add("red-border");
  } else {
    element.classList.remove("red-border");
  }
}

function validateCategoryOnBlur() {
  let category = document.getElementById("category-selection").textContent.trim();
  if (category == "Select task category") {
    document.getElementById("category-input").classList.add("red-border");
  } else {
    document.getElementById("category-input").classList.remove("red-border");
  }
}

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

function validateCategoryOnBlurModal() {
  let category = document.getElementById("category-selection").textContent.trim();
  if (category == "Select task category") {
    document.getElementById("category-input").classList.add("red-border");
  } else {
    document.getElementById("category-input").classList.remove("red-border");
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
 * Populates the "assigned-dropdown" select element with contact options.
 * Each contact option is rendered using the addTaskTemplate function.
 * Adds event listeners to each contact checkbox to handle selection changes.
 *
 * @function
 * @name populateAssignedToSelect
 * @returns {void}
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
  document.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const contact = contacts.find((c) => c.id === this.value);
      if (!contact) return;
      const parentContainer = this.closest(".customCheckboxContainer");
      if (this.checked) {
        selectedContacts.push(contact);
        parentContainer.classList.add("checked"); // Styling aktivieren
      } else {
        selectedContacts = selectedContacts.filter((c) => c.id !== contact.id);
        parentContainer.classList.remove("checked"); // Styling entfernen
      }
      updateSelectedContacts();
    });
  });
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

function clearForm(event) {
  event.preventDefault();
  document.getElementById("inputField").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("category-input").querySelector("span").textContent = "Select task category";
  document.getElementById("category").value = "";
  document.getElementById("selected-contacts").innerHTML = "";
  document.getElementById("subtasks-container").innerHTML = "";
  document.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.closest(".customCheckboxContainer").classList.remove("checked");
  });
  document.querySelectorAll(".red-border").forEach((element) => {
    element.classList.remove("red-border");
  });
  document.querySelectorAll(".error-message").forEach((error) => {
    error.style.display = "none";
  });
  s;
  selectedContacts = [];
  const defaultMediumButton = document.querySelector(".priority .medium");
  handlePriorityClick(defaultMediumButton);
  return;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

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
