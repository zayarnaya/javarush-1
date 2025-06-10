document.addEventListener('DOMContentLoaded', () => {
  // устанавливаем год в футере
  setCopyrightYear('js-copyright');

  const radioGroup = document.querySelector('.js-radio-group');
  const departDate = document.querySelector('.js-depart-date');
  const returnDate = document.querySelector('.js-return-date');

  // отключаем выбор даты возвращения, если поездка в одну сторону
  // и включаем, если в обе
  radioGroup.addEventListener('change', (e) => toggleReturnDateInput(e, returnDate));

  // устанавливаем минимальную дату
  const today = getTodayDate();
  setMinDate(today, departDate);
  setMinDate(today, returnDate);
  // меняем минимальную дату у инпута даты возвращения, если выбрана дата отбытия
  departDate.addEventListener('change', (e) => setMinDate(e.currentTarget.value, returnDate));

  // управление количеством людей
  const incBtn = document.querySelector('.js-plus');
  const decBtn = document.querySelector('.js-minus');
  const persons = document.querySelector('.js-number');

  incBtn.addEventListener('click', () => incrementPersons(persons, decBtn));
  decBtn.addEventListener('click', () => decrementPersons(persons, decBtn));

  // инпут даты
  const depDateInput = document.querySelector('.js-depart-date');
  depDateInput.addEventListener('click', (e) => {
    const { x, y } = e.target?.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX <= x + 50 && clientY <= y + 50) {
      console.log('CALENDARRRR');
    }
  });
});

// вспомогательные функции

/**
 * Включает/отключает выбор даты возвращения
 * в зависимости от выбора поездки round или one way
 *
 * @param {Event} e - событие
 * @param {HTMLInputElement} input - элемент выбора даты (input type="date")
 * @returns ничего не возвращает
 */
function toggleReturnDateInput(e, input) {
  if (!input) return;
  if (e.target.value === 'round') {
    enableElement(input);
  } else if (e.target.value === 'one-way') {
    disableElement(input);
  }
}

/**
 * Устанавливает атрибут disabled для выбранного элемента
 * @param {Element} element - выбранный элемент
 */
function disableElement(element) {
  if (!element) return;

  element.setAttribute('disabled', true);
}

/**
 * Убирает атрибут disabled для выбранного элемента
 * @param {Element} element  - выбранный элемент
 */
function enableElement(element) {
  if (!element) return;

  if (element.hasAttribute('disabled')) {
    element.removeAttribute('disabled');
  }
}

/**
 * Возвращает строку даты для использования в выборе даты
 * @returns {string} строку даты формата yyyy-mm-dd
 */
function getTodayDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/**
 * Устанавливает минимальное значение для выбора даты
 * @param {string} date - дата в формате yyyy-mm-dd
 * @param {HTMLInputElement} input - выбранный элемент (input type="date")
 * @returns
 */
function setMinDate(date, input) {
  if (!date || !input) return;
  input.setAttribute('min', date);
}

/**
 * Добавляет количество людей
 * Снимает атрибут disabled с кнопки "минус"
 * @param {HTMLInputElement} input - инпут с количеством людей (input type="number")
 * @param {HTMLButtonElement} btn - элемент кнопки "минус"
 *
 */
function incrementPersons(input, btn) {
  if (!input) return;
  if (input.value === '1') enableElement(btn);
  input.value = +input.value + 1;
}

/**
 * Уменьшает количество людей
 * Отключает кнопку "минус" при достижении  количества "1"
 * @param {HTMLInputElement} input - инпут с количеством людей (input type="number")
 * @param {HTMLButtonElement} btn - элемент кнопки "минус"
 *
 */
function decrementPersons(input, btn) {
  if (!input) return;
  input.value = +input.value - 1;
  if (input.value === '1') disableElement(btn);
}

/**
 * Подставляет текущий год в футер
 * @param {string} classname - класс спана с годом
 * @returns {void}
 */
function setCopyrightYear(classname) {
  const year = document.querySelector('.' + classname);
  if (!year) return;
  const thisYear = new Date().getFullYear();
  if (thisYear != 2025) {
    year.textContent = `2025 - ${thisYear}`;
  }
}

class Calendar {
  _today;
  year;
  month1;
  month2;
  months = {
    1: {
      name: 'January',
      days: 31,
    },
  };
  departureDate;
  returnDate;
}
