function templateSummary() {
    return `
      <div class="summary_main">
          <div class="summary_header">
            <h1 class="summary_title">Join 360</h1>
            <div class="line"></div>
            <span class="summary_header_span">Key Metrics at a Glance</span>
            <div class="line_mobile"></div>
          </div>
          <div class="info_main">
            <div class="check_pencil">
              <a class="check_pencil_area" href="add_task.html">
                <div class="circle_pencil_check">
                  <svg class="side_img_p" width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.16667 22.3332H5.03333L16.5333 10.8332L14.6667 8.9665L3.16667 20.4665V22.3332ZM22.2333 8.89984L16.5667 3.29984L18.4333 1.43317C18.9444 0.922059 19.5722 0.666504 20.3167 0.666504C21.0611 0.666504 21.6889 0.922059 22.2 1.43317L24.0667 3.29984C24.5778 3.81095 24.8444 4.42761 24.8667 5.14984C24.8889 5.87206 24.6444 6.48873 24.1333 6.99984L22.2333 8.89984ZM20.3 10.8665L6.16667 24.9998H0.5V19.3332L14.6333 5.19984L20.3 10.8665Z" />
                  </svg>
                </div>
                <div class="side_info">
                  <span class="side_number">1</span>
                  <span class="under_task_word">To-do</span>
                </div>
              </a>
              <a class="check_pencil_area" href="add_task.html">
                <div class="circle_pencil_check">
                  <svg class="side_img_c" width="38" height="30" viewBox="0 0 38 30" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.02832 15.0001L15.2571 26.0662L33.9717 3.93408" stroke-width="7" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="side_info">
                  <span class="side_number">1</span>
                  <span class="under_task_word">done</span>
                </div>
              </a>
            </div>
            <a class="date" href="add_task.html">
              <div class="date_area">
                <img class="side_img" src="./assets/icons/orange_arrow.svg" alt="">
                <div class="side_info">
                  <span class="side_number">1</span>
                  <span class="under_task_word">Urgent</span>
                </div>
              </div>
              <div class="date_line">
                <div class="date_line_color"></div>
              </div>
              <div class="date_area">
                <div class="side_info">
                  <span class="date_number">October 16, 2022</span>
                  <span class="under_task_word">Upcoming Deadline</span>
                </div>
              </div>
            </a>
            <div class="under_task">
              <a class="under_task_area" href="add_task.html">
                <div class="side_info">
                  <span class="side_number">5</span>
                  <span class="under_task_word">Tasks in <br> board</span>
                </div>
              </a>
              <a class="under_task_area" href="">
                <div class="side_info">
                  <span class="side_number">2</span>
                  <span class="under_task_word">Tasks in <br> Progress</span>
                </div>
              </a>
              <a class="under_task_area" href="add_task.html">
                <div class="side_info">
                  <span class="side_number">2</span>
                  <span class="under_task_word">Tasks in <br> Feedback</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="greetings">
          <span class="morning">Good morning,</span>
          <span class="user_name">Sofia Müller</span>
        </div>`
}