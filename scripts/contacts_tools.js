
/**
 * Resets the contact modal forms and alerts.
 *
 * This function resets any alerts and clears the input fields
 * of both the new contact form and the edit contact form. Afterwards
 * the function `resetAltert` hides alert messages and removes error styles from input fields.
 */
function resetModal() {
    resetAlert();
    document.getElementById("newContactForm").reset();
    document.getElementById("editContactForm").reset();
}

function resetAlert() {
    document.getElementById("invalidPasswordContact").classList.add("d_none");
    document.getElementById("invalidPasswordNewContact").classList.add("d_none");
    document.getElementById("dialog-email").classList.remove("input-error");
    document.getElementById("recipient-email").classList.remove("input-error");
}

document.addEventListener("DOMContentLoaded", function () {
    highlightActiveContact(".listBody");
});

function highlightActiveContact() {
    const selectedContactId = localStorage.getItem("selectedContact");
    const contacts = document.querySelectorAll(".listBody");
    contacts.forEach((contact) => {
        contact.classList.remove("active");
    });
    if (selectedContactId) {
        const contact = document.getElementById(`list${selectedContactId}`);
        if (contact) {
            contact.classList.add("active");
        }
    }
}

/**
* Displays a success message toast notification and reloads the page after the toast is hidden.
*
* @param {string} status - The status of the signup process. If the status is "edit", the message will indicate that the contact was successfully edited.
*/
function signupSuccessfullMessage(status) {
    let toastRef = document.getElementById("successMessage");
    let overlay = document.getElementById("overlay");

    updateToastMessage(status);
    showToast(toastRef, overlay);
}

function updateToastMessage(status) {
    if (status === "edit") {
        document.getElementById("toastMessage").textContent = "Contact successfully edited";
    }
    if (status === "existing") {
        document.getElementById("toastMessage").textContent = "Email address already in use";
    }
}

function showToast(toastRef, overlay) {
    let toast = new bootstrap.Toast(toastRef, { autohide: false });
    overlay.style.display = "block";
    toast.show();
    setTimeout(() => {
        toast.hide();
    }, 2000);
    toastRef.addEventListener("hidden.bs.toast", () => hideOverlayAndReload(overlay));
}


/**
 * Toggles the visibility of the dialog content and reloads the page.
 *
 * This function finds the element with the ID "dialog_content" and toggles
 * the "d_none" class on it, which is presumably used to show or hide the
 * dialog. After toggling the visibility, the page is reloaded.
 */
async function cancelAndCross() {
    let showDialog = document.getElementById("dialog_content");
    showDialog.classList.toggle("d_none");
    await fetchData();
}

/**
 * Closes the contact information dialog by adding a CSS class to hide it on mobile devices.
 *
 * This function selects the HTML element with the ID "contactInfo_content" and adds the
 * "d_none_mobile" class to it, which is assumed to hide the element on mobile devices.
 */
function closeContactInfo() {
    let showDialog = document.getElementById("contactInfo_content");
    showDialog.classList.add("d_none_mobile");
}

/**
 * Toggles the visibility of the edit and delete buttons.
 * This function finds the element with the ID "showOption_content" and toggles
 * the "d_none" class on it, which controls the display property.
 */
function showEditandDeleteBtn() {
    let showOption = document.getElementById("showOption_content");
    showOption.classList.toggle("d_none");
}

function protection(event) {
    event.stopPropagation();
}


/**
 * Displays the contact information section on mobile devices.
 *
 * This function checks if the viewport width is 768 pixels or less
 * using the `window.matchMedia` method. If the condition is met,
 * it removes the "d_none_mobile" class from the element with the
 * ID "contactInfo_content", making the contact information visible
 * on mobile devices.
 */
function mobileContactInfo() {
    let contactInfo = document.getElementById("contactInfo_content");
    if (window.matchMedia("(max-width: 768px)").matches) {
        contactInfo.classList.remove("d_none_mobile");
    }
}

function toggleDialogVisibility() {
    document.getElementById("body").classList.toggle("o_none");
    document.getElementById("dialog_content").classList.remove("d_none");
}