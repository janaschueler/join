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

/**
 * Retrieves user data from the server by making an HTTP request.
 *
 * This asynchronous function fetches user data from a specified path on the server
 * and returns an array of user objects containing their names.
 *
 * @async
 * @function getData
 * @param {string} [path=""] - The path to the user data on the server. If no path is provided, it defaults to an empty string.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects, each containing the `contactName` property.
 */
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

/**
 * Collects user input values from the signup form fields and returns them as an object.
 *
 * @returns {Object} An object containing the user's name, email, and password.
 * @property {string} newName - The value entered in the "Name" input field.
 * @property {string} newEmail - The value entered in the "Email" input field.
 * @property {string} newPassword - The value entered in the "Password" input field.
 */
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

/**
 * Generates an abbreviation from a given name.
 * The abbreviation is created by taking the first letter of each word in the name,
 * combining them, and converting the result to uppercase.
 *
 * @param {string} newName - The full name or phrase to generate an abbreviation from.
 * @returns {string} The generated abbreviation in uppercase.
 */
function generateAbbreviation(newName) {
  let abbreviation = newName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  return abbreviation.toUpperCase();
}

/**
 * Determines a color for a user based on the number of existing users.
 *
 * This function calculates a color by taking the total number of users (`allUsersName.length`)
 * and using the modulo operator to cycle through the `coloursArray`. The resulting color
 * is returned, ensuring that each user is assigned a color in a consistent and repeatable manner.
 *
 * @returns {string} The determined color for the user.
 */
function determineColor() {
  let numberOfUsers = allUsersName.length;
  let userColor = coloursArray[numberOfUsers % coloursArray.length];
  return userColor;
}

/**
 * Saves contact data to the database by creating an object with the contact's details
 * and sending it to the specified database collection.
 *
 * @function saveToStorage
 * @description This function gathers contact information from the `allContacts` object,
 * formats it into a structured object, and posts it to the database under the "user" collection.
 *
 * @property {string} allContacts.contactName - The name of the contact.
 * @property {string} allContacts.contactEmail - The email address of the contact.
 * @property {string} allContacts.contactPassword - The password associated with the contact.
 * @property {string} allContacts.contactAbbreviation - The abbreviation for the contact's name.
 * @property {string} allContacts.contactColor - The color associated with the contact.
 */
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

/**
 * Sends a POST request to the specified database path with the provided data.
 * 
 * @async
 * @function postToDatabase
 * @param {string} [path=""] - The relative path to append to the base URL for the API endpoint.
 * @param {Object} [data={}] - The data to be sent in the body of the POST request.
 * @returns {Promise<void>} - Resolves when the request is successful and performs UI updates.
 * 
 * @throws {Error} - Logs an error to the console if the fetch request fails.
 * 
 * @description
 * This function constructs a URL using a base URL and the provided path, then sends a POST request
 * with the given data as JSON. If the request is successful, it displays a success message, resets
 * the signup form, and redirects the user to the login page. If an error occurs, it logs the error
 * to the console.
 */
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

/**
 * Prevents the default form submission behavior when the form is submitted.
 *
 * This function listens for the `submit` event on a form element and prevents
 * the default behavior, which is typically sending the form data to a server.
 * This is useful when you want to handle the form submission with custom logic,
 * such as form validation or sending the data via JavaScript (e.g., AJAX).
 *
 * @function
 * @returns {void} This function does not return a value.
 */
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

/**
 * Activates or deactivates the sign-up button based on form validation.
 * 
 * This function checks if all required fields (name, email, passwords, and checkbox) are filled
 * and valid. It also ensures that the two password fields match. If the passwords do not match,
 * it displays a mismatch message and highlights the second password field with a red border.
 * 
 * Dependencies:
 * - The function assumes the presence of specific DOM elements with the following IDs:
 *   - "inputNameSignin": Input field for the user's name.
 *   - "inputPassword1Signin": Input field for the first password.
 *   - "inputPassword2Signin": Input field for the second password.
 *   - "submitSignup": The sign-up button to be enabled or disabled.
 *   - "nonMatchingPassword": Element to display a password mismatch message.
 * - The function also relies on the `validateEmailSignUp` and `isCheckboxValid` helper functions
 *   to validate the email and checkbox, respectively.
 * 
 * Behavior:
 * - Disables the sign-up button if any required field is empty or invalid, or if the passwords do not match.
 * - Displays a password mismatch message and highlights the second password field if the passwords do not match.
 * - Hides the mismatch message and removes the highlight if the passwords match.
 */
function activateSignUpButton() {
  const name = document.getElementById("inputNameSignin").value;
  const password1 = document.getElementById("inputPassword1Signin").value;
  const password2 = document.getElementById("inputPassword2Signin").value;
  if (!name || !password1 || !password2) {
    return;
  }
  const email = validateEmailSignUp();
  const signUpButton = document.getElementById("submitSignup");
  const passwordMismatchMessage = document.getElementById("nonMatchingPassword");
  const allFieldsFilled = name && email && password1 && password2 && isCheckboxValid();
  signUpButton.disabled = !allFieldsFilled || password1 !== password2;
  passwordMismatchMessage.classList.toggle("d-none", password1 === password2);
  document.getElementById("inputPassword2Signin").style.border = password1 === password2 ? "" : "1px solid red";
}

/**
 * Validates the state of a checkbox element.
 *
 * This function checks if the checkbox with the ID "flexCheckDefault" is either
 * checked or has a CSS class "checked". It returns `true` if either condition
 * is met, otherwise it returns `false`.
 *
 * @returns {boolean} `true` if the checkbox is valid, otherwise `false`.
 */
function isCheckboxValid() {
  const checkbox = document.getElementById("flexCheckDefault");
  return checkbox.checked || checkbox.classList.contains("checked");
}

/**
 * Validates the email input for the sign-up form.
 * 
 * This function checks if the email entered in the input field with the ID "inputEmailSignin"
 * matches a standard email pattern. If the email is invalid, it removes the "d_none" class
 * from all elements with IDs containing "invalidPassword" to display error messages. If the
 * email is valid, it adds the "d_none" class to hide the error messages.
 * 
 * @returns {boolean} - Returns `true` if the email is valid, otherwise `false`.
 */
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
