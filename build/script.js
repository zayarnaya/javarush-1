document.addEventListener('DOMContentLoaded', () => {
  // устанавливаем год в футере
  setCopyrightYear('js-copyright');

  // инициализируем календарь
  const calendar = new Calendar('.js-depart-date', '.js-return-date');
  calendar.init();

  document.querySelector('.js-depart-date').addEventListener('change', (e) => {
    calendar.setDepartureDate(e.currentTarget.value);
  });
  document.querySelector('.js-return-date').addEventListener('change', (e) => {
    calendar.setReturnDate(e.currentTarget.value);
  });

  // закрываем календарь при клике на любую область страницы, кроме инпутов даты
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('js-date') && !e.target.closest('.js-calendar')) hideElement(calendarPopup);
  });

  // инициализируем валидатор формы
  const form = document.querySelector('.js-tickets-form');
  const validator = new Validator(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    validator.validateForm();
    if (form.classList.contains('invalid')) {
      return;
    } else {
      window.location.pathname = form.getAttribute('action');
    }
  });
  for (let input of form.querySelectorAll('input[type="text"]')) {
    input.addEventListener('focus', (e) => {
      if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
    });
  }
  for (let input of form.querySelectorAll('input[type="date"]')) {
    input.addEventListener('focus', (e) => {
      if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
    });
  }

  // Обработчики поля настроек поездки
  const radioGroup = document.querySelector('.js-radio-group');
  const departDate = document.querySelector('.js-depart-date');
  const returnDate = document.querySelector('.js-return-date');

  // отключаем выбор даты возвращения, если поездка в одну сторону
  // и включаем, если в обе
  radioGroup.addEventListener('change', (e) => {
    toggleReturnDateInput(e, returnDate);
    calendar.setIsOneWay(!!document.getElementById('one-way')?.checked);
  });

  // устанавливаем минимальную дату
  // update: путаница в форматах, обойдемся
  // сделаем кастомную валидацию
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
  // открываем календарь при клике в область календарика
  const calendarPopup = document.querySelector('.js-calendar');
  const dateInputs = document.querySelectorAll('.js-date');

  dateInputs.forEach((input) =>
    input.addEventListener('click', (e) => {
      const { x, y } = e.target?.getBoundingClientRect();
      const { clientX, clientY } = e;
      if (clientX <= x + 50 && clientY <= y + 50) {
        e.currentTarget.blur();
        showElement(calendarPopup);
      }
    }),
  );

  // меняем отображение выбранной даты

  dateInputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      console.log(e.currentTarget.value);
      const date = new Date(e.currentTarget.value).toLocaleDateString('en-GB', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
      });
      if (date.toLowerCase() !== 'invalid date') input.setAttribute('data-appearance', date);
    });
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
 * Включает видимость элемента
 * @param {Element} element - выбранный элемент
 */

function showElement(element) {
  if (element.classList.contains('hidden')) {
    element.classList.remove('hidden');
  }
}

/**
 * Выключает видимость элемента
 * @param {Element} element - выбранный элемент
 */

function hideElement(element) {
  if (!element.classList.contains('hidden')) {
    element.classList.add('hidden');
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
