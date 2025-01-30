function onloadFunc() {
  showLoadingMessage();
}

function showLoadingMessage() {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = "flex";
  setTimeout(() => {
    loadingMessage.style.width = "100px";
    loadingMessage.style.height = "50px";
    loadingMessage.style.transform = "scale(0.375) translate(100px, -150px)";
    loadingMessage.style.top = "133px"; 
    loadingMessage.style.left = "68px"; 
  }, 1000);
}

