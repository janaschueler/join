const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

const allContacts = {
  contacKey: [],
  contactName: [],
  contactEmail: [],
  contactPassword: [],
  contactAbbreviation: [],
  contactColor: [],
};

let allUsersName = [];

function comparePassword(event) {
  const password1 = document.getElementById("inputPassword1Signin").value;
  const password2 = document.getElementById("inputPassword2Signin").value;
  if (password1 === password2) addContact();
  else {
    document.getElementById("nonMatchingPassword").classList.remove("d-none");
    event.preventDefault();
    document.getElementById("inputPassword1Signin").value = "";
    document.getElementById("inputPassword2Signin").value = "";
  }
}

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
    } else {
      console.error("Fehler bei der Anfrage:", response.statusText);
    }
  } catch (error) {
    console.error("Fehler beim Posten:", error);
  }
}

document.querySelector(".formInputContainer").addEventListener("submit", function (event) {
  event.preventDefault();
  comparePassword(event);
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

// window.addEventListener("resize", function () {
//   if (window.innerWidth >= 480) {
//     location.reload();
//   }
// });
