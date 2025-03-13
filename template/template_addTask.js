function addSubtaskTemplate(subTaskInput, id) {
  return `                <div id="subTaskUnit${id}" class="input-wrapper">
                              <li id="edit${id}" class="formateList subtask-text">${subTaskInput}</li>
                              <button id="editBtn${id}" onclick="editSubtask('${id}', '${subTaskInput}')" class="editSubtask">
                                <span class="editIconSubtask"></span>
                                <span class="lineSubtask"></span>
                              </button>
                              <button id="deleteBtn${id}" onclick="deleteSubtaskAddTask('${id}')" class="deleteSubtask"></button>
                            </div>`;
}

function addInputField(id, subTaskInput) {
  return `                  <div id="editSubTaskUnit${id}" class="input-wrapper">
                                <input id="inputSubtask${id}" class="inputSubtaskEdit" type="text" id="myInput" value="${subTaskInput}">
                                  <button onclick="deleteSubtaskAddTask('${id}')" class=""> 
                                    <span class="deleteSubtaskEdit"></span>
                                    <span class="lineSubtaskEdit"></span>
                                  </button>
                                  <button onclick="acceptAddTask('${id}')" class="acceptBtn"></button>
                              </div>`;
}

function getTransformedButton() {
  return `              
        <button id="clearInput" onclick="resetButtonAddTask()" class="resetSubtaskInput"></button>
        <span class="clearSubtask"></span>
        <span class="lineSubtaskAddnewSubtask"></span>
        <button id="editBtnModal" onclick="addSubtask()" class="acceptBtnSubtask"></button>`;
}

function transformedResetButtonAddTask(subTaskCount) {
  return `              
    <input 
      type="text" 
      id="new-subtask-input" 
      placeholder="add new sub task" 
      onfocus="transformButtonAddTask('${subTaskCount}')"/>
    <button id="iconAddButton" class="iconAdd" type="button" onclick="addSubtask()"></button>`;
}

function addTaskTemplate(contact, isSelected) {
  return `
    <label class="customCheckboxContainer ${isSelected ? "checked" : ""}">
      <input type="checkbox" class="contact-checkbox" id="contact-${contact.id}" 
        name="contact-${contact.id}" value="${contact.id}" 
        ${isSelected ? "checked" : ""}>
      <div class="contact-row">
        <div class="svg-container" style="background-color: ${contact.color}">
          <span class="contact-initials">${getInitials(contact.name)}</span>
        </div>
        <span class="subtasksUnit">${contact.name}</span>
        <span class="customCheckbox"></span>
      </div>
    </label>`;
}
