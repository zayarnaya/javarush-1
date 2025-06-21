document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.js-nav-toggler');
  const nav = document.querySelector('.js-header-nav');

  // переключаем active по клику на гамбургер
  toggler.addEventListener('click', () => {
    toggleActive(toggler, nav);
  });

  // переключаем active при клике на ссылку меню
  nav.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'a') {
      toggleActive(toggler, nav);
    }
  });
});

/**
 * Переключалка класса active у элемента
 * @param {Element | Element[]} element - элемент, который переключаем
 */
function toggleActive(...elements) {
  if (!elements.length) return;
  elements.forEach((item) => item.classList.toggle('active'));
}
