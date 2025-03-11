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

/**
 * Fetches user data from a specified path and returns an array of user objects.
 *
 * @param {string} [path=""] - The path to the user data file (excluding the base URL and file extension).
 * @returns {Promise<Array<{contactName: string}>>} A promise that resolves to an array of user objects, each containing a `contactName` property.
 */

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

/**
 * Adds a new contact to the list of all contacts.
 *
 * This function retrieves the new contact's name, email, and password from
 * the `constDefinitionAddContact` function. It then generates an abbreviation
 * and a color for the new contact. The new contact's details are added to the
 * respective arrays in the `allContacts` object. Finally, the updated contact
 * list is saved to storage.
 *
 * @function addContact
 * @returns {void}
 */
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
  return abbreviation.toUpperCase();
}

function determineColor() {
  let numberOfUsers = allUsersName.length;
  let userColor = coloursArray[numberOfUsers % coloursArray.length];
  return userColor;
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
    console.error("Error posting:", error);
  }
}

document.querySelector(".formInputContainer").addEventListener("submit", function (event) {
  event.preventDefault();
});

/**
 * Adds event listeners to input fields and a checkbox to manage the sign-up button state.
 *
 * This code listens for changes in the name, email, and password input fields as well as
 * the checkbox state. When an input event is detected, it triggers the activateSignUpButton function
 * to determine whether the sign-up button should be enabled or disabled.
 *
 * The checkbox event listener also toggles the "checked" class on the checkbox element,
 * updating its visual state and triggering the activateSignUpButton function.
 *
 * @function addSignUpFormEventListeners
 * @returns {void}
 */
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

function activateSignUpButton() {
  const name = document.getElementById("inputNameSignin").value;
  const email = validateEmailSignUp();
  const password1 = document.getElementById("inputPassword1Signin").value;
  const password2 = document.getElementById("inputPassword2Signin").value;
  const signUpButton = document.getElementById("submitSignup");
  const passwordMismatchMessage = document.getElementById("nonMatchingPassword");
  const allFieldsFilled = name && email && password1 && password2 && isCheckboxValid();
  signUpButton.disabled = !allFieldsFilled || password1 !== password2;
  passwordMismatchMessage.classList.toggle("d-none", password1 === password2);
  document.getElementById("inputPassword2Signin").style.border = password1 === password2 ? "" : "1px solid red";
}

function isCheckboxValid() {
  const checkbox = document.getElementById("flexCheckDefault");
  return checkbox.checked || checkbox.classList.contains("checked");
}

function validateEmailSignUp() {
  const email = document.getElementById("inputEmailSignin").value;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailPattern.test(email);

  if (!isValidEmail) {
    document.querySelectorAll("[id*='invalidPassword']").forEach((element) => {
      element.classList.remove("d_none");
    });
    return isValidEmail;
  } else {
    document.querySelectorAll("[id*='invalidPassword']").forEach((element) => {
      element.classList.add("d_none");
    });
    return isValidEmail;
  }
}

/**
 * Displays a success message using a Bootstrap toast notification.
 *
 * This function shows a toast notification with a success message and an overlay.
 * The toast is displayed for 2 seconds before being hidden. Once the toast is hidden,
 * the overlay is also hidden.
 *
 * @function signupSuccessfullMessage
 */
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
