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
  } else {
    window.location.href = "login.html";
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

function renderSmallContacts() {
  let contactsSmallRef = document.getElementById("contactsSmall_content");
  allUsers.sort((a, b) => {
    let nameA = a.name.trim().split(" ")[0].toUpperCase();
    let nameB = b.name.trim().split(" ")[0].toUpperCase();
    return nameA.localeCompare(nameB);
  });
  let currentGroup = "";
  allUsers.forEach((contact) => {
    let firstLetter = contact.name.trim().split(" ")[0].charAt(0).toUpperCase();
    if (firstLetter !== currentGroup) {
      currentGroup = firstLetter;
      contactsSmallRef.innerHTML += `<div class="category"><span><b>${firstLetter}<b></span></div>
                                            <div class="horizontalLine"></div>`;
    }
    contactsSmallRef.innerHTML += templateSmallContacts(contact);
  });
}

function renderBigContacts() {
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
 * Resets the contact modal forms and alerts.
 *
 * This function resets any alerts and clears the input fields
 * of both the new contact form and the edit contact form. Afterwards
 * the function `resetAltert` hides alert messages and removes error styles from input fields.
 */
function resetModal() {
  resetAlert();
  document.getElementById("newContactForm").reset();
  document.getElementById("editContactForm").reset();
}

function resetAlert() {
  document.getElementById("invalidPasswordContact").classList.add("d_none");
  document.getElementById("invalidPasswordNewContact").classList.add("d_none");
  document.getElementById("dialog-email").classList.remove("input-error");
  document.getElementById("recipient-email").classList.remove("input-error");
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
  setDeleteButtonAction(contactId);
}

function toggleDialogVisibility() {
  document.getElementById("body").classList.toggle("o_none");
  document.getElementById("dialog_content").classList.remove("d_none");
}

async function populateDialogFields(contactId) {
  let nameRef = document.getElementById("dialog-name");
  let emailRef = document.getElementById("dialog-email");
  let phoneRef = document.getElementById("dialog-phone");
  let firebaseId = await getFirebaseId(contactId);
  let contactData = await fetchData(`contacts/${firebaseId}`);

  nameRef.value = contactData.name || "";
  emailRef.value = contactData.email || "";
  phoneRef.value = contactData.phone || "";
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
  location.reload();
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
 * Selects a contact by its ID and triggers the rendering of the contact details.
 *
 * @param {number} contactId - The ID of the contact to be selected.
 */
function selectContact(contactId) {
  selectedContactId = contactId;
  renderBigContacts();
  renderModalContacts();
}

/**
 * Toggles the visibility of the dialog content and reloads the page.
 *
 * This function finds the element with the ID "dialog_content" and toggles
 * the "d_none" class on it, which is presumably used to show or hide the
 * dialog. After toggling the visibility, the page is reloaded.
 */
function cancelAndCross() {
  let showDialog = document.getElementById("dialog_content");
  showDialog.classList.toggle("d_none");
  location.reload();
}

/**
 * Closes the contact information dialog by adding a CSS class to hide it on mobile devices.
 *
 * This function selects the HTML element with the ID "contactInfo_content" and adds the
 * "d_none_mobile" class to it, which is assumed to hide the element on mobile devices.
 */
function closeContactInfo() {
  let showDialog = document.getElementById("contactInfo_content");
  showDialog.classList.add("d_none_mobile");
}

/**
 * Displays the contact information section on mobile devices.
 *
 * This function checks if the viewport width is 768 pixels or less
 * using the `window.matchMedia` method. If the condition is met,
 * it removes the "d_none_mobile" class from the element with the
 * ID "contactInfo_content", making the contact information visible
 * on mobile devices.
 */
function mobileContactInfo() {
  let contactInfo = document.getElementById("contactInfo_content");
  if (window.matchMedia("(max-width: 768px)").matches) {
    contactInfo.classList.remove("d_none_mobile");
  }
}

/**
 * Toggles the visibility of the edit and delete buttons.
 * This function finds the element with the ID "showOption_content" and toggles
 * the "d_none" class on it, which controls the display property.
 */
function showEditandDeleteBtn() {
  let showOption = document.getElementById("showOption_content");
  showOption.classList.toggle("d_none");
}

function protection(event) {
  event.stopPropagation();
}
