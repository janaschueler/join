const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allUser = { contactEmail: [], contactPassword: [], contactId: [], contactName: [], contactAbbreviation: [] };

function init() {
  showLoadingMessage();
}

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

async function getData(path = "") {
  try {
    let response = await fetch(BASE_URL + "signup/" + "user/" + path + ".json");
    if (!response.ok) {
      throw new Error("Netzwerkfehler: " + response.statusText);
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
    console.error("Fehler beim Abrufen der Daten:", error);
    return [];
  }
}

async function initializeCheck(check) {
  allUser = await getData();
  if (check) {
    checkLogin();
  }
}

document.querySelector("#LoginButton").addEventListener("click", function (event) {
  event.preventDefault();
  initializeCheck();
});

async function checkLogin() {
  let loginEmail = document.getElementById("inputEmail").value;
  let loginPassword = document.getElementById("inputPassword1").value;
  let user = allUser.find((user) => {
    return user?.contactEmail?.[0]?.toLowerCase()?.trim() === loginEmail.toLowerCase().trim() && user?.contactPassword?.[0] === loginPassword;
  });

  if (user) {
    transfereLoginData(user);
    await addContactLogIn();
    setTimeout(() => {
      window.location.assign("./index.html");
    }, 1000);
  } else {
    document.getElementById("wrongPassword").classList.remove("d-none");
    let passwordField = document.getElementById("inputPassword1");
    passwordField.style.border = "1px solid red";
    passwordField.focus();
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
