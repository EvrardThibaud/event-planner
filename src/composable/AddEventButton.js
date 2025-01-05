document.addEventListener('DOMContentLoaded', () => {
    const stickyElement = document.getElementById('buttonOpenAddEventForm');
    const footer = document.querySelector('footer');
  
    function handleScroll() {
      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
  
      if (footerTop <= viewportHeight) {
        stickyElement.style.transform = `translateY(-${viewportHeight - footerTop}px) translateX(-50%) `;
      } else {
        stickyElement.style.transform = 'translateY(0) translateX(-50%)';
      }
    }
  
    window.addEventListener('scroll', handleScroll);
  });
  