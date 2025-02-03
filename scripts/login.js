const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allUser = { contactEmail: [], contactPassword: [] };

function onloadFunc() {
  showLoadingMessage();
}

function showLoadingMessage() {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = "flex";
  setTimeout(() => {
    loadingMessage.style.width = "100px";
    loadingMessage.style.height = "50px";
    loadingMessage.style.transform = "scale(0.375) translate(100px, -150px)";
    loadingMessage.style.top = "133px";
    loadingMessage.style.left = "68px";
  }, 1000);
  const loginContainer = document.getElementById("loginContainer");
  const footer = document.getElementById("footer");
  const header = document.getElementById("header");
  setTimeout(() => {
    loginContainer.style.display = "flex";
    footer.style.display = "block";
    header.style.display = "flex";
  }, 1500);
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
