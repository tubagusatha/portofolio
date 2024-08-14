const body = document.querySelector("body");

window.addEventListener("scroll", () => {
  if (window.scrollY >  750 ) {
    body.classList.add("bodyscroll");
  } else {
    body.classList.remove("bodyscroll");
  }
});

 
const navbar = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 680) {
    navbar.classList.add("navscroll");
  } else {
    navbar.classList.remove("navscroll");
  }
});


const showMenu = (toggleId, navId) =>{
  const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

  toggle.addEventListener('click', () =>{
      // Add show-menu class to nav menu
      nav.classList.toggle('show-menu')

      // Add show-icon to show and hide the menu icon
      toggle.classList.toggle('show-icon')
  })
}

showMenu('nav-toggle','nav-menu')


window.addEventListener('scroll', function() {
  const description = document.querySelector('.description');
  const descriptionPosition = description.getBoundingClientRect().top;
  const screenPosition = window.innerHeight;

  if (descriptionPosition < screenPosition) {
    description.classList.add('scrolled');
  } else {
    description.classList.remove('scrolled');
  }
});




const cards = document.querySelectorAll(".card");
let currentCard = 0;

function showNextCard() {
  cards[currentCard].classList.remove("inactive");
  currentCard = (currentCard + 1) % cards.length;
  cards[currentCard].classList.add("inactive");
}

// Tampilkan kartu pertama saat halaman dimuat
showNextCard();

// Set interval untuk mengganti kartu setiap beberapa detik
setInterval(showNextCard, 2000); // Ganti setiap 5 detik (sesuaikan sesuai kebutuhan)
