export function createAlert(content, type, code, message) {
    const alertsBox = document.getElementById("alertsBox");
  
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert");
    alertDiv.classList.add(type); // Ajoute le type de classe (info, error, etc.)
  
    // Créer une barre de progression
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
  
    // Ajouter le contenu du message et la barre de progression
    alertDiv.innerHTML = `Error ${code}: ${content} - ${message}`;
    alertDiv.appendChild(progressBar);
    
    // Ajouter l'alerte à la boîte d'alertes
    alertsBox.appendChild(alertDiv);
  
    // Initialiser le temps restant pour la barre de progression
    let timeLeft = 5; // 5 secondes
    const interval = setInterval(() => {
      timeLeft -= 0.1; 
      progressBar.style.width = `calc(${(timeLeft / 5) * 100}% + 8px)`; 
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        alertDiv.classList.add('fade-out'); // Ajoute la classe fade-out pour l'animation de disparition
        setTimeout(() => {
          alertsBox.removeChild(alertDiv); // Retirer l'alerte après la fin de l'animation
        }, 500); // Attendre la fin de l'animation avant de retirer
      }
    }, 100); 
  
    // Appliquer l'animation pour faire apparaître la div depuis l'extérieur de l'écran
    setTimeout(() => {
      alertDiv.classList.add('show');
    }, 10); // Ajouter la classe "show" presque immédiatement après l'ajout
  
  }
  