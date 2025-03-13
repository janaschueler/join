/**
 * The above functions are used to toggle the display of a status menu and change the visibility of
 * arrow icons based on the menu state.
 * @param event - The `event` parameter in your functions represents the event object that is passed
 * when the event is triggered, such as a click event. This object contains information about the
 * event, such as the type of event, the target element, and any additional data related to the event.
 * You can use this parameter
 * @param id - The `id` parameter in the `openStatusNav` and `closeStatusNav` functions is used to
 * identify the specific element that should be manipulated when the functions are called.
 */

function openStatusNav(event, id) {
  event.stopPropagation(event);
  document.getElementById(`statusMenu${id}`).style.display = "block";
  document.getElementById(`arrowDown${id}`).style.display = "none";
  document.getElementById(`arrowUp${id}`).style.display = "block";
}

function closeStatusNav(event, id) {
  event.stopPropagation(event);
  document.getElementById(`statusMenu${id}`).style.display = "none";
  document.getElementById(`arrowDown${id}`).style.display = "block";
  document.getElementById(`arrowUp${id}`).style.display = "none";
}

/**
 * The above JavaScript functions handle opening a modal, loading task summary content, rendering task
 * details, managing task visibility, assigning contacts, handling subtasks, and updating subtask
 * statuses.
 * @param id - The `id` parameter in the `openModal(id)` functions is used to
 * identify the specific task which information should be rendered in the modal.
 */
function openModal(id) {
  loadTaskSummaryModal(id)
    .then(() => {
      var modal = document.getElementById("modalTaskSummary");
      var backdrop = document.getElementById("taskSummaryModal");

      backdrop.style.visibility = "visible";
      backdrop.style.opacity = "1";

      modal.style.visibility = "visible";
      type = "button";
      modal.classList.remove("hide");
      modal.classList.add("show");
    })
    .catch((error) => {
      console.error("Error loading content:", error);
    });
}

function loadTaskSummaryModal(id) {
  return new Promise((resolve, reject) => {
    let summaryModal = document.getElementById("taskSummaryModal");
    summaryModal.innerHTML = "";

    let task = allTasks.find((t) => t.id === id);
    if (!task) return reject("Task not found");

    renderTaskSummaryContent(summaryModal, task);
    handleTaskVisibility(task);
    setTimeout(resolve, 0);
  });
}

function renderTaskSummaryContent(summaryModal, task) {
  let formattedDate = convertTask(task.dueDate);
  let priority = determinePriotirySpan(task.priority);
  let priorityIcon = determinePriotiry(task.priority);
  let categoryColor = determineCategoryColor(task.category);
  summaryModal.innerHTML += generateTaskSummaryModal(task, priorityIcon, formattedDate, categoryColor, priority);
}

function convertTask(dueDate) {
  let formatedDueDate = new Intl.DateTimeFormat("en-Gb").format(new Date(dueDate));
  return formatedDueDate;
}

function determinePriotirySpan(priority) {
  if (!priority) {
    priority = "medium";
  }
  return priority;
}

function determineCategoryColor(category) {
  let categoryColor;
  if (category == "Technical Task") {
    categoryColor = "background-color:rgba(31, 215, 193, 1);";
    return categoryColor;
  } else {
    categoryColor = "background-color:rgba(0, 56, 255, 1);";
  }
  return categoryColor;
}

function handleTaskVisibility(task) {
  task.assignedTo?.length ? injectAssigneeContacts(task) : hideElement(`assignedToContainer${task.id}`);
  task.subtasks?.length ? injectSubtasks(task) : hideElement(`subtaskContainer${task.id}`);
}

async function injectAssigneeContacts(task) {
  const assigneeContainer = document.getElementById(`assigneeListModal${task.id}`);
  assigneeContainer.innerHTML = "";
  let assigneeList = extractAssigneeList(task.assignedTo);
  assigneeList.forEach((assignee, index) => renderAssignee(assignee, task.color[index], assigneeContainer));
}

function hideElement(id) {
  let element = document.getElementById(id);
  if (element) element.style.display = "none";
}

function extractAssigneeList(assignedTo) {
  if (Array.isArray(assignedTo)) return assignedTo;
  if (typeof assignedTo === "string") return [assignedTo];
  if (typeof assignedTo === "object") return Object.keys(assignedTo);
  return [];
}

function renderAssignee(assignee, color, container) {
  let name = assignee || "Unknown";
  let abbreviation = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  container.innerHTML += generateAssigneeComntacts(abbreviation, color, name);
}

async function injectSubtasks(task) {
  const subtaskContainer = document.getElementById(`subtaskListModal${task.id}`);
  subtaskContainer.innerHTML = "";
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [task.subtasks || []];
  const statuses = Array.isArray(task.subtasksStatus) ? task.subtasksStatus : new Array(subtasks.length).fill(0);
  subtasks.forEach((subtask, index) => {
    subtaskContainer.innerHTML += generateSubtasks(task, subtask, index, statuses[index] === 1);
  });

  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => cb.addEventListener("change", handleCheckboxChange));
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const taskId = checkbox.id;
  const index = checkbox.getAttribute("data-index");
  const containerId = taskId.slice(0, -index.length);
  const subtasks = document.querySelectorAll(`#subtaskContainer${containerId} input[type="checkbox"]`);
  let subtasksStatus = [];
  subtasks.forEach((subtask, idx) => {
    const status = subtask.checked ? 1 : 0;
    subtask.setAttribute("data-status", status);
    subtasksStatus.push(status);
  });
  addSubtasksStatus(containerId, subtasksStatus);
}

async function addSubtasksStatus(key, status) {
  try {
    await postToDatabase(key, "/subtasksStatus", status);
  } catch (error) {
    console.error("Error setting status:", error);
    throw error;
  }
}

/**
 * The function closeModal closes a modal dialog and reloads the window when triggered by a specific
 * event or element.
 * @param [event=null] - The `event` parameter in the `closeModal` function is used to pass an event
 * object, which can be used to determine the source of the event that triggered the modal closure.
 * This allows the function to check if the modal should be closed based on the event target, such as
 * clicking on the
 */
function closeModal(event = null) {
  var modal = document.getElementById("modalTaskSummary");
  var backdrop = document.getElementById("taskSummaryModal");

  if (!event || event.target === backdrop || event.target.classList.contains("modalCloseButton")) {
    modal.classList.add("hide");
    backdrop.classList.add("hide");
    setTimeout(function () {
      modal.style.visibility = "hidden";
      backdrop.style.visibility = "hidden";
      modal.classList.remove("show");
      backdrop.classList.remove("show");
    }, 500);

    window.location.reload();
  }
}

/**
 * The `deleteTask` function deletes a specific task from a Firebase database and updates the database
 * with the remaining tasks.
 * @param taskId - The `taskId` parameter in the `deleteTask` function represents the unique identifier
 * of the task that needs to be deleted from the Firebase database. This identifier is used to locate
 * the specific task within the list of tasks retrieved from Firebase and then remove it before
 * updating the database with the remaining tasks.
 */
async function deleteTask(taskId) {
  let allTasksFirebase = await getDataFromFireBase();
  let allTasksArray = Object.entries(allTasksFirebase).map(([key, value]) => ({
    ...value,
    firebaseId: key,
  }));
  let taskToDelete = allTasksArray.find((task) => task.firebaseId === taskId);
  if (taskToDelete) {
    allTasksArray = allTasksArray.filter((task) => task.firebaseId !== taskId);
  }
  let updatedTasks = allTasksArray.reduce((acc, task) => {
    const { firebaseId, ...taskData } = task;
    acc[firebaseId] = taskData;
    return acc;
  }, {});
  await postToDatabase("", "", updatedTasks);
  loadBoardContent();
  closeModal();
}

async function getDataFromFireBase(path = "") {
  let response = await fetch(BASE_URL + "tasks/" + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
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
function closeModalAddTask(event) {
  if (!event) {
    return;
  }
  event.preventDefault();
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

/**
 * The above functions are used to handle button clicks, open and populate an edit modal, set modal
 * content, initialize the edit modal with data, add due date, and populate a dropdown for selecting
 * contacts in a task management application.
 * @param status - The `status` parameter in the `handleButtonClickStatus` function is used to
 * which of the four states the current task is in.
 * If the window width is less than or equal to 768 pixels, it will redirect to "/add_task.html";
 * otherwise,
 */

function handleButtonClickStatus(status) {
  if (window.innerWidth <= 768) {
    window.location.href = "/add_task.html";
  } else {
    openEditModal("", "", "", "", "", "", status);
  }
}

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

function showModalVisibility() {
  const showModalBackground = document.getElementById("editTaskSectionModal");
  const showModal = document.getElementById("modalEditTask");
  showModal.innerHTML = "";
  if (showModalBackground && showModal) {
    showModalBackground.style.visibility = "visible";
    showModalBackground.classList.add("show");
    showModal.style.visibility = "visible";
    showModal.classList.add("show");
  }
}

function setModalContent(title, description, id, status, buttonCopy, headline) {
  const showModal = document.getElementById("modalEditTask");
  showModal.innerHTML = addEditTask(title, description, id, status, buttonCopy, headline);
}

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

function addDueDate(dateTask) {
  let parts = dateTask.split("/");
  let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  let dueDateContainer = document.getElementById("due-date-edit");
  dueDateContainer.value = formattedDate;
}

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

function populateAssignedToSelectEdit() {
  const dropdown = document.getElementById("assigned-dropdown-Edit");
  if (!dropdown) {
    return;
  }
  if (!Array.isArray(allContacts) || allContacts.length === 0) {
  }
  dropdown.innerHTML = allContacts
    .map((contact) =>
      addTaskTemplateEdit(
        contact,
        selectedContacts.some((c) => c.id === contact.id)
      )
    )
    .join("");

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

/**
 * The closeSummaryModal function hides a modal and its backdrop after a delay of 500 milliseconds.
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
