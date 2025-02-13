function addSubtaskTemplate(subTaskInput, id) {
    return `                <div id="subTaskUnit${id}" class="input-wrapper">
                              <li id=edit${id} class="formateList">${subTaskInput}</li>
                              <button onclick="editSubtask('${id}')" class="editSubtask">
                                <span class="editIconSubtask"></span>
                                <span class="lineSubtask"></span>
                              </button>
                              <button onclick="deleteSubtask('${id}')" class="deleteSubtask"></button>
                            </div>`;
  }