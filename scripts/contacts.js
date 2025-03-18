const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allUsers = [];
let selectedContactId = null;

/**
 * Initializes the application by checking user authorization and fetching necessary data.
 *
 * This asynchronous function verifies the user's access authorization using `checkAccessAuthorization()`.
 * If authorized, it fetches required data and updates the UI by rendering the top bar,
 * small and big contact lists, and the modal contacts.
 * If the user is not authorized, they are redirected to the login page.
 *
 * @async
 * @function init
 * @returns {Promise<void>} A promise that resolves when all initialization steps are complete.
 */
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

/**
 * Fetches data from the specified path and updates the user list.
 *
 * This asynchronous function retrieves data from the given API endpoint,
 * extracts the `contacts` property if available, and updates the `allUsers` array.
 * After fetching, it updates the UI by rendering small and big contact lists.
 *
 * @async
 * @function fetchData
 * @param {string} [path=""] - The API endpoint path to fetch data from.
 * @returns {Promise<Object>} A promise that resolves to the fetched data object.
 */
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

/**
 * Renders the small contacts section by sorting the list of users alphabetically,
 * grouping them by their first letter, and updating the HTML content of the
 * "contactsSmall_content" element with the generated grouped contacts HTML.
 *
 * @function
 * @returns {void}
 */
function renderSmallContacts() {
  let contactsSmallRef = document.getElementById("contactsSmall_content");
  contactsSmallRef.innerHTML = "";
  let sortedContacts = sortContactsByName(allUsers);
  let groupedContactsHTML = generateGroupedContactsHTML(sortedContacts);
  contactsSmallRef.innerHTML = groupedContactsHTML;
}

/**
 * Sorts an array of contact objects alphabetically by the first name.
 *
 * @param {Array<Object>} contacts - An array of contact objects to be sorted.
 * Each object should have a `name` property containing the full name as a string.
 *
 * @returns {Array<Object>} A new array of contact objects sorted by the first name in ascending order.
 */
function sortContactsByName(contacts) {
  return contacts.slice().sort((a, b) => {
    let nameA = a.name.trim().split(" ")[0].toUpperCase();
    let nameB = b.name.trim().split(" ")[0].toUpperCase();
    return nameA.localeCompare(nameB);
  });
}

/**
 * Generates HTML for a grouped contact list.
 *
 * This function takes an array of contacts, groups them alphabetically by the first letter
 * of their first name, and returns an HTML string with group headers and contact elements.
 *
 * @function generateGroupedContactsHTML
 * @param {Array<Object>} contacts - An array of contact objects with a `name` property.
 * @returns {string} The generated HTML string containing grouped contacts.
 */
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

/**
 * Generates an HTML string for a group header with a specified letter.
 *
 * @param {string} letter - The letter to be displayed in the group header.
 * @returns {string} An HTML string containing a styled group header with the given letter.
 */
function createGroupHeader(letter) {
  return `
    <div class="category"><span><b>${letter}</b></span></div>
    <div class="horizontalLine"></div>
  `;
}

/**
 * Renders the detailed view of a selected contact in the "contactsBig_content" element.
 *
 * This function retrieves the ID of the selected contact from localStorage, finds the corresponding
 * contact in the `allUsers` array, and updates the "contactsBig_content" element with the contact's
 * detailed information using the `templateBigContacts` function. If no contact is selected or the
 * contact is not found, the content is cleared.
 *
 * @function renderBigContacts
 * @returns {void} This function does not return a value.
 */
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

/**
 * Renders the contact details in the modal.
 *
 * This function clears the modal content and, if a contact is selected,
 * retrieves the contact data and updates the modal with the contact's details.
 *
 * @function renderModalContacts
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

/**
 * Populates the dialog fields with contact information.
 *
 * This function retrieves the contact details from the database using the provided `contactId`,
 * then updates the corresponding input fields in the dialog.
 *
 * @async
 * @function populateDialogFields
 * @param {string} contactId - The ID of the contact whose data should be loaded.
 * @returns {Promise<void>} A promise that resolves once the fields have been populated.
 */
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

/**
 * Fetches contact data from the database.
 *
 * This function sends a request to retrieve contact information from the given path
 * and updates the global `allUsers` array with the retrieved contacts.
 *
 * @async
 * @function fetchContactData
 * @param {string} [path=""] - The API endpoint path to fetch contact data from.
 * @returns {Promise<Object>} A promise that resolves to the fetched data.
 */
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

/**
 * Deletes a contact from the database and updates the UI.
 *
 * This function retrieves the Firebase ID of the given contact, deletes the contact
 * from the database, removes their association from tasks, and updates the contact lists.
 *
 * @async
 * @function deleteContact
 * @param {string} contactId - The ID of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves when the contact is deleted and the UI is updated.
 */
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

/**
 * Retrieves the Firebase ID for a given contact.
 *
 * This function fetches all contacts from the database and searches for the Firebase ID
 * that corresponds to the given contact ID.
 *
 * @async
 * @function getFirebaseId
 * @param {string} contactId - The ID of the contact to find in Firebase.
 * @returns {Promise<string|null>} A promise that resolves to the Firebase ID if found, otherwise `null`.
 */
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

/**
 * Saves the edited contact details.
 *
 * This function retrieves the updated contact data, fetches the corresponding Firebase ID,
 * updates the contact in the database, and then closes the dialog. After saving, it resets
 * the dialog fields and displays a success message.
 *
 * @async
 * @function saveEditedContact
 * @returns {Promise<void>} A promise that resolves when the contact is successfully updated.
 */
async function saveEditedContact() {
  let closDialog = document.getElementById("dialog_content");
  let updatedData = await getUpdatedContactData();
  let firebaseId = await getFirebaseId(selectedContactId);
  await patchData(`contacts/${firebaseId}`, updatedData);
  closDialog.classList.add("d_none");
  resetDialogFields();
  signupSuccessfullMessage("edit");
}

/**
 * Retrieves the updated contact data from the dialog fields.
 *
 * This function collects the user's edited contact information from the input fields,
 * including name, email, phone number, and assigns the appropriate color based on the contact ID.
 *
 * @async
 * @function getUpdatedContactData
 * @returns {Promise<Object>} A promise that resolves to an object containing the updated contact details.
 */

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

/**
 * Resets the input fields in a dialog form to their default empty values.
 * This function clears the values of the name, email, and phone input fields
 * within a dialog by setting them to an empty string.
 *
 * @function
 */
function resetDialogFields() {
  document.getElementById("dialog-name").value = "";
  document.getElementById("dialog-email").value = "";
  document.getElementById("dialog-phone").value = "";
}

/**
 * Deletes data from the specified path in the database.
 *
 * This function sends a DELETE request to the given path in the database and returns the response data.
 * It is commonly used for removing records, such as deleting a contact or task.
 *
 * @async
 * @function deleteData
 * @param {string} [path=""] The path to the data that needs to be deleted (e.g., "contacts/{id}").
 * @returns {Promise<Object>} A promise that resolves to the response JSON after the deletion operation.
 */

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