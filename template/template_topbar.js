function templateTopBar(AB) {
  return ` <div class="top_bar_area">
          <img class="top_bar_logo" src="./assets/icons/join_logo_desktop.svg" alt="">
          <span class="top_bar_span">Kanban Project Management Tool</span>
          <div class="user_main">
            <a class="help_info" href="./help.html">
              <img src="./assets/icons/help.svg" alt="">
            </a>
            <button onclick="showDesktopMenu()" class="user_profil" href="">
              <span>${AB}</span>
            </button>
          </div>
        </div>
        <div id="deskMenu_content" class="dialog_main d_none">
          <div class="dialog_area">
            <a href="help.html" class="dialog_nav_help">
              <div class="dialog_links" >Help</div>
            </a>
            <div class="dialog_nav">
              <a class="dialog_links" href="legal-notice.html">Legal Notice</a>
            </div>
            <div class="dialog_nav">
              <a class="dialog_links" href="privacy-policy.html">Privacy Policy</a>
            </div>
            <div class="dialog_nav">
              <a class="dialog_links" href="login.html">Log out</a>
            </div>
          </div>
        </div>`;
}
