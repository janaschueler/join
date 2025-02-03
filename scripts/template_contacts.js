function templateSmallContacts(currentDatas) {   
  let nameParts = currentDatas.name.trim().split(" "); 
  let firstNameInitial = nameParts[0].charAt(0).toUpperCase();   
  let initials = firstNameInitial;
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  return `<div class="list" onclick="selectContact('${currentDatas.id}')">
            <div class="list-header">
              <div class="listHeader">
                <span>${firstNameInitial}</span> <!-- Nur der erste Buchstabe des Vornamens -->
                <div class="horizontalLine"></div>
              </div>
              <div class="listBody">
                <svg class="circle" width="32" height="32" viewBox="0 0 32 32" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="15.5" fill="#FF7A00" stroke="white" />
                  <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle"
                    alignment-baseline="central">${initials}</text> <!-- Zwei Buchstaben im Kreis -->
                </svg>
                <div class="listName_Email">
                  <span class="listName">${currentDatas.name}</span>
                  <a class="listEmail" href="">${currentDatas.email}</a>
                </div>
              </div>
            </div>
          </div>`
}

function templateBigContacts(currentDatas) {  
  let nameParts = currentDatas.name.trim().split(" ");
  let initials = nameParts[0].charAt(0).toUpperCase();
  if (nameParts.length > 1) {
      initials += nameParts[1].charAt(0).toUpperCase();
  }
  return `<div class="contactHeader">
            <svg class="circle" width="120" height="120" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="15.5" fill="#FF7A00" stroke="white"/>
              <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="central">${initials}</text>
            </svg>
            <div class="contactName">
              <span>${currentDatas.name}</span>
              <div class="editContainer">
                <button class="editIcon">Edit</button>
                <button class="deleteIcon">Delete</button>
              </div>
            </div>
          </div>
          <div class="contactInformation">
            <span class="subHeadline">Contact Information</span>
            <span class="categoryLine">Email</span>
            <a class="emailLink" href="mailto:${currentDatas.email}">${currentDatas.email}</a>
            <span class="categoryLine">Phone</span>
            <a class="phoneLink" href="tel:${currentDatas.phone}">${currentDatas.phone}</a>
          </div>`
}





