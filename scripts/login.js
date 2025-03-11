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

document.querySelector("#logInBtn").addEventListener("click", function (event) {
  event.preventDefault();
  initializeCheck();
});

async function initializeCheck() {
  allUser = await getData();
  checkLogin();
}

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

async function handleLoginResult(user, disabledBtn) {
  if (user) {
    transfereLoginData(user);
    if (await addContactLogIn()) {
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
