const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allUsers = [];
let selectedContactId = null;

function init() {
    fetchData();
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
    return responseToJson = await response.json();
}

async function deleteData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}

async function patchData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await response.json();
}

// async function editContact() {
//     let nameRef = document.getElementById('recipient-name');
//     let emailRef = document.getElementById('recipient-email');
//     let phoneRef = document.getElementById('recipient-phone');
//     let contactId = selectedContactId;
//     let updatedData= {        
//         id: contactId,
//         name: nameRef.value,
//         email: emailRef.value,
//         phone: phoneRef.value, 
//         color: getColorById(contactId),    
//     }; 
//     if (nameRef.value == "" || emailRef.value == "" || phoneRef.value == "") {
//         return
//     }
//     await patchData(`contacts/${contactId}`, updatedData);   
//     let userContact = allUsers.find(user => user.id === contactId);
//     if (userContact) {
//         Object.assign(userContact, updatedData);
//     }     
//     renderSmallContacts();
//     renderBigContacts();
//     nameRef.value = "";
//     emailRef.value = "";
//     phoneRef.value = "";
//     signupSuccessfullMessage();
// }

async function getFirebaseId(contactId) {
    let response = await fetch(BASE_URL + "contacts.json");
    let data = await response.json();
    for (let firebaseId in data) {
        if (data[firebaseId].id === contactId) {
            return firebaseId;
        }
    }
    return null;
}

async function deleteContact(contactId) {
    let firebaseId = await getFirebaseId(contactId);
    if (selectedContactId === contactId) {
        selectedContactId = null;
    }
    await deleteData(`contacts/${firebaseId}`);
    allUsers = allUsers.filter(contact => contact.id !== contactId);
    renderSmallContacts();
    renderBigContacts();
}

async function addContact() {
    let nameRef = document.getElementById('recipient-name');
    let emailRef = document.getElementById('recipient-email');
    let phoneRef = document.getElementById('recipient-phone'); 
    let contactId = Date.now().toString();  
    let newContact = {        
        id: contactId,
        name: nameRef.value,
        email: emailRef.value,
        phone: phoneRef.value, 
        color: getColorById(contactId),    
    };
    if (nameRef.value == "" || emailRef.value == "" || phoneRef.value == "") {
        return
    }    
    await postData("contacts", newContact);    
    allUsers.push(newContact);
    selectedContactId = newContact.id;
    renderSmallContacts();
    renderBigContacts();
    nameRef.value = "";
    emailRef.value = "";
    phoneRef.value = "";
    signupSuccessfullMessage();
}

function selectContact(contactId) {
    selectedContactId = contactId;
    renderBigContacts();
}

function renderSmallContacts() {
    allUsers.sort((a, b) => {
        let nameA = a.name.trim().split(" ")[0].toUpperCase();
        let nameB = b.name.trim().split(" ")[0].toUpperCase();
        return nameA.localeCompare(nameB);
    });
    let contactsSmallRef = document.getElementById('contactsSmall_content');
    contactsSmallRef.innerHTML = "";
    let currentGroup = "";
    allUsers.forEach(contact => {
        let firstLetter = contact.name.trim().split(" ")[0].charAt(0).toUpperCase();
        if (firstLetter !== currentGroup) {
            currentGroup = firstLetter;
            contactsSmallRef.innerHTML += `<div class="category"><span>${firstLetter}</span></div>`;
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

function signupSuccessfullMessage() {
    let toastRef = document.getElementById("successMessage");
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
