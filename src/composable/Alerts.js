export function createAlert(content, type) {
    const alertsBox = document.getElementById("alertsBox");
  
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert");
    alertDiv.classList.add(type);
  
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    alertDiv.innerHTML = `${content}`;

    alertDiv.appendChild(progressBar);
  
    alertsBox.appendChild(alertDiv);
  
    let timeLeft = 5; 
    const intervalDuration = 10; 

    const interval = setInterval(() => {
    timeLeft -= intervalDuration / 1000; 
    progressBar.style.width = `calc(${(timeLeft / 5) * 100}% + 8px)`; 
    
    if (timeLeft <= 0) {
        clearInterval(interval);
        alertDiv.classList.remove('show');
        setTimeout(() => {
        alertsBox.removeChild(alertDiv);
        }, 500);
    }
    }, intervalDuration); 

  
    setTimeout(() => {
      alertDiv.classList.add('show');
    }, 10);
  }
  