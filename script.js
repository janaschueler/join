logedInUser = { contactEmail: [], contactPassword: [], contactId: [], contactName: [], contactAbbreviation: [] };

function greet(name) {
  console("hallo" + name);
}

function showDesktopMenu() {
  let deskMenuRef = document.getElementById("deskMenu_content");
  deskMenuRef.classList.toggle("d_none");
}

function renderTopBarSummary() {
  let topBarRef = document.getElementById("topbar_summary");
  let contactAbbreviation = logedInUser.contactAbbreviation.join('');
  console.log(contactAbbreviation);

  if (!contactAbbreviation) {
    contactAbbreviation = "G";
  }
  console.log(contactAbbreviation);

  topBarRef.innerHTML += templateTopBar(contactAbbreviation);
}

function renderTopBarContact() {
  let topBarRef = document.getElementById("topbar_contact");
  topBarRef.innerHTML += templateTopBar(contactAbbreviation);
}

function transfereLoginData(user) {
  logedInUser.contactEmail.push(user.contactEmail);
  logedInUser.contactId.push(user.contactId);
  logedInUser.contactName.push(user.contactName);
  logedInUser.contactAbbreviation.push(user.contactAbbreviation);
}
