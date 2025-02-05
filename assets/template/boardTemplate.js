function generateToDoHTML(allTodos, priorityIcon, numberOfSubtasks, progressOfProgressbar) {
  return ` <div draggable ="true" ondragstart="startDragging(id)" class="listContainerContent">
                        <div class="category">
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
