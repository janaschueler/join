const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

const allContacts = {
  contacKey: [],
  contactName: [],
  contactEmail: [],
  contactPassword: [],
  contactAbbreviation: [],
  contactColor: [],
};
let allUsersName = [];

function addContact() {
  const { newName, newEmail, newPassword } = constDefinitionAddContact();
  const newAbbreviation = generateAbbreviation(newName);
  const newColor = determineColor();
  allContacts.contactName.push(newName);
  allContacts.contactEmail.push(newEmail);
  allContacts.contactPassword.push(newPassword);
  allContacts.contactAbbreviation.push(newAbbreviation);
  allContacts.contactColor.push(newColor);
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

function generateAbbreviation(newName) {
  let abbreviation = newName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  console.log(abbreviation.toUpperCase());
  return abbreviation.toUpperCase();
}

function determineColor() {
  let numberOfUsers = allUsersName.length;
  let userColor = coloursArray[numberOfUsers % coloursArray.length];
  return userColor;
}

async function init() {
  allUsersName = await getData();
}

async function getData(path = "") {
  let response = await fetch(BASE_URL + "signup/" + "user/" + path + ".json");
  let responseToJson = await response.json();
  let users = [];
  for (let key in responseToJson) {
    let user = responseToJson[key];
    users.push({
      contactName: user.contactName,
    });
  }
  return users;
}

function saveToStorage() {
  const contactData = {
    contactName: allContacts.contactName,
    contactEmail: allContacts.contactEmail,
    contactPassword: allContacts.contactPassword,
    contactAbbreviation: allContacts.contactAbbreviation,
    contactColor: allContacts.contactColor,
  };
  postToDatabase("user", contactData);
}

async function postToDatabase(path = "", data = {}) {
  const url = BASE_URL + "signup/" + path + ".json";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      signupSuccessfullMessage();
      document.getElementById("signupForm").reset();
      window.location.assign("./login.html");
    }
  } catch (error) {
    console.error("Fehler beim Posten:", error);
  }
}

document.querySelector(".formInputContainer").addEventListener("submit", function (event) {
  event.preventDefault();
});

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
  });
}

function activateSignUpButton() {
  const name = document.getElementById("inputNameSignin").value;
  const email = document.getElementById("inputEmailSignin").value;
  const password1 = document.getElementById("inputPassword1Signin").value;
  const password2 = document.getElementById("inputPassword2Signin").value;
  const signUpButton = document.getElementById("submitSignup");
  const passwordMismatchMessage = document.getElementById("nonMatchingPassword");
  const checkbox = document.getElementById("flexCheckDefault");
  const isCheckboxChecked = checkbox.checked || checkbox.classList.contains("checked");

  if (name && email && password1 && password2 && isCheckboxChecked) {
    if (password1 === password2) {
      signUpButton.disabled = false;
      passwordMismatchMessage.classList.add("d-none");
    } else {
      signUpButton.disabled = true;
      passwordMismatchMessage.classList.remove("d-none");
      document.getElementById("inputPassword2Signin").style.border = "1px solid red";
    }
  } else {
    signUpButton.disabled = true;
    passwordMismatchMessage.classList.add("d-none");
  }
}

document.getElementById("inputNameSignin").addEventListener("input", activateSignUpButton);
document.getElementById("inputEmailSignin").addEventListener("input", activateSignUpButton);
document.getElementById("inputPassword1Signin").addEventListener("input", activateSignUpButton);
document.getElementById("inputPassword2Signin").addEventListener("input", activateSignUpButton);

document.getElementById("flexCheckDefault").addEventListener("change", function () {
  if (this.checked) {
    this.classList.add("checked");
  } else {
    this.classList.remove("checked");
  }
  activateSignUpButton();
});
