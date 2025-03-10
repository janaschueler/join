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
async function initializeCheck() {
  allUser = await getData();
  checkLogin();
}

document.querySelector("#logInBtn").addEventListener("click", function (event) {
  event.preventDefault();
  initializeCheck();
});

/**
 * Fetches user data from a specified path and returns an array of user objects.
 *
 * @param {string} [path=""] - The path to the user data file (without the .json extension).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects.
 * Each user object contains the following properties:
 *   - contactEmail {string}: The email of the user.
 *   - contactPassword {string}: The password of the user.
 *   - contactId {string}: The unique identifier of the user.
 *   - contactName {string}: The name of the user.
 *   - contactAbbreviation {string}: The abbreviation of the user's name.
 *
 * @throws {Error} If there is a network error or the response is not ok.
 */
async function getData(path = "") {
  try {
    let response = await fetch(BASE_URL + "signup/" + "user/" + path + ".json");
    if (!response.ok) {
      throw new Error("Network error: " + response.statusText);
    }
    let responseToJson = await response.json();
    let users = [];
    for (let key in responseToJson) {
      let user = responseToJson[key];
      users.push({
        contactEmail: user.contactEmail,
        contactPassword: user.contactPassword,
        contactId: key,
        contactName: user.contactName,
        contactAbbreviation: user.contactAbbreviation,
      });
    }
    return users;
  } catch (error) {
    console.error("error retrieving the data:", error);
    return [];
  }
}

/**
 * Asynchronously checks the login credentials entered by the user.
 * Validates the email format and checks if the email and password match any user in the `allUser` array.
 * If the credentials are valid, transfers login data, adds a contact log, and redirects to the index page.
 * If the credentials are invalid, displays an error message and highlights the password field.
 *
 * @async
 * @function checkLogin
 * @returns {void}
 */
async function checkLogin() {
  let disabledBtn = document.getElementById("logInBtn");
  disabledBtn.disabled = true;
  let validEmail = validateEmailLogin();
  if (!validEmail) {
    disabledBtn.disabled = false;
    return;
  }
  let loginEmail = document.getElementById("inputEmail").value;
  let loginPassword = document.getElementById("inputPassword1").value;
  let user = allUser.find((user) => {
    return user?.contactEmail?.[0]?.toLowerCase()?.trim() === loginEmail.toLowerCase().trim() && user?.contactPassword?.[0] === loginPassword;
  });

  if (user) {
    transfereLoginData(user);
    let addedContact = await addContactLogIn();
    disabledBtn.disabled = false;
    if (addedContact == true) {
      window.location.assign("./index.html");
    }
  } else {
    document.getElementById("wrongPassword").classList.remove("d-none");
    let passwordField = document.getElementById("inputPassword1");
    passwordField.style.border = "1px solid red";
    passwordField.focus();
    disabledBtn.disabled = false;
  }
}

document.querySelector(".formInputContainer").addEventListener("click", function (event) {
  document.getElementById("wrongPassword").classList.add("d-none");
});

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

window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);

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
