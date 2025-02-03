const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allUsers = [];
let selectedContactId = null;

function init() {
    fetchData();
    renderSmallContacts();
    renderBigContacts();
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
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

async function deleteData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}

async function deleteContact(contactId) {    
    let deleteArr = allUsers.filter(contact => contact.id === contactId); 
    selectedContactId === contactId
    await deleteData("contacts", deleteArr);     
    renderSmallContacts();
    renderBigContacts();   
}

async function addContact() {
    let nameRef = document.getElementById('recipient-name');
    let emailRef = document.getElementById('recipient-email');
    let phoneRef = document.getElementById('recipient-phone');
    let newContact = {
        id: Date.now().toString(),
        name: nameRef.value,
        email: emailRef.value,
        phone: phoneRef.value
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
}

function selectContact(contactId) {
    selectedContactId = contactId;
    renderBigContacts();
}

function renderSmallContacts() {
    allUsers.sort((a, b) => {
        let nameA = a.name.trim().split(" ")[0].toUpperCase();
        let nameB = b.name.trim().split(" ")[0].toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    let contactsSmallRef = document.getElementById('contactsSmall_content');
    contactsSmallRef.innerHTML = "";
    allUsers.forEach(contact => {
        contactsSmallRef.innerHTML += templateSmallContacts(contact);
    });
}

function renderBigContacts() {
    let contactsBigRef = document.getElementById('contactsBig_content');
    contactsBigRef.innerHTML = "";
    if (selectedContactId) {
        let selectedContact = allUsers.find(contact => contact.id === selectedContactId);
        if (selectedContact) {
            contactsBigRef.innerHTML = templateBigContacts(selectedContact);
        }
    }
}


