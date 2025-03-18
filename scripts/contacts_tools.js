
  /**
   * Adds a new contact to the database.
   *
   * This function retrieves the input values for the contact's name, email, and phone, validates them,
   * checks for existing contacts with the same email, and if none are found, saves the new contact to the database.
   * If the email already exists, it displays a message indicating the contact is already registered.
   *
   * @async
   * @function addContact
   * @returns {Promise<void>} A promise that resolves when the contact is successfully added or if an existing contact is found.
   */
  
  async function addContact() {
    let nameRef = document.getElementById("recipient-name");
    let emailRef = document.getElementById("recipient-email");
    let phoneRef = document.getElementById("recipient-phone");
    if (!validateContactInputs(nameRef, emailRef, phoneRef)) return;
    let existingContactsCount = checkExistingContacts(emailRef);
    if (existingContactsCount > 0) {
      signupSuccessfullMessage("existing");
      closeModalAddTask();
      return;
    }
    await saveNewContact(nameRef, emailRef, phoneRef);
    closeModalAddTask();
  }
  
  /**
   * Saves a new contact to the database.
   *
   * This function creates a new contact object using the provided name, email, and phone, 
   * then saves the contact to the database. It updates the user interface to reflect the changes, 
   * resets the contact form fields, and displays a success message indicating that the contact was successfully added.
   *
   * @async
   * @function saveNewContact
   * @param {HTMLElement} nameRef - The HTML element for the contact's name input field.
   * @param {HTMLElement} emailRef - The HTML element for the contact's email input field.
   * @param {HTMLElement} phoneRef - The HTML element for the contact's phone input field.
   * @returns {Promise<void>} A promise that resolves when the contact is successfully saved and the UI is updated.
   */
  
  async function saveNewContact(nameRef, emailRef, phoneRef) {
    let newContact = createContact(nameRef.value, emailRef.value, phoneRef.value);
    await saveContact(newContact);
    updateContactUI();
    resetContactForm(nameRef, emailRef, phoneRef);
    signupSuccessfullMessage("new");
  }
  
  /**
   * Closes the "Add Task" modal and sets focus back to the appropriate element.
   * 
   * This function hides the Bootstrap modal with the ID "exampleModal" if it is currently active.
   * After closing the modal, it attempts to set focus back to the navigation bar element
   * within the task bar. If the navigation bar element is not found, it sets focus to the body element.
   * 
   * Dependencies:
   * - Requires Bootstrap's JavaScript library to manage the modal instance.
   * 
   * @returns {void}
   */
  function closeModalAddTask() {
    let modalElement = document.getElementById("exampleModal");
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    let navElement = document.querySelector(".task_bar .nav_bar");
    if (navElement) {
      navElement.focus();
    } else {
      document.body.focus();
    }
  }
  
  /**
   * Validates the input fields for a contact form by checking if all required fields have values.
   * Toggles the visibility of error messages based on the validation result.
   *
   * @param {HTMLInputElement} nameRef - Reference to the input field for the contact's name.
   * @param {HTMLInputElement} emailRef - Reference to the input field for the contact's email.
   * @param {HTMLInputElement} phoneRef - Reference to the input field for the contact's phone number.
   * @returns {boolean} - Returns `true` if all input fields have values, otherwise `false`.
   */
  function validateContactInputs(nameRef, emailRef, phoneRef) {
    let isValid = nameRef.value && emailRef.value && phoneRef.value;
    document.getElementById("editContactInputfieldError").classList.toggle("d_none", isValid);
    document.getElementById("newContactInputfieldError").classList.toggle("d_none", isValid);
    return isValid;
  }
  
  /**
   * Creates a new contact object with a unique ID, name, email, phone, and a color associated with the ID.
   *
   * @param {string} name - The name of the contact.
   * @param {string} email - The email address of the contact.
   * @param {string} phone - The phone number of the contact.
   * @returns {Object} A contact object containing the following properties:
   *   - {string} id: A unique identifier for the contact.
   *   - {string} name: The name of the contact.
   *   - {string} email: The email address of the contact.
   *   - {string} phone: The phone number of the contact.
   *   - {string} color: A color associated with the contact's ID.
   */
  function createContact(name, email, phone) {
    let contactId = Date.now().toString();
    return {
      id: contactId,
      name,
      email,
      phone,
      color: getColorById(contactId),
    };
  }
  
  /**
   * Saves a new contact by sending it to the server and updating the local state.
   *
   * @async
   * @function saveContact
   * @param {Object} contact - The contact object to be saved.
   * @param {string} contact.id - The unique identifier for the contact.
   * @returns {Promise<void>} Resolves when the contact is successfully saved.
   *
   * @description
   * This function sends the provided contact object to the server using the `postData` function.
   * After the contact is successfully sent, it is added to the `allUsers` array, and the
   * `selectedContactId` is updated to the ID of the newly saved contact.
   */
  async function saveContact(contact) {
    await postData("contacts", contact);
    allUsers.push(contact);
    selectedContactId = contact.id;
  }
  
  /**
   * Updates the contact UI by clearing the content of the small contacts container
   * and re-rendering both small and big contact elements.
   * 
   * This function ensures that the contact display is refreshed with the latest data.
   * It clears the existing content in the "contactsSmall_content" element and calls
   * the rendering functions for both small and big contact views.
   */
  function updateContactUI() {
    document.getElementById("contactsSmall_content").innerHTML = "";
    renderSmallContacts();
    renderBigContacts();
  }
  
  /**
   * Resets the values of the contact form fields to empty strings.
   *
   * @param {HTMLInputElement} nameRef - The reference to the input element for the name field.
   * @param {HTMLInputElement} emailRef - The reference to the input element for the email field.
   * @param {HTMLInputElement} phoneRef - The reference to the input element for the phone field.
   */
  function resetContactForm(nameRef, emailRef, phoneRef) {
    nameRef.value = "";
    emailRef.value = "";
    phoneRef.value = "";
  }
  
  /**
   * Updates data at the specified path in the database.
   *
   * This function sends a PATCH request to the database to update the data at the given path.
   * The provided data is converted to JSON and sent in the request body. The function returns
   * the response from the database in JSON format.
   *
   * @async
   * @function patchData
   * @param {string} [path=""] - The path where the data needs to be updated in the database.
   * @param {Object} [data={}] - The data to be updated at the specified path.
   * @returns {Promise<Object>} A promise that resolves to the updated data returned from the database.
   */
  async function patchData(path = "", data = {}) {
    const response = await fetch(BASE_URL + path + ".json", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
  
  /**
   * Determines a color from the `coloursArray` based on the given contact ID.
   * The function calculates a sum of the character codes of the contact ID,
   * then uses the modulo operation to map the sum to an index in the `coloursArray`.
   *
   * @param {string} contactId - The unique identifier for a contact.
   * @returns {string} - A color from the `coloursArray` corresponding to the contact ID.
   */
  function getColorById(contactId) {
    let sum = 0;
    for (let i = 0; i < contactId.length; i++) {
      sum += contactId.charCodeAt(i);
    }
    let index = sum % coloursArray.length;
    return coloursArray[index];
  }
  
  /**
   * Hides the overlay and reloads the contact data.
   *
   * This function hides the specified overlay by setting its `display` style to `none`.
   * After hiding the overlay, it fetches the latest data, re-renders the small and big
   * contact lists, and highlights the currently active contact.
   *
   * @async
   * @function hideOverlayAndReload
   * @param {HTMLElement} overlay - The overlay element to be hidden.
   * @returns {Promise<void>} A promise that resolves when the overlay is hidden and the data is reloaded.
   */
  async function hideOverlayAndReload(overlay) {
    overlay.style.display = "none";
    await fetchData();
    renderSmallContacts();
    renderBigContacts();
    highlightActiveContact();
  }


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

/**
 * Resets alert messages and input error styles in the contact form.
 * 
 * This function hides specific alert elements by adding the "d_none" class
 * and removes the "input-error" class from email input fields to clear any
 * visual error indicators.
 * 
 * Elements affected:
 * - Hides the "invalidPasswordContact" alert.
 * - Hides the "invalidPasswordNewContact" alert.
 * - Removes the "input-error" class from the "dialog-email" input field.
 * - Removes the "input-error" class from the "recipient-email" input field.
 */
function resetAlert() {
    document.getElementById("invalidPasswordContact").classList.add("d_none");
    document.getElementById("invalidPasswordNewContact").classList.add("d_none");
    document.getElementById("dialog-email").classList.remove("input-error");
    document.getElementById("recipient-email").classList.remove("input-error");
}

/**
 * Initializes the page by highlighting the active contact once the DOM is fully loaded.
 *
 * This function is triggered when the DOM content has fully loaded. It highlights the active
 * contact by calling the `highlightActiveContact` function with the specified selector for the list.
 *
 * @function
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", function () {
    highlightActiveContact(".listBody");
});

/**
 * Highlights the currently active contact in the contact list.
 * 
 * This function retrieves the ID of the selected contact from localStorage
 * and applies the "active" CSS class to the corresponding contact element
 * in the DOM. It also ensures that the "active" class is removed from all
 * other contact elements.
 * 
 * Steps:
 * 1. Fetches the selected contact ID from localStorage.
 * 2. Removes the "active" class from all contact elements.
 * 3. If a selected contact ID exists, it adds the "active" class to the
 *    corresponding contact element based on its ID.
 */
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

/**
 * Updates the text content of the toast message element based on the provided status.
 *
 * @param {string} status - The status indicating the type of message to display.
 *                          Acceptable values are:
 *                          - "edit": Displays a message indicating the contact was successfully edited.
 *                          - "existing": Displays a message indicating the email address is already in use.
 */
function updateToastMessage(status) {
    if (status === "edit") {
        document.getElementById("toastMessage").textContent = "Contact successfully edited";
    }
    if (status === "existing") {
        document.getElementById("toastMessage").textContent = "Email address already in use";
    }
}

/**
 * Displays a Bootstrap toast notification and an overlay, then hides them after a delay.
 *
 * @param {HTMLElement} toastRef - The reference to the toast element to be displayed.
 * @param {HTMLElement} overlay - The overlay element to be shown while the toast is visible.
 *
 * The function initializes a Bootstrap toast with the `autohide` option set to `false`,
 * displays the overlay, and shows the toast. After 2000 milliseconds, the toast is hidden.
 * Once the toast is fully hidden, the `hidden.bs.toast` event triggers the
 * `hideOverlayAndReload` function to hide the overlay and reload the necessary content.
 */
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

/**
 * Prevents the event from propagating (bubbling) up the DOM hierarchy.
 *
 * @param {Event} event - The event object to stop propagation for.
 */
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

/**
 * Toggles the visibility of a dialog by modifying CSS classes on specific elements.
 * - Toggles the "o_none" class on the element with the ID "body".
 * - Ensures the "dialog_content" element is visible by removing the "d_none" class.
 *
 * This function is typically used to show or hide a dialog box in the UI.
 */
function toggleDialogVisibility() {
    document.getElementById("body").classList.toggle("o_none");
    document.getElementById("dialog_content").classList.remove("d_none");    
}