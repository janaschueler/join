/**
 * This function is used to greet someone on the comand line
 *
 * @param {string} name - this is the dame of the person that you want ot greet
 */

function greet(name) {
  console("hallo" + name);
}

function showDesktopMenu() {
  let deskMenuRef = document.getElementById('deskMenu_content');
  deskMenuRef.classList.toggle('d_none'); 
}

function renderTopBarSummary() {
  let topBarRef = document.getElementById('topbar_summary');
  topBarRef.innerHTML += templateTopBar(); 
}

function renderTopBarContact() {
  let topBarRef = document.getElementById('topbar_contact');  
  topBarRef.innerHTML += templateTopBar();
}
  


