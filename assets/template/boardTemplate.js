function generateToDoHTML(allTodos, priorityIcon, numberOfSubtasks, progressOfProgressbar) {
  return ` <div onclick="openModal('${allTodos["id"]}')" draggable ="true" ondragstart="startDragging('${allTodos["id"]}')" class="listContainerContent">
                        <div class="category" style="background-color:red;">
                          <span>${allTodos["category"]}</span>
                        </div>
                        <div class="listDiscription">
                          <span class="titleCopy">${allTodos["title"]}</span> <br>
                          <span class="descriptionCopy">${allTodos["description"]} </span>
                        </div>
                        <div>
                          <div id="progressContainer" class="progressContainer">
                            <div class="progress-bar" role="progressbar" style="width: ${progressOfProgressbar}%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                            <span class="sr-only">1/${numberOfSubtasks} Subtasks</span>
                        </div>
                        <div class="priorityContainer">
                          <div id="assigneeContainer${allTodos["id"]}" class="assigneeContainer">
                          </div>
                          <img src="${priorityIcon}" alt="${allTodos["priority"]} Icon">
                        </div>
                        </div>
                      </div>`;
}

function generateAssigneeCircle(assigneeAbbreviation, assingeeColor) {
  return `                  <svg class="circle" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="15.5" fill="${assingeeColor}" stroke="white"/>
                                <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="central">${assigneeAbbreviation}</text>
                            </svg>`;
}

function generateTaskSummaryModal(allTodos, priorityIcon) {
  return ` <div id="modalTaskSummary" class="summaryTaskContainer">
            <div class="ModalheaderContainer">
              <div class="category" style="background-color:red;">
              <span>${allTodos["category"]}</span>
              </div>
              <button onclick="closeModal()"  type="button" class="ModalCloseButton"></button>
            </div>
            <div class="listDiscription">
              <h1 class="mobileHeadline" >${allTodos["title"]}</h1> 
              <span class="descriptionCopy">${allTodos["description"]}</span>
            </div>
            <table class="contentmodlaTask">
              <tr>
                <td>Due date:</td>
                <td>${allTodos["date"]}</td>
              </tr>
              <tr>
                <td>Priority:</td>
                <td>${allTodos["priority"]}<img class="iconSummaryModal" src="${priorityIcon}" alt=""></td>
              </tr>
            </table>
            <div class="margin_8">
              <span class="spanBlue">Assinged To:</span>
              <ol id="assigneeListModal${allTodos["id"]}">
              </ol>
            </div>
            <div>
              <div id="subtaskContainer${allTodos["id"]}" class="styleSubstaskSpan">
                <ol id="subtaskListModal${allTodos["id"]}">
                </ol>
            </div>
            <div class="buttonContainer">
              <div class="editContainer">
                <button onclick="openEditModal${allTodos["id"]}(" class="editIcon">Edit</button>
                <button onclick="deleteTask('${allTodos["id"]}')" class="deleteIcon">Delete</button>
              </div>
            </div>
          </div>`;
}

function generateAssigneeComntacts(assigneeAbbreviation, assingeeColor, assignee) {
  return `      <li>
                  <div class="groupAssignee">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="15.5" fill="${assingeeColor}" stroke="white"/>
                      <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="central">${assigneeAbbreviation}</text>
                  </svg>
                  <span>${assignee}</span>
                </div>
                </li>`;
}

function generateSubtasks(allTodos, subtask) {
  return `        <span>Subtasks</span> 
                  <li>
                    <label class="customCheckboxContainer">
                      <input class="marginLR_8" type="checkbox" id="${allTodos["id"]}" name="" value="">
                      <span class="customCheckbox"></span>
                      <span class="subtasksUnit">${subtask}</span>
                    </label>
                  </li>`;
}


function generateAddTask(allTodos, priorityIcon) {
  return ` <div id="modalTaskSummary" class="summaryTaskContainer">
            <div class="ModalheaderContainer">
              <div class="category" style="background-color:red;">
              <span>${allTodos["category"]}</span>
              </div>
              <button onclick="closeModal()"  type="button" class="ModalCloseButton"></button>
            </div>
            <div class="listDiscription">
              <h1 class="mobileHeadline" >${allTodos["title"]}</h1> 
              <span class="descriptionCopy">${allTodos["description"]}</span>
            </div>
            <table class="contentmodlaTask">
              <tr>
                <td>Due date:</td>
                <td>${allTodos["date"]}</td>
              </tr>
              <tr>
                <td>Priority:</td>
                <td>${allTodos["priority"]}<img class="iconSummaryModal" src="${priorityIcon}" alt=""></td>
              </tr>
            </table>
            <div class="margin_8">
              <span class="spanBlue">Assinged To:</span>
              <ol id="assigneeListModal${allTodos["id"]}">
              </ol>
            </div>
            <div>
              <div id="subtaskContainer${allTodos["id"]}" class="styleSubstaskSpan">
                <ol id="subtaskListModal${allTodos["id"]}">
                </ol>
            </div>
            <div class="buttonContainer">
              <div class="editContainer">
                <button onclick="openEditModal${allTodos["id"]}(" class="editIcon">Edit</button>
                <button onclick="deleteTask('${allTodos["id"]}')" class="deleteIcon">Delete</button>
              </div>
            </div>
          </div>`;
}