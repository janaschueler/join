const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allUsers = [];
let selectedContactId = null;

/**
 * Initializes the application by checking access authorization and fetching necessary data.
 * If the user is authorized, it renders various components of the contacts page.
 * If the user is not authorized, it redirects to the login page.
 *
 * @async
 * @function init
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
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

async function fetchData(path = "") {
  try {
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
  } catch (error) {
    console.error("Error loading:", error);
    return null;
  }
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

async function addContact() {
  let contactsSmallRef = document.getElementById("contactsSmall_content");
  let nameRef = document.getElementById("recipient-name");
  let emailRef = document.getElementById("recipient-email");
  let phoneRef = document.getElementById("recipient-phone");
  let contactId = Date.now().toString();
  let newContact = {
    id: contactId,
    name: nameRef.value,
    email: emailRef.value,
    phone: phoneRef.value,
    color: getColorById(contactId),
  };
  if (nameRef.value == "" || emailRef.value == "" || phoneRef.value == "") {
    document.getElementById("editContactInputfieldError").classList.remove("d_none");
    document.getElementById("newContactInputfieldError").classList.remove("d_none");
    return;
  }
  document.getElementById("editContactInputfieldError").classList.add("d_none");
  document.getElementById("newContactInputfieldError").classList.add("d_none");
  await postData("contacts", newContact);
  allUsers.push(newContact);
  selectedContactId = newContact.id;
  renderSmallContacts();
  renderBigContacts();
  contactsSmallRef.innerHTML = "";
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
  signupSuccessfullMessage("new");
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

/**
 * Displays a success message toast notification and reloads the page after the toast is hidden.
 *
 * @param {string} status - The status of the signup process. If the status is "edit", the message will indicate that the contact was successfully edited.
 */
function signupSuccessfullMessage(status) {
  let toastRef = document.getElementById("successMessage");
  if (status == "edit") {
    let messageRef = document.getElementById("toastMessage");
    messageRef.textContent = "Contact successfully edited";
  }
  let overlay = document.getElementById("overlay");
  let toast = new bootstrap.Toast(toastRef, {
    autohide: false,
  });
  overlay.style.display = "block";
  toast.show();
  setTimeout(function () {
    toast.hide();
  }, 2000);
  toastRef.addEventListener("hidden.bs.toast", function () {
    overlay.style.display = "none";
    location.reload();
  });
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
