document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.js-nav-toggler');
  const nav = document.querySelector('.js-header-nav');

  toggler.addEventListener('click', () => {
    toggler.classList.toggle('active');
    nav.classList.toggle('active');
  });
});
