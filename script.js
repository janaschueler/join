function greet(name) {
  console("hallo" + name);
}

function showDesktopMenu() {
  let deskMenuRef = document.getElementById("deskMenu_content");
  deskMenuRef.classList.toggle("d_none");
}

/**
 * Asynchronously renders the top bar with the logged-in user's information.
 *
 * This function retrieves the signed-in user's data and updates the top bar
 * with the user's contact abbreviation. If the contact abbreviation is not
 * available, it defaults to "G".
 *
 * @async
 * @function renderTopBar
 * @returns {Promise<void>} A promise that resolves when the top bar has been updated.
 */
async function renderTopBar() {
  logedInUser = await getSigneInUserData();
  let topBarRef = document.getElementById("topbar_summary");
  let contactAbbreviation = logedInUser.contactAbbreviation.join("");
  if (!contactAbbreviation) {
    contactAbbreviation = "G";
  }
  topBarRef.innerHTML += templateTopBar(contactAbbreviation);
}

async function transfereLoginData(user) {
  postSignedInUserToDatabase(user);
  saveToLocalStorage(user);
}

/**
 * Logs in a guest user by creating a guest user object, posting it to the database,
 * saving it to local storage, and then redirecting to the index page.
 *
 * @async
 * @function guestLogIn
 * @returns {Promise<void>} A promise that resolves when the guest user has been logged in and the page has been redirected.
 */
async function guestLogIn(event) {
  event.preventDefault();
  let guest = {
    contactAbbreviation: ["G"],
    contactEmail: ["guest@mail.com"],
    contactId: "",
    contactName: ["Guest"],
    contactPassword: [""],
  };
  await postSignedInUserToDatabase(guest);
  saveToLocalStorage(guest);
  window.location.href = "./index.html";
}

/**
 * Logs out the current user by resetting user details and redirecting to the index page.
 *
 * This function creates a `logoutUser` object with empty or default values for user details,
 * sends this object to the database using `postSignedInUserToDatabase`, and then redirects
 * the user to the index page.
 *
 * @async
 * @function logOut
 * @returns {Promise<void>} A promise that resolves when the user has been logged out and redirected.
 */
async function logOut() {
  let logoutUser = {
    contactAbbreviation: [""],
    contactEmail: [""],
    contactId: "",
    contactName: [""],
    contactPassword: [""],
  };
  await postSignedInUserToDatabase(logoutUser);
  window.location.href = "./index.html";
}

/**
 * Sends the signed-in user data to the database.
 *
 * @async
 * @function postSignedInUserToDatabase
 * @param {Object} [data={}] - The user data to be posted.
 * @param {string} data.username - The username of the signed-in user.
 * @param {string} data.email - The email of the signed-in user.
 * @returns {Promise<void>} - A promise that resolves when the data has been posted.
 * @throws Will throw an error if the request fails.
 */
async function postSignedInUserToDatabase(data = {}) {
  const url = `${BASE_URL}signedIn/.json`;
  try {
    let response = await fetch(url, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return;
    } else {
    }
  } catch (error) {}
}

/**
 * Fetches the data of signed-in users from the server.
 *
 * This asynchronous function constructs a URL using the base URL and the endpoint for signed-in users.
 * It then performs a fetch request to retrieve the data in JSON format.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the data of signed-in users.
 * @throws {Error} If the fetch request fails or the response cannot be parsed as JSON.
 */
async function getSigneInUserData() {
  let url = BASE_URL + "signedIn/.json";
  let response = await fetch(url);
  let logedInUsers = await response.json();
  return logedInUsers;
}

async function getContacts() {
  let url = BASE_URL + "contacts/.json";
  let response = await fetch(url);
  let logedInUsers = await response.json();
  return logedInUsers;
}

function getColorById(contactId) {
  let sum = 0;
  for (let i = 0; i < contactId.length; i++) {
    sum += contactId.charCodeAt(i);
  }
  let index = sum % coloursArray.length;
  return coloursArray[index];
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

/**
 * Fetches the list of contacts from the server.
 *
 * This function sends an asynchronous request to the server to retrieve
 * the list of contacts in JSON format. It constructs the URL using the
 * base URL and the endpoint for contacts, then performs a fetch request.
 * The response is parsed as JSON and returned.
 * @async
 * @function getContacts
 * @returns {Promise<Object>} A promise that resolves to the list of contacts.
 */
async function addContactLogIn() {
  let signInUserData = await getSigneInUserData();
  if (!signInUserData || !signInUserData.contactName || !signInUserData.contactEmail) {
  }
  let contacts = await getContacts();
  let contactsArray = Object.values(contacts);
  let matchingContacts = contactsArray.filter((contact) => contact.email?.toLowerCase().includes(signInUserData.contactEmail[0].toLowerCase()));
  if (matchingContacts.length > 0) {
    return true;
  }
  let contactName = signInUserData.contactName[0];
  let contactEmail = signInUserData.contactEmail[0];
  let contactId = Date.now().toString();
  let newContact = {
    id: contactId,
    name: contactName,
    email: contactEmail,
    color: getColorById(contactId),
    phone: "",
  };
  await postData("contacts", newContact);
  selectedContactId = newContact.id;
  return true;
}

function saveToLocalStorage(user) {
  let userEmail = user.contactEmail[0];
  localStorage.setItem("user", JSON.stringify(userEmail));
}

/**
 * Asynchronously checks if the user has access authorization.
 *
 * This function retrieves the user's email from local storage and compares it
 * with the signed-in user's email fetched from the server. If the emails match,
 * the function returns true, indicating that the user is authorized. If the
 * emails do not match, the user is redirected to the login page and the function
 * returns false.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the user is
 * authorized, or false if the user is redirected to the login page.
 * Überprüft die Zugriffsberechtigung des Benutzers.
 *
 * Diese Funktion überprüft, ob die E-Mail-Adresse des Benutzers, die im lokalen Speicher gespeichert ist,
 * mit der E-Mail-Adresse des angemeldeten Benutzers übereinstimmt. Wenn die E-Mail-Adressen übereinstimmen,
 * wird die Funktion beendet. Andernfalls wird der Benutzer zur Anmeldeseite weitergeleitet.
 *
 * @async
 * @function checkAccessAuthorization
 * @returns {Promise<void>} Eine Promise, die aufgelöst wird, wenn die Überprüfung abgeschlossen ist.
 */
async function checkAccessAuthorization() {
  let userEmail = getFromLoclaStorage();
  let signedInUserRef = await getSigneInUserData();
  let signedInUser = signedInUserRef.contactEmail[0];
  if (userEmail == signedInUser) {
    return true;
    return true;
  } else {
    window.location.href = "login.html";
    return false;
    return false;
  }
}

function getFromLoclaStorage() {
  let user = JSON.parse(localStorage.getItem("user"));
  return user;
}

function validateText(event) {
  let input = event.target.value;
  if (!/^[a-zA-ZäöüÄÖÜß\s]*$/.test(input)) {
    event.target.value = input.replace(/[^a-zA-ZäöüÄÖÜß\s]/g, "");
  }
  checkFormValidity();
}

function validateNumber(event) {
  let input = event.target.value;
  if (!/^\d*$/.test(input)) {
    event.target.value = input.replace(/[^\d]/g, "");
  }
  checkFormValidity();
}

function validateNumber(event) {
  let input = event.target.value;
  if (!/^\d*$/.test(input)) {
    event.target.value = input.replace(/[^\d]/g, "");
  }
  checkFormValidity();
}

/**
 * Validates the email input field and updates the UI based on the validity of the email.
 *
 * This function checks if the email entered by the user matches a specific pattern.
 * If the email is invalid, it adds an "input-error" class to the input field and
 * removes the "d_none" class from elements with IDs containing 'invalidPassword'.
 * If the email is valid, it removes the "input-error" class from the input field and
 * adds the "d_none" class to elements with IDs containing 'invalidPassword'.
 *
 * @param {Event} event - The input event triggered by the user.
 */
function validateEmail(event) {
  let input = event.target.value;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailPattern.test(input);

  if (!isValidEmail) {
    event.target.classList.add("input-error");
    document.querySelectorAll("[id*='invalidPassword']").forEach((element) => {
      element.classList.remove("d_none");
    });
  } else {
    event.target.classList.remove("input-error");
    document.querySelectorAll("[id*='invalidPassword']").forEach((element) => {
      element.classList.add("d_none");
    });
  }
  checkFormValidity();
}

/**
 * Validates the input to ensure it contains only numbers and spaces.
 * If invalid characters are found, they are removed from the input.
 *
 * @param {Event} event - The input event triggered by the user.
 */
function validateNumber(event) {
  let input = event.target.value;
  if (!/^[0-9\s]*$/.test(input)) {
    event.target.value = input.replace(/[^0-9\s]/g, "");
  }
  checkFormValidity();
}

/**
 * Validates the forms specified by their IDs and enables or disables the submit button
 * based on the validity of the form inputs.
 *
 * The function checks the validity of the forms with the following IDs:
 * - "newContactContainer"
 * - "editContactContainer"
 * - "formInputContainer"
 * - "signupForm"
 *
 * For each form, it verifies that all input fields are filled. For email input fields,
 * it also checks if the value matches a basic email pattern.
 *
 * If all inputs in a form are valid, the submit button with the ID "newContact" inside
 * the form's ".buttonContainer" is enabled. Otherwise, the button is disabled.
 */
function checkFormValidity() {
  const forms = ["newContactContainer", "editContactContainer", "formInputContainer", "signupForm"];
  forms.forEach((formId) => {
    const form = document.getElementById(formId);
    if (!form) return;
    const inputs = form.querySelectorAll("input");
    const submitButton = form.querySelector(".buttonContainer button#newContact");
    const isFormValid = Array.from(inputs).every((input) => {
      if (input.type === "email") {
        return input.value && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.value);
      }
      return input.value.trim() !== "";
    });
    if (submitButton) {
      submitButton.disabled = !isFormValid;
    }
  });
}

/**
 * Handles the click event on navigation links for both desktop and mobile versions.
 * On click, the function prevents the default link navigation, saves the clicked link's text
 * to the localStorage, and redirects the user to the desired page.
 *
 * The function is invoked once the DOM is fully loaded to ensure all elements are accessible.
 *
 * @param {Event} event - The click event triggered by the user clicking on a navigation link.
 *
 * @returns {void} - The function does not return any value. It modifies the page behavior by setting the localStorage
 *                   and redirecting the browser to the href of the clicked link.
 */
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav_bar");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const clickedLink = event.currentTarget.querySelector(".nav_link").textContent;
      localStorage.setItem("lastClickedLink", clickedLink);
      window.location.href = event.currentTarget.href;
    });
  });
  const lastClickedLink = localStorage.getItem("lastClickedLink");
  if (lastClickedLink) {
    const lastLinkElement = [...navLinks].find((link) => link.querySelector(".nav_link").textContent === lastClickedLink);
    if (lastLinkElement) {
      lastLinkElement.classList.add("active");
    }
  }

  const navLinksMobile = document.querySelectorAll(".nav_bar_mobile");
  navLinksMobile.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const clickedLink = event.currentTarget.querySelector(".nav_link_mobile").textContent;
      localStorage.setItem("lastClickedLinkMobile", clickedLink);
      window.location.href = event.currentTarget.href;
    });
  });
  const lastClickedLinkMobile = localStorage.getItem("lastClickedLinkMobile");
  if (lastClickedLinkMobile) {
    const lastLinkElementMobile = [...navLinksMobile].find((link) => link.querySelector(".nav_link_mobile").textContent === lastClickedLinkMobile);
    if (lastLinkElementMobile) {
      lastLinkElementMobile.classList.add("active");
    }
  }
});
