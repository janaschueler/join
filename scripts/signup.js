const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app";

const allContacts = {
  contacKey: [],
  contactName: [],
  contactEmail: [],
  contactPassword: [],
};

function comparePassword(event) {
  const password1 = document.getElementById("inputPassword1Signin").value;
  const password2 = document.getElementById("inputPassword2Signin").value;
  if (password1 === password2) console.log("Passwörter stimmen überein!");
  else {
    console.log("Passwörter stimmen nicht überein!");
    alert("Die Passwörter stimmen nicht überein.");
    event.preventDefault();
  }
}

function addContact() {
  const { newName, newEmail, newPassword } = constDefinitionAddContact();
  allContacts.contactName.push(newName);
  allContacts.contactEmail.push(newEmail);
  allContacts.contactPassword.push(newPassword);
  saveToStorage();
}

function constDefinitionAddContact() {
  const newNameRef = document.getElementById("inputNameSignin");
  const newName = newNameRef.value;

  const newEmaiRef = document.getElementById("inputEmailSignin");
  const newEmail = newEmaiRef.value;

  const newPasswordRef = document.getElementById("inputPassword1Signin");
  const newPassword = newPasswordRef.value;

  return {
    newName: document.getElementById("inputNameSignin").value,
    newEmail: document.getElementById("inputEmailSignin").value,
    newPassword: document.getElementById("inputPassword1Signin").value,
  };
}

function saveToStorage() {
  allContacts.contactName.forEach((name) => {
    putToDatabase("contactName", name);
  });

  allContacts.contactEmail.forEach((email) => {
    putToDatabase("contactEmail", email);
  });

  allContacts.contactPassword.forEach((password) => {
    putToDatabase("contactpassword", password);
  });
}

async function putToDatabase(path = "", data = {}) {
  const url = BASE_URL + "signup/" + path + "/" + id + ".json";

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
