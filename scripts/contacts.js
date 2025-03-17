const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allUsers = [];
let selectedContactId = null;

async function init() {
  let checkedAuthority = await checkAccessAuthorization();
  if (checkedAuthority) {
    await fetchData();
    renderTopBar();
    renderSmallContacts();
    renderBigContacts();
    renderModalContacts();
    highlightActiveContact();
  } else {
    window.location.href = "login.html";
  }
}

async function fetchData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let data = await response.json();
  if (data && data.contacts) {
    allUsers = Object.values(data.contacts);
  } else {
    allUsers = [];
  }
  renderSmallContacts();
  renderBigContacts();
  return data;
}

/**
 * Renders the modal content for the selected contact.
 *
 * This function clears the current content of the modal and, if a contact is selected,
 * finds the contact from the list of all users and updates the modal content with the
 * selected contact's details.
 *
 * @function
 * @name renderModalContacts
 * @global
 */
function renderModalContacts() {
  let contactsModalRef = document.getElementById("contactsModal_content");
  contactsModalRef.innerHTML = "";
  if (selectedContactId) {
    let selectedContact = allUsers.find((contact) => contact.id === selectedContactId);
    if (selectedContact) {
      contactsModalRef.innerHTML = templateModalContacts(selectedContact);
    }
  }
}

function renderSmallContacts() {
  let contactsSmallRef = document.getElementById("contactsSmall_content");
  contactsSmallRef.innerHTML = "";
  let sortedContacts = sortContactsByName(allUsers);
  let groupedContactsHTML = generateGroupedContactsHTML(sortedContacts);

  contactsSmallRef.innerHTML = groupedContactsHTML;
}

function sortContactsByName(contacts) {
  return contacts.slice().sort((a, b) => {
    let nameA = a.name.trim().split(" ")[0].toUpperCase();
    let nameB = b.name.trim().split(" ")[0].toUpperCase();
    return nameA.localeCompare(nameB);
  });
}

function generateGroupedContactsHTML(contacts) {
  let currentGroup = "";
  let html = "";
  contacts.forEach((contact) => {
    let firstLetter = contact.name.trim().split(" ")[0].charAt(0).toUpperCase();
    if (firstLetter !== currentGroup) {
      currentGroup = firstLetter;
      html += createGroupHeader(firstLetter);
    }
    html += templateSmallContacts(contact);
  });
  return html;
}

function createGroupHeader(letter) {
  return `
    <div class="category"><span><b>${letter}</b></span></div>
    <div class="horizontalLine"></div>
  `;
}

function renderBigContacts() {
  const selectedContactId = localStorage.getItem("selectedContact");
  let contactsBigRef = document.getElementById("contactsBig_content");
  contactsBigRef.innerHTML = "";
  if (selectedContactId) {
    let selectedContact = allUsers.find((contact) => contact.id === selectedContactId);
    if (selectedContact) {
      contactsBigRef.innerHTML = templateBigContacts(selectedContact);
    }
  }
}

function renderModalContacts() {
  let contactsModalRef = document.getElementById("contactsModal_content");
  contactsModalRef.innerHTML = "";
  if (selectedContactId) {
    let selectedContact = allUsers.find((contact) => contact.id === selectedContactId);
    if (selectedContact) {
      contactsModalRef.innerHTML = templateModalContacts(selectedContact);
    }
  }
}

/**
 * Selects a contact by its ID and triggers the rendering of the contact details.
 *
 * @param {number} contactId - The ID of the contact to be selected.
 */
function selectContact(contactId) {
  localStorage.setItem("selectedContact", contactId);
  selectedContactId = contactId;
  renderBigContacts();
  renderModalContacts();
  highlightActiveContact();
}

/**
 * Opens the edit dialog for a specific contact. Populates the dialog fields
 * with contact information based on the provided contact ID and sets the action
 * for the delete button to delete a contact and reset the modal.
 *
 * @param {string} contactId - The ID of the contact to be edited.
 * @returns {Promise<void>} A promise that resolves when the dialog is opened and contact data is loaded.
 */
async function openEditDialog(contactId) {
  selectedContactId = contactId;
  toggleDialogVisibility();
  await populateDialogFields(contactId);
}

async function populateDialogFields(contactId) {
  let nameRef = document.getElementById("dialog-name");
  let emailRef = document.getElementById("dialog-email");
  let phoneRef = document.getElementById("dialog-phone");
  let firebaseId = await getFirebaseId(contactId);
  let contactData = await fetchContactData(`contacts/${firebaseId}`);
  nameRef.value = contactData.name || "";
  emailRef.value = contactData.email || "";
  phoneRef.value = contactData.phone || "";
  deleteButton.setAttribute("onclick", `deleteContact('${contactId}')`);
}

async function fetchContactData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let data = await response.json();
  if (data && data.contacts) {
    allUsers = Object.values(data.contacts);
  } else {
    allUsers = [];
  }
  return data;
}

async function deleteContact(contactId) {
  let contactsSmallRef = document.getElementById("contactsSmall_content");
  let firebaseId = await getFirebaseId(contactId);
  if (!firebaseId) return;
  await deleteData(`contacts/${firebaseId}`);
  await removeContactFromTasks(firebaseId);
  allUsers = allUsers.filter((contact) => contact.id !== contactId);
  contactsSmallRef.innerHTML = "";
  renderSmallContacts();
  renderBigContacts();
  await fetchData();
}

async function getFirebaseId(contactId) {
  let response = await fetch(BASE_URL + "contacts.json");
  let data = await response.json();
  for (let firebaseId in data) {
    if (data[firebaseId].id === contactId.toString()) {
      return firebaseId;
    }
  }
  return null;
}

async function saveEditedContact() {
  let closDialog = document.getElementById("dialog_content");
  let updatedData = await getUpdatedContactData();
  let firebaseId = await getFirebaseId(selectedContactId);
  await patchData(`contacts/${firebaseId}`, updatedData);
  closDialog.classList.add("d_none");
  resetDialogFields();
  signupSuccessfullMessage("edit");
}

async function getUpdatedContactData() {
  let nameRef = document.getElementById("dialog-name");
  let emailRef = document.getElementById("dialog-email");
  let phoneRef = document.getElementById("dialog-phone");
  return {
    id: selectedContactId,
    name: nameRef.value,
    email: emailRef.value,
    phone: phoneRef.value,
    color: getColorById(selectedContactId),
  };
}

function resetDialogFields() {
  document.getElementById("dialog-name").value = "";
  document.getElementById("dialog-email").value = "";
  document.getElementById("dialog-phone").value = "";
}

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * Removes a contact from all tasks in the database.
 *
 * This function fetches all tasks from the database, iterates through them,
 * and removes the contact with the specified Firebase ID from the assigned contacts
 * of each task. If the contact is found and removed from a task, the task is updated
 * in the database.
 *
 * @async
 * @function removeContactFromTasks
 * @param {string} firebaseId - The Firebase ID of the contact to be removed.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function removeContactFromTasks(firebaseId) {
  let tasks = await fetchData("tasks");
  for (let taskId in tasks) {
    let task = tasks[taskId];
    if (task.assignedContacts) {
      let updatedContacts = task.assignedContacts.filter((contact) => contact.id !== firebaseId);
      if (updatedContacts.length < task.assignedContacts.length) {
        await patchData(`tasks/${taskId}`, { assignedContacts: updatedContacts });
      }
    }
  }
}

/**
 * Adds a new contact to the contact list.
 *
 * This function retrieves the input values for name, email, and phone from the DOM,
 * creates a new contact object, validates the input fields, and if valid, posts the
 * new contact data to the server. It then updates the contact list and clears the input fields.
 *
 * @async
 * @function addContact
 * @returns {Promise<void>} - A promise that resolves when the contact has been added.
 */

function checkExistingContacts(emailRef) {
  let existingEmails = allUsers.filter((contact) => contact.email === emailRef.value);
  return existingEmails.length;
}

async function addContact() {
  let nameRef = document.getElementById("recipient-name");
  let emailRef = document.getElementById("recipient-email");
  let phoneRef = document.getElementById("recipient-phone");
  if (!validateContactInputs(nameRef, emailRef, phoneRef)) return;
  let existingContactsCount = checkExistingContacts(emailRef);
  if (existingContactsCount > 0) {
    signupSuccessfullMessage("existing");
    return;
  }
  let newContact = createContact(nameRef.value, emailRef.value, phoneRef.value);
  await saveContact(newContact);
  updateContactUI();
  resetContactForm(nameRef, emailRef, phoneRef);
  signupSuccessfullMessage("new");
}

function validateContactInputs(nameRef, emailRef, phoneRef) {
  let isValid = nameRef.value && emailRef.value && phoneRef.value;
  document.getElementById("editContactInputfieldError").classList.toggle("d_none", isValid);
  document.getElementById("newContactInputfieldError").classList.toggle("d_none", isValid);
  return isValid;
}

function createContact(name, email, phone) {
  let contactId = Date.now().toString();
  return {
    id: contactId,
    name,
    email,
    phone,
    color: getColorById(contactId),
  };
}

async function saveContact(contact) {
  await postData("contacts", contact);
  allUsers.push(contact);
  selectedContactId = contact.id;
}

function updateContactUI() {
  document.getElementById("contactsSmall_content").innerHTML = "";
  renderSmallContacts();
  renderBigContacts();
}

function resetContactForm(nameRef, emailRef, phoneRef) {
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

async function patchData(path = "", data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

function getColorById(contactId) {
  let sum = 0;
  for (let i = 0; i < contactId.length; i++) {
    sum += contactId.charCodeAt(i);
  }
  let index = sum % coloursArray.length;
  return coloursArray[index];
}

async function hideOverlayAndReload(overlay) {
  overlay.style.display = "none";
  await fetchData();
  renderSmallContacts();
  renderBigContacts();
  highlightActiveContact();
}