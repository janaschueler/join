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
  closeDropdownOnOutsideClick(
    event,
    "category-dropdown",
    "custom-category",
    "category-dropdown-icon"
  );
  closeDropdownOnOutsideClick(
    event,
    "assigned-dropdown",
    "assigned-input",
    null
  );
});

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

async function addTask(statusTask) {
  const title = inputField.value.trim(),
    description = description.value.trim(),
    dueDate = dueDate.value.trim(),
    category = category.value,
    subtasks = [...document.querySelectorAll(".subtask-text")].map((el) =>
      el.textContent.trim()
    );

  if (!title || !dueDate || !category || !selectedPriority)
    return alert("Please fill in all required fields.");

  const taskData = {
    title,
    description,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks,
    assignedContacts: selectedContacts,
    status: determineStatusAddTask(statusTask),
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${BASE_URL}/tasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error(`Error saving task: ${res.status}`);
    location.href = "board.html";
  } catch (err) {
    alert(err.message);
  }
}

function determineStatusAddTask(statusTask) {
  let status;
  if (!statusTask) {
    status = 1;
  } else {
    status = statusTask;
  }
  return status;
}

async function saveSubtask(subtaskText) {
  try {
    const response = await fetch(`${BASE_URL}/subtasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: subtaskText }),
    });
  } catch (error) {}
}

function populateAssignedToSelect() {
  const dropdown = document.getElementById("assigned-dropdown");
  if (!dropdown) {
    return;
  }
  if (!Array.isArray(contacts) || contacts.length === 0) {
  }
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
      const label = this.closest(".customCheckboxContainer");
      if (!label) return;
      const contactRow = label.querySelector(".contact-row");
      const name =
        contactRow.querySelector(".subtasksUnit")?.textContent || "Unbekannt";
      const color =
        contactRow.querySelector(".svg-container")?.style.backgroundColor ||
        "#000";
      toggleContactSelection(this.value, name, color);
    });
  });
}

window.toggleContactSelection = function (
  contactId,
  contactName,
  contactColor
) {
  const checkbox = document.getElementById(`contact-${contactId}`);
  const container = checkbox.closest(".customCheckboxContainer");
  const input = document.getElementById("search-contacts");
  if (!checkbox) return;
  if (checkbox.checked) {
    if (!selectedContacts.some((c) => c.id === contactId)) {
      container.classList.add("checked");
      selectedContacts.push({
        id: contactId,
        name: contactName,
        color: contactColor,
      });
      input.value = "";
      filterContacts();
    }
  } else {
    container.classList.remove("checked");
    selectedContacts = selectedContacts.filter((c) => c.id !== contactId);
  }
  updateSelectedContacts();
};

function updateSelectedContacts() {
  const selectedContactsContainer =
    document.getElementById("selected-contacts");
  selectedContactsContainer.innerHTML = "";
  selectedContacts.forEach((contact) => {
    const contactElement = document.createElement("div");
    contactElement.classList.add("selected-contact");
    contactElement.style.backgroundColor = contact.color;
    contactElement.innerHTML = `
          <span class="selected-contact-initials">${getInitials(
            contact.name
          )}</span>`;
    selectedContactsContainer.appendChild(contactElement);
  });
}

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

// Erlaubt, dass Filtern der Kontakte bzw das suchen nach Kontakten.
function filterContacts() {
  const searchTerm = document
    .getElementById("search-contacts")
    .value.toLowerCase();
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
