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
  saveToLocalStorage(guest);
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

async function addContactLogIn() {
  let signInUserData = await getSigneInUserData();
  if (!signInUserData || !signInUserData.contactName || !signInUserData.contactEmail) {
    throw new Error("Fehlende oder ungültige Benutzerdaten");
  }
  let contacts = await getContacts();
  let contactsArray = Object.values(contacts);
  let matchingContacts = contactsArray.filter((contact) => contact.email?.toLowerCase().includes(signInUserData.contactEmail[0].toLowerCase()));
  if (matchingContacts.length > 0) {
    return;
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
}

function saveToLocalStorage(user) {
  let userEmail = user.contactEmail[0];
  localStorage.setItem("user", JSON.stringify(userEmail));
}

async function checkAccessAuthorization() {
  let userEmail = getFromLoclaStorage();
  let signedInUserRef = await getSigneInUserData();
  let signedInUser = signedInUserRef.contactEmail[0];
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

function validateText(event) {
  let input = event.target.value;
  if (!/^[a-zA-ZäöüÄÖÜß\s]*$/.test(input)) {
    event.target.value = input.replace(/[^a-zA-ZäöüÄÖÜß\s]/g, "");
  }
  checkFormValidity();
}

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
