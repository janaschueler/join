logedInUser = { contactEmail: [], contactPassword: [], contactId: [], contactName: [], contactAbbreviation: [] };

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
<<<<<<< HEAD
  }   
=======
  }  
  topBarRef.innerHTML += templateTopBar(contactAbbreviation);
}

function renderTopBarContact(contactAbbreviation) {
  let topBarRef = document.getElementById("topbar_contact");
>>>>>>> 1a339d7271eb6585cdf41610f9cb92fc4b5b07c4
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
<<<<<<< HEAD
  

=======
>>>>>>> 1a339d7271eb6585cdf41610f9cb92fc4b5b07c4
  return logedInUsers;
}
