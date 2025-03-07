function templateSmallContacts(currentDatas) {
  let nameParts = currentDatas.name.trim().split(" ");
  let firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  let initials = firstNameInitial;
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  return `<div class="list" onclick="selectContact('${currentDatas.id}'), mobileContactInfo()">
            <div class="list-header">
              <div class="listHeader">          
              </div>
              <div tabindex="0" class="listBody">
                <svg class="circle" width="32" height="32" viewBox="0 0 32 32" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="15.5" fill="${currentDatas.color}" stroke="white" />
                  <text id="color_content" x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle"
                    alignment-baseline="central">${initials}</text> 
                </svg>
                <div class="listName_Email">
                  <span class="listName">${currentDatas.name}</span>
                  <a class="listEmail" href="mailto:${currentDatas.email}">${currentDatas.email}</a>

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
            <svg class="circle big_circle" width="120" height="120" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="15.5" fill="${currentDatas.color}" stroke="white"/>
              <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="central">${initials}</text>
            </svg>
            <div class="contactName">
              <span>${currentDatas.name}</span>
              <div class="editContainer">
                <button onclick="openEditDialog('${currentDatas.id}')" class="editIcon">
                  <svg class="editIconImg" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
                  </svg>                  
                  <div>Edit</div>                
                </button>
                <button onclick="deleteContact('${currentDatas.id}')" class="deleteIcon">
                  <svg class="deleteImgIcon" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
                  </svg>                  
                  <div>Delete</div>
                </button>
              </div>
            </div>
          </div>
          <div class="contactInformation">
            <span class="subHeadline">Contact Information</span>
            <span class="categoryLine">Email</span>
            <a class="emailLink" href="mailto:${currentDatas.email}">${currentDatas.email}</a>
            <span class="categoryLine">Phone</span>
            <a class="phoneLink" href="tel:${currentDatas.phone}">+49 ${currentDatas.phone}</a>
          </div>
          <div id="showOption_content" class="option_main d_none">
            <div class="option_area">
              <button onclick="openEditDialog('${currentDatas.id}')" class="option_btn">
                <img src="./assets/icons/edit.svg" alt="">
                <span>Edit</span>
              </button>
              <button onclick="deleteContact('${currentDatas.id}')" class="option_btn">
                <img src="./assets/icons/delete.svg" alt="">
                <span>Delete</span>
              </button>
            </div>
          </div>
          <button onclick="showEditandDeleteBtn()" class="mobile_edit_info">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_71395_18084)">
                <rect x="4" width="56" height="56" rx="28" fill="#2A3647" shape-rendering="crispEdges" />
                <rect x="4.5" y="0.5" width="55" height="55" rx="27.5" stroke="#2A3647" shape-rendering="crispEdges" />
                <mask id="mask0_71395_18084" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="16" y="12" width="32"
                  height="32">
                  <rect x="16" y="12" width="32" height="32" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_71395_18084)">
                  <path
                    d="M31.9997 38.6666C31.2663 38.6666 30.6386 38.4055 30.1163 37.8833C29.5941 37.361 29.333 36.7333 29.333 35.9999C29.333 35.2666 29.5941 34.6388 30.1163 34.1166C30.6386 33.5944 31.2663 33.3333 31.9997 33.3333C32.733 33.3333 33.3608 33.5944 33.883 34.1166C34.4052 34.6388 34.6663 35.2666 34.6663 35.9999C34.6663 36.7333 34.4052 37.361 33.883 37.8833C33.3608 38.4055 32.733 38.6666 31.9997 38.6666ZM31.9997 30.6666C31.2663 30.6666 30.6386 30.4055 30.1163 29.8833C29.5941 29.361 29.333 28.7333 29.333 27.9999C29.333 27.2666 29.5941 26.6388 30.1163 26.1166C30.6386 25.5944 31.2663 25.3333 31.9997 25.3333C32.733 25.3333 33.3608 25.5944 33.883 26.1166C34.4052 26.6388 34.6663 27.2666 34.6663 27.9999C34.6663 28.7333 34.4052 29.361 33.883 29.8833C33.3608 30.4055 32.733 30.6666 31.9997 30.6666ZM31.9997 22.6666C31.2663 22.6666 30.6386 22.4055 30.1163 21.8833C29.5941 21.361 29.333 20.7333 29.333 19.9999C29.333 19.2666 29.5941 18.6388 30.1163 18.1166C30.6386 17.5944 31.2663 17.3333 31.9997 17.3333C32.733 17.3333 33.3608 17.5944 33.883 18.1166C34.4052 18.6388 34.6663 19.2666 34.6663 19.9999C34.6663 20.7333 34.4052 21.361 33.883 21.8833C33.3608 22.4055 32.733 22.6666 31.9997 22.6666Z"
                    fill="white" />
                </g>
              </g>
              <defs>
                <filter id="filter0_d_71395_18084" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_71395_18084" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_71395_18084" result="shape" />
                </filter>
              </defs>
            </svg>
          </button>
          `
}

function templateModalContacts(currentDatas) {
  let nameParts = currentDatas.name.trim().split(" ");
  let initials = nameParts[0].charAt(0).toUpperCase();
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  return `<svg class="circle big_circle" width="120" height="120" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="15.5" fill="${currentDatas.color}" stroke="white"/>
              <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="central">${initials}</text>
            </svg>`
}