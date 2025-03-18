const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allUser = { contactEmail: [], contactPassword: [], contactId: [], contactName: [], contactAbbreviation: [] };

function init() {
  showLoadingMessage();
}

/**
 * Displays a loading message based on the current window width.
 *
 * If the window width is greater than 480 pixels, it shows the desktop loading message
 * and content. Otherwise, it shows the mobile loading message, switches the mobile logo,
 * and displays the mobile content.
 */
function showLoadingMessage() {
  if (window.innerWidth > 480) {
    showDesktopLoadingMessage();
    showDesktopContent();
  } else {
    showMobileLoadingMessage();
    switchMobileLogo();
    showMobileContent();
  }
}

/**
 * Displays a loading message on the desktop with a series of timed animations.
 *
 * This function manipulates the styles of an HTML element with the ID "loadingMessage"
 * to create a loading animation. It performs the following steps:
 * 1. Adds a "show" class to the element after 100ms.
 * 2. Updates the element's display, size, position, and transformation styles after 1000ms.
 * 3. Resets the position style of the element after 2000ms.
 *
 * Note: Ensure that an element with the ID "loadingMessage" exists in the DOM
 * before calling this function.
 */
function showDesktopLoadingMessage() {
  const loadingMessage = document.getElementById("loadingMessage");
  setTimeout(() => {
    loadingMessage.classList.add("show");
  }, 100);
  setTimeout(() => {
    loadingMessage.style.display = "flex";
    loadingMessage.style.width = "100px";
    loadingMessage.style.height = "50px";
    loadingMessage.style.transform = "scale(0.375) translate(100px, -150px)";
    loadingMessage.style.top = "133px";
    loadingMessage.style.left = "68px";
  }, 1000);
  setTimeout(() => {
    loadingMessage.style.position = "none";
  }, 2000);
}

/**
 * Displays the desktop content by making the login container, footer, and header visible.
 * Adds a "show" class to these elements for potential animations or styling.
 * The visibility changes occur after a delay of 1.5 seconds.
 *
 * @function
 * @returns {void}
 */
function showDesktopContent() {
  const loginContainer = document.getElementById("loginContainer");
  const footer = document.getElementById("footer");
  const header = document.getElementById("header");
  setTimeout(() => {
    loginContainer.style.display = "flex";
    footer.style.display = "block";
    header.style.display = "flex";
    loginContainer.classList.add("show");
    footer.classList.add("show");
    header.classList.add("show");
  }, 1500);
}

/**
 * Displays a loading message on mobile devices with an animated transition.
 *
 * This function selects an HTML element with the ID "loadingMessageMobile" and applies
 * a series of style changes to create a loading animation. The animation consists of
 * two stages:
 *
 * 1. Immediately adds a "show" class to the element to make it visible.
 * 2. After a delay of 1 second, adjusts the element's size, position, and transform properties
 *    to create a scaling and translating effect.
 *
 * Note: Ensure that an element with the ID "loadingMessageMobile" exists in the DOM
 * before calling this function to avoid runtime errors.
 */
function showMobileLoadingMessage() {
  const loadingMessageMobile = document.getElementById("loadingMessageMobile");
  setTimeout(() => {
    document.getElementById("loadingMessageMobile").classList.add("show");
  }, 0);
  setTimeout(() => {
    loadingMessageMobile.style.width = "200px";
    loadingMessageMobile.style.height = "50px";
    loadingMessageMobile.style.transform = "scale(0.375) translate(100px, -150px)";
    loadingMessageMobile.style.top = "64px";
    loadingMessageMobile.style.left = "-80px";
  }, 1000);
}

/**
 * Switches the visibility of two mobile logo elements after a delay.
 * The function hides the element with the ID "mobileLogoChange" and displays
 * the element with the ID "mobileLogoChangeDark" after a 1.5-second timeout.
 * It also ensures the displayed element is fully visible by setting its
 * opacity and visibility styles.
 */
function switchMobileLogo() {
  const mobileLogoChange = document.getElementById("mobileLogoChange");
  const mobileLogoChangeDark = document.getElementById("mobileLogoChangeDark");
  setTimeout(() => {
    mobileLogoChange.style.display = "none";
    mobileLogoChangeDark.style.display = "block";
    mobileLogoChangeDark.style.opacity = "1";
    mobileLogoChangeDark.style.visibility = "visible";
  }, 1500);
}

/**
 * Displays the mobile content by modifying the styles and classes of specific elements
 * after a delay of 1.5 seconds. This function is intended to adjust the layout for
 * mobile views by showing the login container, mobile navigation, and footer.
 *
 * The following changes are made:
 * - Sets the body's background color to "rgb(246, 247, 248)" with high priority.
 * - Displays the login container and mobile navigation as flex elements.
 * - Adds the "show" class to the login container, mobile navigation, and footer.
 *
 * Elements involved:
 * - `loginContainer`: The container for the login section.
 * - `mobileNav`: The navigation bar for mobile devices.
 * - `footer`: The footer section of the page.
 *
 * Note: Ensure the elements with IDs `loginContainer`, `mobileNav`, and `footer`
 * exist in the DOM before calling this function to avoid runtime errors.
 */
function showMobileContent() {
  const loginContainer = document.getElementById("loginContainer");
  const mobileNav = document.getElementById("mobileNav");
  const footer = document.getElementById("footer");
  setTimeout(() => {
    document.body.style.setProperty("background", "rgb(246, 247, 248)", "important");
    loginContainer.style.display = "flex";
    mobileNav.style.display = "flex";
    loginContainer.classList.add("show");
    mobileNav.classList.add("show");
    footer.classList.add("show");
  }, 1500);
}

/**
 * Hides the loading background element by gradually reducing its opacity to 0
 * and then setting its display property to "none" after a delay.
 *
 * This function assumes there is an element with the ID "loadingBackground"
 * in the DOM. It first sets the opacity of the element to "0" to create a fade-out
 * effect, and then uses a timeout to hide the element completely after 1 second.
 */
function hideLoadingBackground() {
  const loadingBackground = document.getElementById("loadingBackground");
  loadingBackground.style.opacity = "0";
  setTimeout(() => {
    loadingBackground.style.display = "none";
  }, 1000);
}

/**
 * Initializes the login check process by fetching user data and verifying login status.
 *
 * This function asynchronously retrieves all user data using the `getData` function,
 * and then calls `checkLogin` to verify the login status of the user.
 *
 * @async
 * @function initializeCheck
 * @returns {Promise<void>} A promise that resolves when the initialization and login check are complete.
 */

document.querySelector("#logInBtn").addEventListener("click", function (event) {
  event.preventDefault();
  initializeCheck();
});

async function initializeCheck() {
  allUser = await getData();
  checkLogin();
}

/**
 * Retrieves data from the server for a specific path and processes the response.
 *
 * This function asynchronously fetches data from the server using the provided `path`,
 * processes the JSON response, and extracts the user data. In case of an error,
 * it logs the error to the console and returns an empty array.
 *
 * @async
 * @function getData
 * @param {string} [path=""] - The optional path appended to the base URL for the specific request. Default is an empty string.
 * @returns {Promise<Array>} A promise that resolves to an array containing the processed user data. In case of an error, it resolves to an empty array.
 */
async function getData(path = "") {
  try {
    const response = await fetch(`${BASE_URL}signup/user/${path}.json`);
    if (!response.ok) {
      throw new Error("Network error: " + response.statusText);
    }
    return extractUserData(await response.json());
  } catch (error) {
    console.error("Error retrieving the data:", error);
    return [];
  }
}

/**
 * Extracts and processes user data from the given JSON response.
 *
 * This function takes a JSON object and extracts specific user-related fields
 * (such as contact email, password, name, and abbreviation) from it,
 * returning an array of user objects containing the extracted information.
 *
 * @function extractUserData
 * @param {Object} responseToJson - The JSON response object containing user data.
 * @returns {Array} An array of objects, each representing a user with properties
 *                  `contactEmail`, `contactPassword`, `contactId`, `contactName`, and `contactAbbreviation`.
 */
function extractUserData(responseToJson) {
  return Object.entries(responseToJson || {}).map(([key, user]) => ({
    contactEmail: user.contactEmail,
    contactPassword: user.contactPassword,
    contactId: key,
    contactName: user.contactName,
    contactAbbreviation: user.contactAbbreviation,
  }));
}

/**
 * Asynchronously checks the login credentials entered by the user.
 * Disables the login button while validating the email and password.
 * If the email is invalid, re-enables the login button and exits.
 * If the email and password match a user in the `allUser` array,
 * calls `handleLoginResult` with the user and the login button.
 *
 * @async
 * @function checkLogin
 * @returns {Promise<void>} A promise that resolves when the login check is complete.
 */
async function checkLogin() {
  const disabledBtn = document.getElementById("logInBtn");
  disabledBtn.disabled = true;

  if (!validateEmailLogin()) {
    disabledBtn.disabled = false;
    return;
  }
  const loginEmail = document.getElementById("inputEmail").value.trim().toLowerCase();
  const loginPassword = document.getElementById("inputPassword1").value;
  const user = allUser.find((u) => u?.contactEmail?.[0]?.toLowerCase() === loginEmail && u?.contactPassword?.[0] === loginPassword);
  await handleLoginResult(user, disabledBtn);
}

/**
 * Handles the result of a login attempt by processing the user data and updating the UI accordingly.
 *
 * @async
 * @function handleLoginResult
 * @param {Object|null} user - The user object returned from the login attempt. If null, the login failed.
 * @param {HTMLButtonElement} disabledBtn - The button element that was disabled during the login process.
 * @returns {Promise<void>} Resolves when the login handling is complete.
 *
 * @description
 * If the login is successful (user is not null), the function transfers the login data, attempts to add a contact,
 * and redirects the user to the index page if successful. If the login fails (user is null), it displays an error
 * message, highlights the password field with a red border, and focuses on the password input field.
 * The disabled button is re-enabled at the end of the process.
 */
async function handleLoginResult(user, disabledBtn) {
  if (user) {
    transfereLoginData(user);
    let addContact = await addContactLogIn();
    if (addContact) {
      window.location.assign("./index.html");
    }
  } else {
    document.getElementById("wrongPassword").classList.remove("d-none");
    const passwordField = document.getElementById("inputPassword1");
    passwordField.style.border = "1px solid red";
    passwordField.focus();
  }
  disabledBtn.disabled = false;
}

/**
 * Validates the email input from a login form and toggles the visibility of 
 * elements with IDs containing 'invalidPassword' based on the validation result.
 *
 * @returns {boolean} - Returns `true` if the email input is valid, otherwise `false`.
 *
 * The function performs the following steps:
 * 1. Retrieves the value of the input field with the ID "inputEmail".
 * 2. Validates the input against a regular expression pattern for email addresses.
 * 3. If the email is invalid, removes the "d_none" class from elements with IDs containing "invalidPassword".
 * 4. If the email is valid, adds the "d_none" class to those elements.
 */
function validateEmailLogin() {
  let input = document.getElementById("inputEmail").value;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailPattern.test(input);
  if (!isValidEmail) {
    document.querySelectorAll("[id*='invalidPassword']").forEach((element) => {
      element.classList.remove("d_none");
    });
  } else {
    document.querySelectorAll("[id*='invalidPassword']").forEach((element) => {
      element.classList.add("d_none");
    });
  }
  return isValidEmail;
}

/**
 * Adjusts the position of loading messages based on the window's width.
 *
 * This function checks the current width of the window and adjusts the
 * CSS position property of elements with IDs "loadingMessageMobile" and
 * "loadingMessage". If the window's width is 480 pixels or less,
 * "loadingMessageMobile" is set to "fixed" and "loadingMessage" to "relative".
 * If the window's width is greater than 480 pixels, "loadingMessageMobile"
 * is set to "relative" and "loadingMessage" to "fixed".
 */

window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);

function handleResize() {
  const loadingMessageMobile = document.getElementById("loadingMessageMobile");
  const loadingMessage = document.getElementById("loadingMessage");
  if (window.innerWidth <= 480) {
    if (loadingMessageMobile) {
      loadingMessageMobile.style.position = "fixed";
      loadingMessage.style.position = "relative";
    }
  } else if (window.innerWidth > 480) {
    if (loadingMessageMobile) {
      loadingMessageMobile.style.position = "relative";
      loadingMessage.style.position = "fiexed";
    }
  }
}
