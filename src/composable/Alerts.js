export function createAlert(content, type, code, message) {
    const alertsBox = document.getElementById("alertsBox");
  
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert");
  
    const emoji = type === "info" ? "✅" : type === "fail" ? "❌" : "";
  
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
  
    alertDiv.innerHTML = `Error ${code} ${emoji} ${content} ${message}`;
    
    alertDiv.appendChild(progressBar);
  
    alertsBox.appendChild(alertDiv);
  
    let timeLeft = 5; 
    const interval = setInterval(() => {
      timeLeft -= 0.1; 
      progressBar.style.backgroundColor = 'black'
      progressBar.style.height = '6px'
      progressBar.style.width = `${(timeLeft / 5) * 100}%`; 
      if (timeLeft <= 0) {
        clearInterval(interval); 
        alertsBox.removeChild(alertDiv); 
      }
    }, 100); 
  }
  