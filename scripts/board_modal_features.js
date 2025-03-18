/**
 * Opens the edit modal for a task, allowing the user to edit or create a task.
 *
 * @param {string} categoryTask - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} dateTask - The due date of the task.
 * @param {string} priorityTask - The priority level of the task.
 * @param {number} id - The unique identifier of the task. If not provided, a new task will be created.
 * @param {number} [status=1] - The status of the task. Defaults to 1 if not provided.
 */
function openEditModal(categoryTask, title, description, dateTask, priorityTask, id, status) {
  closeSummaryModal();
  showModalVisibility();
  const buttonCopy = id ? "Ok" : "Create Task";
  const headline = id ? "Edit Task" : "Add Task";
  setModalContent(title, description, id, status || 1, buttonCopy, headline);
  initEditModal(id, dateTask, priorityTask, categoryTask);
  if (!categoryTask) {
    document.getElementById("buttonContainerEdit").classList.remove("space");
  }
}

/**
 * Displays the modal and its background by removing "hide" classes,
 * adding "show" classes, and setting their visibility to "visible".
 * Ensures that the modal and its background are properly shown
 * if the corresponding DOM elements are found.
 *
 * @function
 * @throws Will not throw an error but will silently fail if the
 *         elements with IDs "editTaskSectionModal" or "modalEditTask"
 *         are not found in the DOM.
 */
function showModalVisibility() {
  const showModalBackground = document.getElementById("editTaskSectionModal");
  const showModal = document.getElementById("modalEditTask");
  showModal.innerHTML = "";
  if (showModalBackground && showModal) {
    showModalBackground.classList.remove("hide");
    showModal.classList.remove("hide");
    showModalBackground.style.visibility = "visible";
    showModalBackground.classList.add("show");
    showModal.style.visibility = "visible";
    showModal.classList.add("show");
  }
}

/**
 * Updates the content of the modal with the provided task details.
 *
 * @param {string} title - The title of the task to display in the modal.
 * @param {string} description - The description of the task to display in the modal.
 * @param {number} id - The unique identifier of the task.
 * @param {string} status - The current status of the task (e.g., "open", "in progress", "completed").
 * @param {string} buttonCopy - The text to display on the modal's action button.
 * @param {string} headline - The headline text to display in the modal.
 */
function setModalContent(title, description, id, status, buttonCopy, headline) {
  const showModal = document.getElementById("modalEditTask");
  showModal.innerHTML = addEditTask(title, description, id, status, buttonCopy, headline);
}

/**
 * Initializes the edit modal for a task with the given parameters.
 *
 * @param {number} id - The unique identifier of the task to be edited.
 * @param {string} dateTask - The due date of the task in a string format.
 * @param {string} priorityTask - The priority level of the task (e.g., "High", "Medium", "Low").
 * @param {string} [categoryTask] - The category of the task. If provided, certain UI elements will be adjusted.
 *
 * This function performs the following actions:
 * - Adds subtasks to the edit modal based on the task ID.
 * - Sets the due date in the modal.
 * - Populates the "Assigned To" dropdown in the edit modal.
 * - Initializes the priority buttons with the given priority level.
 * - Adjusts the UI elements if a category is provided, including hiding category-related fields and modifying modal dimensions.
 * - Determines and sets the assigned users in the edit modal based on the task ID.
 */
function initEditModal(id, dateTask, priorityTask, categoryTask) {
  addSubtaskinEditModal(id);
  addDueDate(dateTask);
  populateAssignedToSelectEdit();
  initPriorityButtons(priorityTask);
  if (categoryTask) {
    document.getElementById("labelCategory").style.display = "none";
    document.getElementById("custom-category").style.display = "none";
    document.getElementById("buttonContainerEdit").style.marginTop = "32px";
    document.getElementById("modalEditTask").style.height = "750px";
    document.getElementById("divider").style.height = "350px";
  }
  determineAssignedToEditModal(id);
}

/**
 * Formats a given date string from "DD/MM/YYYY" format to "YYYY-MM-DD" format
 * and sets it as the value of the HTML element with the ID "due-date-edit".
 *
 * @param {string} dateTask - The date string in "DD/MM/YYYY" format.
 */
function addDueDate(dateTask) {
  let parts = dateTask.split("/");
  let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  let dueDateContainer = document.getElementById("due-date-edit");
  dueDateContainer.value = formattedDate;
}

/**
 * Determines the assigned contacts for a task in the edit modal and preselects them.
 *
 * This function retrieves a task by its ID, checks if it has assigned contacts,
 * and preselects those contacts in the edit modal by toggling their selection.
 * It also applies the corresponding color for each assigned contact.
 *
 * @param {number|string} id - The unique identifier of the task to be edited.
 *
 * @returns {void} This function does not return a value. It performs UI updates.
 *
 * @throws {Error} This function does not explicitly throw errors, but it assumes
 * that `allTasks` and `allContacts` are defined and accessible in the scope.
 *
 * @example
 * // Assuming a task with ID 1 exists and has assigned contacts:
 * determineAssignedToEditModal(1);
 *
 * @description
 * - The function first finds the task with the given ID from the `allTasks` array.
 * - If the task or its `assignedTo` property is not found, the function exits early.
 * - For each assigned contact, it finds the corresponding contact in the `allContacts` array.
 * - If a matching contact is found, it calls `toggleContactSelectionEditPreselected`
 *   with the contact's ID, name, and the assigned color.
 */
function determineAssignedToEditModal(id) {
  let task = allTasks.find((t) => t["id"] === id);
  if (!task) return;
  if (!task.assignedTo) return;
  task.assignedTo.forEach((assignedPerson, index) => {
    let color = task.color[index] || "#000000";
    let foundContact = allContacts.find((contact) => contact.contactName === assignedPerson);
    if (foundContact) {
      toggleContactSelectionEditPreselected(foundContact.idContact, assignedPerson, color);
    }
  });
}

/**
 * Populates the "Assigned To" dropdown in the edit modal and adds event listeners to the checkboxes.
 *
 * This function performs the following tasks:
 * 1. Calls `populateAssignedToDropdown()` to populate the dropdown with available options.
 * 2. Calls `addCheckboxEventListeners()` to attach event listeners to the checkboxes for handling user interactions.
 *
 * Usage:
 * Call this function to initialize the "Assigned To" section in the edit modal.
 */
function populateAssignedToSelectEdit() {
  populateAssignedToDropdown();
  addCheckboxEventListeners();
}

/**
 * Populates the "Assigned To" dropdown in the edit modal with a list of contacts.
 *
 * This function dynamically generates the dropdown options based on the `allContacts` array.
 * Each contact is rendered using the `addTaskTemplateEdit` function, and pre-selects
 * contacts that are already in the `selectedContacts` array.
 *
 * @returns {void} This function does not return a value. It updates the DOM directly.
 *
 * @remarks
 * - If the dropdown element with the ID "assigned-dropdown-Edit" is not found, or if
 *   `allContacts` is not a valid array or is empty, the function exits early.
 * - The `addTaskTemplateEdit` function is used to generate the HTML for each contact.
 * - The `selectedContacts` array is used to determine which contacts should be pre-selected.
 */
function populateAssignedToDropdown() {
  const dropdown = document.getElementById("assigned-dropdown-Edit");
  if (!dropdown || !Array.isArray(allContacts) || allContacts.length === 0) {
    return;
  }
  dropdown.innerHTML = allContacts
    .map((contact) =>
      addTaskTemplateEdit(
        contact,
        selectedContacts.some((c) => c.id === contact.id)
      )
    )
    .join("");
}

/**
 * Adds event listeners to all elements with the class "contact-checkbox".
 * When a checkbox is changed, it retrieves the associated contact's name and color
 * from the DOM and calls the `toggleContactSelectionEdit` function with the checkbox value,
 * contact name, and color.
 *
 * The function assumes the following DOM structure for each checkbox:
 * - The checkbox is inside a container with the class "customCheckboxContainer".
 * - The container includes a child element with the class "contact-row".
 * - The "contact-row" contains:
 *   - An element with the class "subtasksUnit" for the contact's name.
 *   - An element with the class "svg-container" for the contact's color.
 *
 * @function
 * @returns {void}
 */
function addCheckboxEventListeners() {
  document.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const label = this.closest(".customCheckboxContainer");
      if (!label) return;
      const contactRow = label.querySelector(".contact-row");
      const name = contactRow.querySelector(".subtasksUnit")?.textContent || "unknown";
      const color = contactRow.querySelector(".svg-container")?.style.backgroundColor || "#000";
      toggleContactSelectionEdit(this.value, name, color);
    });
  });
}
