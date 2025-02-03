const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allUsers = [];

function init() {
    fetchData();
    renderSmallContacts();
    renderBigContacts();
}

async function fetchData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let data = await response.json();
    allUsers.push(data.contacts)
}

function addContact() {
    let nameRef = document.getElementById('recipient-name');
    let emailRef = document.getElementById('recipient-email');
    let PhoneRef = document.getElementById('recipient-phone');
    let nameNote = nameRef.value;
    let emailNote = emailRef.value;
    let phoneNote = PhoneRef.value;
    let contactId = {
        name: nameNote,
        email: emailNote,
        phone: phoneNote
    };
    postData("contacts", contactId);
}

function pushToContacts() {
    
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

function renderSmallContacts() {
    let contactsSmallRef = document.getElementById('contactsSmall_content');
    for (let i = 0; i < allUsers.length; i++) {
        const currentDatas = allUsers[i];
        contactsSmallRef.innerHTML += templateSmallContacts(currentDatas);
    }
}

function renderBigContacts() {
    let contactsBigRef = document.getElementById('contactsBig_content');
    for (let i = 0; i < allUsers.length; i++) {
        const currentDatas = allUsers[i];
        contactsBigRef.innerHTML += templateBigContacts(currentDatas);
    }
}
