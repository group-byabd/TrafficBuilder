// On sélectionne l'élément du header grâce à son ID
const header = document.getElementById('mainHeader');

// On écoute l'événement de défilement sur toute la page
window.addEventListener('scroll', () => {
  // Si l'utilisateur a défilé de plus de 50 pixels vers le bas
  if (window.scrollY > 50) {
    // On ajoute la classe 'scrolled' au header
    header.classList.add('scrolled');
  } else {
    // Sinon (si on est tout en haut), on enlève la classe 'scrolled'
    header.classList.remove('scrolled');
  }
});
 document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      item.classList.toggle("active");
    });
  });
  // Quand la page est complètement chargée
    window.addEventListener("load", function() {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500); // temps du fondu
  }, 2000); // 👉 garde le preloader visible au moins 2 secondes
});
