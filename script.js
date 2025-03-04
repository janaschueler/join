/**
 * This function is used to greet someone on the comand line
 *
 * @param {string} name - this is the dame of the person that you want ot greet
 */

function greet(name) {
  console("hallo" + name);
}

function showDesktopMenu() {
  let deskMenuRef = document.getElementById("deskMenu_content");
  deskMenuRef.classList.toggle("d_none");
}

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

async function guestLogIn() {
  let guest = {
    contactAbbreviation: ["G"],
    contactEmail: ["guest@mail.com"],
    contactId: "",
    contactName: ["Guest"],
    contactPassword: [""],
  };
  await postSignedInUserToDatabase(guest);
  saveToLocalStorage(guest)
  window.location.href = "./index.html";
}

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
      console.error("Fehler bei der Anfrage:", response.statusText);
    }
  } catch (error) {
    console.error("Fehler beim Posten:", error);
  }
}

async function getSigneInUserData() {
  let response = await fetch(BASE_URL + "signedIn/" + ".json");
  let logedInUsers = await response.json();
  return logedInUsers;
}

function saveToLocalStorage(user) {
  let userEmail = user.contactEmail[0];
  localStorage.setItem("user", JSON.stringify(userEmail));
}

async function checkAccessAuthorization() {
  let userEmail = getFromLoclaStorage();
  console.log(userEmail);
  let signedInUserRef = await getSigneInUserData();
  let signedInUser = signedInUserRef.contactEmail[0];
  console.log(signedInUser);
  if (userEmail == signedInUser) {
    return; 
  } else {
    window.location.href = "login.html";
  }
}

function getFromLoclaStorage() {
  let user = JSON.parse(localStorage.getItem("user"));
  return user;
}
