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

function transfereLoginData(user) {
  postSignedInUserToDatabase(user);
}

async function guestLogIn() {
  let guest = {
    contactAbbreviation: ["G"],
    contactEmail: [""],
    contactId: "",
    contactName: ["Guest"],
    contactPassword: [""],  
  }; 
  await postSignedInUserToDatabase(guest);
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
  let deskMenuRef = document.getElementById('deskMenu_content');
  deskMenuRef.classList.toggle('d_none');
  event.preventDefault();
}
