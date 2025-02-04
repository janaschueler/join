const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allUser = { contactEmail: [], contactPassword: [] };

function init() {
  showLoadingMessage();
  // setTimeout(hideLoadingBackground, 3000); // Nach 3 Sekunden ausblenden
}

function showLoadingMessage() {
  const loadingMessageMobile = document.getElementById("loadingMessageMobile");
  const loadingMessage = document.getElementById("loadingMessage");
  const loginContainer = document.getElementById("loginContainer");
  const footer = document.getElementById("footer");
  const header = document.getElementById("header");
  const mobileNav = document.getElementById("mobileNav");
  const mobileLogoChange = document.getElementById("mobileLogoChange");
  const mobileLogoChangeDark = document.getElementById("mobileLogoChangeDark");

  if (window.innerWidth > 480) {
    setTimeout(() => {
      document.getElementById("loadingMessage").classList.add("show");
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
      loginContainer.style.display = "flex";
      footer.style.display = "block";
      header.style.display = "flex";

      loginContainer.classList.add("show");
      footer.classList.add("show");
      header.classList.add("show");
    }, 1500);

    return;
  }

  setTimeout(() => {
    document.getElementById("loadingMessageMobile").classList.add("show");
  }, 100);
  setTimeout(() => {
    loadingMessageMobile.style.display = "flex";
    loadingMessageMobile.style.width = "200px";
    loadingMessageMobile.style.height = "50px";
    loadingMessageMobile.style.transform = "scale(0.375) translate(100px, -150px)";
    loadingMessageMobile.style.top = "64px";
    loadingMessageMobile.style.left = "-80px";
  }, 1000);

  setTimeout(() => {
    mobileLogoChange.style.display = "none";
    mobileLogoChangeDark.style.display = "block";
    mobileLogoChangeDark.style.opacity = "1";
    mobileLogoChangeDark.style.visibility = "visible";
  }, 1500);

  setTimeout(() => {
    document.body.style.setProperty("background", "rgb(246, 247, 248)", "important");
    loginContainer.style.display = "flex";
    footer.style.display = "block";
    mobileNav.style.display = "flex";
    loginContainer.classList.add("show");
    footer.classList.add("show");
    mobileNav.classList.add("show");
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
  let response = await fetch(BASE_URL + "signup/" + "user/" + path + ".json");
  let responseToJson = await response.json();

  let users = [];

  for (let key in responseToJson) {
    let user = responseToJson[key];

    users.push({
      contactEmail: user.contactEmail,
      contactPassword: user.contactPassword,
    });
  }

  return users;
}

async function initializeCheck() {
  allUser = await getData();
  checkLogin();
}

document.querySelector("#LoginButton").addEventListener("click", function (event) {
  event.preventDefault();
  initializeCheck();
});

function checkLogin() {
  let loginEmail = document.getElementById("inputEmail").value;
  let loginPassword = document.getElementById("inputPassword1").value;

  let user = allUser.find((user) => {
    return user.contactEmail.includes(loginEmail) && user.contactPassword.includes(loginPassword);
  });

  if (user) {
    window.location.assign("./index.html");
  } else {
    document.getElementById("wrongPassword").classList.remove("d-none");
  }
}

document.querySelector(".formInputContainer").addEventListener("click", function (event) {
  document.getElementById("wrongPassword").classList.add("d-none");
});
