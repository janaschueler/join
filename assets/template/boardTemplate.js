function generateToDoHTML(allTodos) {
  return ` <div draggable ="true" ondragstart="startDragging(id)" class="listContainerContent">
                        <div class="category">
                          <span>${allTodos["category"]}</span>
                        </div>
                        <div class="listDiscription">
                          <span class="titleCopy">${allTodos["title"]}</span> <br>
                          <span class="descriptionCopy">${allTodos["description"]} </span>
                        </div>
                        <div>
                          <div class="progressContainer">
                          <div class="progress-bar" role="progressbar" style="width: 80%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                          <span class="sr-only">1/2 Subtasks</span>
                        </div>
                        <div class="priorityContainer">
                          <div class="assigneeContainer">
                            <svg class="circle" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="15.5" fill="#FF7A00" stroke="white"/>
                                <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="central">AM</text>
                            </svg>
                            <svg class="circle" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="15.5" fill="rgb(32, 215, 193)" stroke="white"/>
                                <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="central">EM</text>
                            </svg>
                          </div>
                          <img src="./assets/icons/priority_medium.svg" alt="priority Medium Icon">

                        </div>
                        </div>
                      </div>`;
}
