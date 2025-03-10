function greet(name) {
  console("hallo" + name);
}

function showDesktopMenu() {
  let deskMenuRef = document.getElementById("deskMenu_content");
  deskMenuRef.classList.toggle("d_none");
}

/**
 * Rendert die obere Leiste (TopBar) der Benutzeroberfläche.
 * 
 * Diese Funktion ruft die Daten des angemeldeten Benutzers ab und aktualisiert
 * die obere Leiste mit den Initialen des Benutzers. Falls keine Initialen vorhanden
 * sind, wird der Buchstabe "G" verwendet.
 * 
 * @async
 * @function renderTopBar
 * @returns {Promise<void>} Eine Promise, die aufgelöst wird, wenn die obere Leiste aktualisiert wurde.
 */
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

/**
 * Loggt den aktuellen Benutzer aus, indem es die Benutzerdaten zurücksetzt und die geänderten Daten in die Datenbank speichert.
 * Anschließend wird der Benutzer zur Startseite weitergeleitet.
 *
 * @async
 * @function logOut
 * @returns {Promise<void>} - Eine Promise, die aufgelöst wird, wenn der Benutzer erfolgreich ausgeloggt wurde und die Weiterleitung erfolgt ist.
 */
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
    }
  } catch (error) {
 
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

/**
 * Fügt einen neuen Kontakt basierend auf den Anmeldedaten des Benutzers hinzu.
 * 
 * Diese Funktion ruft die Anmeldedaten des Benutzers ab und überprüft, ob der Kontakt bereits existiert.
 * Wenn der Kontakt nicht existiert, wird ein neuer Kontakt erstellt und gespeichert.
 * 
 * @async
 * @function addContactLogIn
 * @returns {Promise<boolean>} - Gibt true zurück, wenn der Kontakt erfolgreich hinzugefügt wurde oder bereits existiert.
 */
async function addContactLogIn() {
  let signInUserData = await getSigneInUserData();
  if (!signInUserData || !signInUserData.contactName || !signInUserData.contactEmail) {
  }
  let contacts = await getContacts();
  let contactsArray = Object.values(contacts);
  let matchingContacts = contactsArray.filter((contact) => contact.email?.toLowerCase().includes(signInUserData.contactEmail[0].toLowerCase()));
  if (matchingContacts.length > 0) { return true;}
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
  return true;
}

function saveToLocalStorage(user) {
  let userEmail = user.contactEmail[0];
  localStorage.setItem("user", JSON.stringify(userEmail));
}

/**
 * Überprüft die Zugriffsberechtigung des Benutzers.
 * 
 * Diese Funktion überprüft, ob die E-Mail-Adresse des Benutzers, die im lokalen Speicher gespeichert ist,
 * mit der E-Mail-Adresse des angemeldeten Benutzers übereinstimmt. Wenn die E-Mail-Adressen übereinstimmen,
 * wird die Funktion beendet. Andernfalls wird der Benutzer zur Anmeldeseite weitergeleitet.
 * 
 * @async
 * @function checkAccessAuthorization
 * @returns {Promise<void>} Eine Promise, die aufgelöst wird, wenn die Überprüfung abgeschlossen ist.
 */
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

/**
 * Überprüft die Gültigkeit einer E-Mail-Adresse und aktualisiert die Benutzeroberfläche entsprechend.
 *
 * @param {Event} event - Das Ereignis, das durch die Eingabe des Benutzers ausgelöst wird.
 * @returns {void}
 */
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

/**
 * Überprüft die Gültigkeit von Formularen und aktiviert/deaktiviert den Senden-Button basierend auf der Gültigkeit der Eingaben.
 *
 * Diese Funktion durchsucht eine Liste von Formular-IDs, findet die entsprechenden Formulare im DOM und überprüft die Eingabefelder.
 * Wenn alle Eingabefelder gültig sind, wird der Senden-Button aktiviert, andernfalls wird er deaktiviert.
 *
 * Die Überprüfung umfasst:
 * - Sicherstellen, dass E-Mail-Felder gültige E-Mail-Adressen enthalten.
 * - Sicherstellen, dass alle anderen Eingabefelder nicht leer sind.
 *
 * @function
 */
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
