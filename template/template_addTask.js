function addSubtaskTemplate(subTaskInput, id) {
  return `                <div id="subTaskUnit${id}" class="input-wrapper">
                              <li id="edit${id}" class="formateList subtask-text">${subTaskInput}</li>
                              <button id="editBtn${id}" onclick="editSubtask('${id}', '${subTaskInput}')" class="editSubtask">
                                <span class="editIconSubtask"></span>
                                <span class="lineSubtask"></span>
                              </button>
                              <button id="deleteBtn${id}" onclick="deleteSubtask('${id}')" class="deleteSubtask"></button>
                            </div>`;
}

function addInputField(id, subTaskInput) {
  return `                  <div id="editSubTaskUnit${id}" class="input-wrapper">
                                <input class="inputSubtaskEdit" type="text" id="myInput" value="${subTaskInput}">
                                  <button onclick="deleteSubtask('${id}')" class=""> 
                                    <span class="deleteSubtaskEdit"></span>
                                    <span class="lineSubtaskEdit"></span>
                                  </button>
                                  <button onclick="accept('${id}', '${subTaskInput}')" class="acceptBtn"></button>
                              </div>`;
}

function addEditTask(title, description, id) {
  return `          <div class="headerAddTaskModal">
            <p class="ModalHeadline">Add Task</p>
            <button onclick="closeModalAddTask()" type="button" class="ModalCloseButtonAddTask"></button>
        </div>
        <form class="task-form">
            <div class="side1">
              <label for="inputField">Title<span class="red">*</span></label>
              <input id="inputField" type="text" value="${title}" placeholder="Enter a title" required>
                <label for="description">Description</label>
                <textarea id="description" placeholder="Enter a Description">${description}</textarea>
                
                <label for="assigned">Assigned to</label>
                <div id="assigned" class="custom-dropdown">
                  <div id="assigned-input" class="dropdown-input custom" onclick="toggleDropdown(event)">
                      <input class="customInput" id="search-contacts" type="text" placeholder="Select contacts to assign" oninput="filterContacts()" />
                      <svg id="dropdown-icon" class="dropDown" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.29998 4.3L0.699975 1.7C0.383309 1.38333 0.312475 1.02083 0.487475 0.6125C0.662475 0.204167 0.974975 0 1.42498 0H6.57498C7.02498 0 7.33747 0.204167 7.51248 0.6125C7.68748 1.02083 7.61664 1.38333 7.29997 1.7L4.69998 4.3C4.59998 4.4 4.49164 4.475 4.37498 4.525C4.25831 4.575 4.13331 4.6 3.99998 4.6C3.86664 4.6 3.74164 4.575 3.62498 4.525C3.50831 4.475 3.39998 4.4 3.29998 4.3Z" fill="#2A3647"/>
                      </svg>
                      <svg class="dropDown-up" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.70002 0.299975L7.30002 2.89998C7.61669 3.21664 7.68752 3.57914 7.51252 3.98748C7.33752 4.39581 7.02502 4.59998 6.57502 4.59998L1.42502 4.59998C0.975025 4.59998 0.662525 4.39581 0.487525 3.98748C0.312525 3.57914 0.383358 3.21664 0.700025 2.89998L3.30002 0.299975C3.40002 0.199975 3.50836 0.124976 3.62502 0.0749755C3.74169 0.0249753 3.86669 -2.43187e-05 4.00002 -2.43187e-05C4.13336 -2.43187e-05 4.25836 0.0249753 4.37502 0.0749755C4.49169 0.124976 4.60002 0.199975 4.70002 0.299975Z" fill="#2A3647"/>
                      </svg>                                  
                  </div>
                  <div id="assigned-dropdown" class="dropdown-content">
                  </div>
              </div>
                <div id="selected-contacts" class="selected-contacts-container"></div>
                
            </div>
            <div class="divider"></div>
            <div class="side2">
              <label for="due-date">Due date <span class="red">*</span></label>
              <div class="custom-date-picker">
                <input type="date" id="due-date" name="due-date"  required>
                <!-- Dein benutzerdefiniertes Kalender-Icon -->
                <button type="button" class="calendar-icon" onclick="openDatePicker()">
                  <img src="./assets/icons/calender.svg" alt="Calendar Icon"> <!-- Dein eigenes Icon -->
                </button>
              </div>
              
                
                <label>Priority</label>
                <div class="priority">
                    <button type="button" class="urgent">Urgent
                      <svg width="21" height="16" viewBox="0 0 21 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z" fill="#FF3D00"/>
                        <path d="M19.2597 9.69733C19.0251 9.69774 18.7965 9.62289 18.6077 9.48379L10.3556 3.40063L2.10356 9.48379C1.86959 9.6566 1.57651 9.72945 1.28878 9.68633C1.00105 9.6432 0.742254 9.48762 0.569318 9.25383C0.396382 9.02003 0.323475 8.72716 0.366634 8.43964C0.409793 8.15213 0.565483 7.89352 0.799455 7.72072L9.70356 1.15024C9.89226 1.01065 10.1208 0.935303 10.3556 0.935303C10.5904 0.935303 10.819 1.01065 11.0077 1.15024L19.9118 7.72072C20.0977 7.85763 20.2356 8.04974 20.3057 8.26962C20.3759 8.4895 20.3747 8.72591 20.3024 8.94509C20.2301 9.16427 20.0904 9.35503 19.9031 9.49012C19.7159 9.62521 19.4907 9.69773 19.2597 9.69733Z" fill="#FF3D00"/>
                        </svg>
                        
                    </button>
                    <button type="button" class="medium">Medium
                      <svg width="21" height="8" viewBox="0 0 21 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.7596 7.91717H1.95136C1.66071 7.91717 1.38197 7.80087 1.17645 7.59386C0.970928 7.38685 0.855469 7.10608 0.855469 6.81332C0.855469 6.52056 0.970928 6.23979 1.17645 6.03278C1.38197 5.82577 1.66071 5.70947 1.95136 5.70947H19.7596C20.0502 5.70947 20.329 5.82577 20.5345 6.03278C20.74 6.23979 20.8555 6.52056 20.8555 6.81332C20.8555 7.10608 20.74 7.38685 20.5345 7.59386C20.329 7.80087 20.0502 7.91717 19.7596 7.91717Z" fill="white"/>
                        <path d="M19.7596 2.67388H1.95136C1.66071 2.67388 1.38197 2.55759 1.17645 2.35057C0.970928 2.14356 0.855469 1.86279 0.855469 1.57004C0.855469 1.27728 0.970928 0.996508 1.17645 0.789496C1.38197 0.582485 1.66071 0.466187 1.95136 0.466187L19.7596 0.466187C20.0502 0.466187 20.329 0.582485 20.5345 0.789496C20.74 0.996508 20.8555 1.27728 20.8555 1.57004C20.8555 1.86279 20.74 2.14356 20.5345 2.35057C20.329 2.55759 20.0502 2.67388 19.7596 2.67388Z" fill="white"/>
                        </svg>
                        
                    </button>
                    <button type="button" class="low">Low
                      <svg width="21" height="16" viewBox="0 0 21 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.8555 9.69779C10.6209 9.69819 10.3923 9.62335 10.2035 9.48427L1.30038 2.91453C1.18454 2.82898 1.0867 2.72146 1.01245 2.59812C0.938193 2.47478 0.888977 2.33803 0.867609 2.19569C0.824455 1.90821 0.897354 1.61537 1.07027 1.3816C1.24319 1.14782 1.50196 0.992265 1.78965 0.949143C2.07734 0.906021 2.3704 0.978866 2.60434 1.15165L10.8555 7.23414L19.1066 1.15165C19.2224 1.0661 19.354 1.00418 19.4938 0.969432C19.6336 0.934685 19.7788 0.927791 19.9213 0.949143C20.0637 0.970495 20.2006 1.01967 20.324 1.09388C20.4474 1.16808 20.555 1.26584 20.6407 1.3816C20.7263 1.49735 20.7883 1.62882 20.823 1.7685C20.8578 1.90818 20.8647 2.05334 20.8433 2.19569C20.822 2.33803 20.7727 2.47478 20.6985 2.59812C20.6242 2.72146 20.5264 2.82898 20.4106 2.91453L11.5075 9.48427C11.3186 9.62335 11.0901 9.69819 10.8555 9.69779Z" fill="#7AE229"/>
                        <path d="M10.8555 15.4463C10.6209 15.4467 10.3923 15.3719 10.2035 15.2328L1.30038 8.66307C1.06644 8.49028 0.910763 8.2317 0.867609 7.94422C0.824455 7.65674 0.897354 7.3639 1.07027 7.13013C1.24319 6.89636 1.50196 6.7408 1.78965 6.69768C2.07734 6.65456 2.3704 6.7274 2.60434 6.90019L10.8555 12.9827L19.1066 6.90019C19.3405 6.7274 19.6336 6.65456 19.9213 6.69768C20.209 6.7408 20.4678 6.89636 20.6407 7.13013C20.8136 7.3639 20.8865 7.65674 20.8433 7.94422C20.8002 8.2317 20.6445 8.49028 20.4106 8.66307L11.5075 15.2328C11.3186 15.3719 11.0901 15.4467 10.8555 15.4463Z" fill="#7AE229"/>
                        </svg>
                    </button>
                </div>
                <label for="custom-category">Category<span class="red">*</span></label>
                <div id="custom-category" class="custom-dropdown" onclick="toggleCategoryDropdown()">
                    <div id="category-input" class="dropdown-input paddingTop">
                        <span>Select task category</span>
                        <svg id="category-dropdown-icon" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.29998 4.3L0.699975 1.7C0.383309 1.38333 0.312475 1.02083 0.487475 0.6125C0.662475 0.204167 0.974975 0 1.42498 0H6.57498C7.02498 0 7.33747 0.204167 7.51248 0.6125C7.68748 1.02083 7.61664 1.38333 7.29997 1.7L4.69998 4.3C4.59998 4.4 4.49164 4.475 4.37498 4.525C4.25831 4.575 4.13331 4.6 3.99998 4.6C3.86664 4.6 3.74164 4.575 3.62498 4.525C3.50831 4.475 3.39998 4.4 3.29998 4.3Z" fill="#2A3647"/>
                        </svg>
                    </div>
                    <div id="category-dropdown" class="dropdown-content">
                        <div class="dropdown-option" onclick="selectCategory('Technical Task', 'technical')">Technical Task</div>
                        <div class="dropdown-option" onclick="selectCategory('User Story', 'user-story')">User Story</div>
                    </div>
                </div>
                <input type="hidden" id="category" required>                        
                
                <label for="category">Subtasks</label>
                <div class="input-wrapper">
                  <input type="text" id="new-subtask-input" placeholder="add new sub task">
                  <button class="iconAdd center" type="button" onclick="addSubtask()">
                  </button>
                </div>
                <div id="subtasks-container">
                </div>
                <p class="error-message-mobile"><span class="required">*</span> This field is required</p>
    
                
             
                  <div class="form-footer">
                    <p class="error-message"><span class="required">*</span> This field is required</p>
                    <div class="addTaskButton">
                        <button onclick="clearForm()" class="taskButton-clear ">
                            Clear <img src="assets/icons/close.svg" alt="">
                        </button> 
                        <button type="button" onclick="openEditTask(${id})" class="taskButton create">
                            Create Task <img src="assets/icons/check.svg" alt="">
                        </button>
                    </div>
                </div>
                
      </form>`;
}