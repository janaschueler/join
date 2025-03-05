const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allUsers = [];
let selectedContactId = null;

function init() {
  fetchData();
  renderTopBar();
  renderSmallContacts();
  renderBigContacts();
}

function getColorById(contactId) {
  let sum = 0;
  for (let i = 0; i < contactId.length; i++) {
    sum += contactId.charCodeAt(i);
  }
  let index = sum % coloursArray.length;
  return coloursArray[index];
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
    console.error("Fehler beim Laden der Daten:", error);
  }
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
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

async function openEditDialog(contactId) {
  selectedContactId = contactId;
  let closeOverflow = document.getElementById("body");
  let showDialog = document.getElementById("dialog_content");
  let nameRef = document.getElementById("dialog-name");
  let emailRef = document.getElementById("dialog-email");
  let phoneRef = document.getElementById("dialog-phone");
  showDialog.classList.remove("d_none");
  closeOverflow.classList.toggle("o_none");
  let firebaseId = await getFirebaseId(contactId);
  let contactData = await fetchData(`contacts/${firebaseId}`);
  nameRef.value = contactData.name || "";
  emailRef.value = contactData.email || "";
  phoneRef.value = contactData.phone || "";
}

async function saveEditedContact() {
  let closDialog = document.getElementById("dialog_content");
  let nameRef = document.getElementById("dialog-name");
  let emailRef = document.getElementById("dialog-email");
  let phoneRef = document.getElementById("dialog-phone");
  let firebaseId = await getFirebaseId(selectedContactId);
  let updatedData = {
    id: selectedContactId,
    name: nameRef.value,
    email: emailRef.value,
    phone: phoneRef.value,
    color: getColorById(selectedContactId),
  };
  await patchData(`contacts/${firebaseId}`, updatedData);
  closDialog.classList.add("d_none");
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
  signupSuccessfullMessage("edit");
}

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
    return;
  }
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

async function deleteContact(contactId) {
  if (!contactId) {
    contactId = selectedContactId;
  }
  let contactsSmallRef = document.getElementById("contactsSmall_content");
  let firebaseId = await getFirebaseId(contactId);
  if (!firebaseId) return;
  await deleteData(`contacts/${firebaseId}`);
  await removeContactFromTasks(firebaseId);
  allUsers = allUsers.filter((contact) => contact.id !== contactId);
  contactsSmallRef.innerHTML = "";
  renderSmallContacts();
  renderBigContacts();
  if (window.matchMedia("(max-width: 768px)").matches) location.reload();
}

function selectContact(contactId) {
  selectedContactId = contactId;
  renderBigContacts();
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

function cancelAndCross() {
  let showDialog = document.getElementById("dialog_content");
  showDialog.classList.toggle("d_none");
  location.reload();
}

function closeContactInfo() {
  let showDialog = document.getElementById("contactInfo_content");
  showDialog.classList.add("d_none_mobile");
}

function mobileContactInfo() {
  let contactInfo = document.getElementById("contactInfo_content");
  if (window.matchMedia("(max-width: 768px)").matches) {
    contactInfo.classList.remove("d_none_mobile");
  }
}

function showEditandDeleteBtn() {
  let showOption = document.getElementById("showOption_content");
  showOption.classList.toggle("d_none");
}

function protection(event) {
  event.stopPropagation();
}
