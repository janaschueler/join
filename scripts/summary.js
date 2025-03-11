const BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = [];
let signedInName;

async function init() {
    let checkedAuthority = await checkAccessAuthorization();
    if (checkedAuthority) {
        await fetchData();
        renderTopBar();
        renderSummary();
        await renderAllStatus();
        greetings();
        disableLoadingSpinner();
    } else {
        window.location.href = "login.html";
    }
}

/**
 * Fetches data from a specified path and processes it.
 *
 * @async
 * @function fetchData
 * @param {string} [path=""] - The path to append to the base URL for fetching data.
 * @returns {Promise<Object>} The fetched data as a JSON object.
 *
 * @throws {Error} Will throw an error if the fetch operation fails.
 *
 * @example
 * fetchData("examplePath")
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
async function fetchData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let data = await response.json();
    signedInName = data.signedIn.contactName[0];
    if (data.tasks) {
        Object.values(data.tasks).forEach(task => allTasks.push(task));
    }
    return data;
}

function renderSummary() {
    let summaryRef = document.getElementById('summary_content');
    for (let i = 0; i < allTasks.length; i++) {
        summaryRef.innerHTML = templateSummary(signedInName);
    }
}

/**
 * Disables the loading spinner by adding a 'd_none' class to the element with the ID 'spinner_content'
 * when the viewport width is 768px or less. The visibility of the spinner is updated after a delay of 1.5 seconds
 * and also whenever the window is resized.
 */
function disableLoadingSpinner() {
    let loadingSpinnerRef = document.getElementById('spinner_content');
    function updateSpinnerVisibility() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            loadingSpinnerRef.classList.add('d_none');
        } else {
            loadingSpinnerRef.classList.remove('d_none');
        }
    }
    setTimeout(() => {
        updateSpinnerVisibility();
        window.addEventListener("resize", updateSpinnerVisibility);
    }, 1500);
}

/**
 * Updates the text content of HTML elements with IDs 'greeting_content' and 'greeting_Mobile_content'
 * based on the current time of day. Displays "Good Morning" if the time is between 5 AM and 12 PM,
 * "Good Afternoon" if the time is between 12 PM and 6 PM, and "Good Evening" otherwise.
 */
function greetings() {
    let greetingsRef = document.getElementById('greeting_content');
    let greetingsMobileRef = document.getElementById('greeting_Mobile_content');
    let currentHour = new Date().getHours();
    let greeting;
    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }
    greetingsRef.textContent = greeting;
    greetingsMobileRef.textContent = greeting;
}

/**
 * Asynchronously renders all status-related information on the board.
 * 
 * This function calls several other functions to find and render different
 * statuses and tasks on the board. The specific statuses and tasks it handles
 * include:
 * - Tasks Board
 * - Status One
 * - Status Four
 * - Status Three
 * - Status Two
 * - Urgent tasks
 * - Deadlines
 * 
 * @async
 * @function renderAllStatus
 * @returns {Promise<void>} A promise that resolves when all status information has been rendered.
 */
async function renderAllStatus() {
    findTasksBoard();
    findStatusOne();
    findStatusFour();
    findStatusThree();
    findStatusTwo();
    findUrgent();
    findDeadline();
}

/**
 * Updates the 'toDoBoard_content' element with the number of tasks found.
 * 
 * This function retrieves the element with the ID 'toDoBoard_content' and updates its inner HTML
 * to display the number of tasks found in the 'allTasks' array. If 'allTasks' is empty or undefined,
 * it defaults to displaying 0.
 */
function findTasksBoard() {
    let toDoRef = document.getElementById('toDoBoard_content');
    let foundTasks = allTasks.length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

/**
 * Updates the inner HTML of the element with ID 'toDoOne_content' to display the number of tasks with status 1.
 * 
 * This function filters the global `allTasks` array to count the number of tasks that have a status of 1.
 * It then updates the content of the HTML element with the ID 'toDoOne_content' to show this count.
 */
function findStatusOne() {
    let toDoRef = document.getElementById('toDoOne_content');
    let foundTasks = allTasks.filter(element => element.status === 1).length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

/**
 * Updates the inner HTML of the element with ID 'toDoTwo_content' to display the number of tasks
 * with a status of 2. The function filters the global `allTasks` array to count the tasks that 
 * have a status of 2 and then sets this count as the content of the specified HTML element.
 */
function findStatusTwo() {
    let toDoRef = document.getElementById('toDoTwo_content');
    let foundTasks = allTasks.filter(element => element.status === 2).length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

/**
 * Updates the inner HTML of the element with ID 'toDoThree_content' to display the number of tasks with a status of 3.
 * 
 * This function filters the global `allTasks` array to count the number of tasks that have a status of 3.
 * It then updates the inner HTML of the element with ID 'toDoThree_content' to show this count.
 */
function findStatusThree() {
    let toDoRef = document.getElementById('toDoThree_content');
    let foundTasks = allTasks.filter(element => element.status === 3).length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

/**
 * Updates the inner HTML of the element with ID 'toDoFour_content' to display the number of tasks with status 4.
 * 
 * This function filters the global `allTasks` array to count the number of tasks that have a status of 4.
 * It then updates the content of the HTML element with the ID 'toDoFour_content' to show this count.
 */
function findStatusFour() {
    let toDoRef = document.getElementById('toDoFour_content');
    let foundTasks = allTasks.filter(element => element.status === 4).length || 0;
    toDoRef.innerHTML = `<div>${foundTasks}</div>`;
}

function findUrgent() {
    let urgentRef = document.getElementById('urgent_content');
    let foundUrgent = allTasks.filter(element => element.priority === "urgent").length || 0;
    urgentRef.innerHTML = `<div>${foundUrgent}</div>`;
}

/**
 * Updates the text content of the element with id 'deadline_content' to the nearest upcoming task deadline.
 * If there are no upcoming deadlines, it sets the text content to "No upcoming deadlines."
 *
 * The function filters tasks from the global `allTasks` array that have a due date on or after today's date,
 * sorts them by due date in ascending order, and updates the text content of the deadline reference element
 * with the earliest due date.
 */
function findDeadline() {
    let deadlineRef = document.getElementById('deadline_content');
    let today = new Date().toISOString().split('T')[0];
    let nextDate = allTasks
        .filter(task => task.dueDate >= today)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .map(task => task.dueDate)[0];
    deadlineRef.textContent = nextDate || "No upcoming deadlines.";
}