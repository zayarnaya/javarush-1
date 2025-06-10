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
  const calendarPopup = document.querySelector('.js-calendar');
  const dateInputs = document.querySelectorAll('.js-date');
  dateInputs.forEach((input) =>
    input.addEventListener('click', (e) => {
      const { x, y } = e.target?.getBoundingClientRect();
      const { clientX, clientY } = e;
      if (clientX <= x + 50 && clientY <= y + 50) {
        openCalendar();
      }
    }),
  );
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('js-date') && !e.target.closest('.js-calendar')) closeCalendar();
  });

  const calendar = new Calendar('.js-depart-date', '.js-return-date');
  calendar.init();

  document.querySelector('.js-next').addEventListener('click', calendar.slideToNext);

  function openCalendar() {
    if (calendarPopup.classList.contains('hidden')) {
      calendarPopup.classList.remove('hidden');
    }
  }

  function closeCalendar() {
    if (!calendarPopup.classList.contains('hidden')) {
      calendarPopup.classList.add('hidden');
    }
  }
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
  months = [];
  monthLeftIndex;
  maxLeftIndex;
  monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  departureDate;
  returnDate;
  departInput;
  returnInput;
  day = 1000 * 60 * 60 * 24;
  template;

  constructor(departSelector, returnSelector) {
    this._today = new Date();
    this.year = this._today.getFullYear();
    this.months.push(this._today.getMonth(), this.incrementMonth(this._today.getMonth()));
    this.monthLeftIndex = 0;
    this.maxLeftIndex = 22;
    this.departInput = document.querySelector(departSelector);
    this.returnInput = document.querySelector(returnSelector);
    this.departureDate = this.departInput.value;
    this.returnDate = this.returnInput.value;
    this.monthsDays[1] = this.getDaysInFebruary(this.year);
    const field = document.querySelector('.js-calendar-field');
    this.template = field.cloneNode(true);
    this.slideToNext = this.slideToNext.bind(this);
  }

  incrementMonth(month) {
    // плохо что два дела делаются
    let res = ++month > 11 ? 0 : month;
    if (!res) this.year++;
    return res;
  }

  decrementMonth(month) {
    return --month < 0 ? 11 : month;
  }

  getDaysInFebruary(year) {
    let date = new Date(`${year}-28-02`).getTime();
    date += this.day;
    return new Date(date).getMonth() === 1 ? 29 : 28;
  }

  init() {
    const wrapper = document.querySelector('.js-main');
    wrapper.innerHTML = '';
    wrapper.appendChild(this.makeMonthCalendarNode(this.year, this.months[0]));
    wrapper.appendChild(this.makeMonthCalendarNode(this.year, this.months[1]));
    wrapper.setAttribute('style', 'left: 0');
  }

  slideToNext() {
    this.months.push(this.incrementMonth(this.months.at(-1)));
    this.monthLeftIndex++;
    const wrapper = document.querySelector('.js-main');
    wrapper.appendChild(this.makeMonthCalendarNode(this.year, this.months.at(-1)));
    this.slideRight();
  }

  slideRight() {
    const { width } = document.querySelector('.js-calendar-field').getBoundingClientRect();
    const gap = 32;
    const wrapper = document.querySelector('.js-main');
    wrapper?.setAttribute('style', `left: -${this.monthLeftIndex * (width + gap)}px`);
  }

  makeMonthCalendarNode(year, month) {
    const node = this.template.cloneNode(true);
    const date = new Date(`${year}-${month + 1}-01`);
    node.querySelector('.js-legend').textContent = `${date.toLocaleDateString('en', { month: 'long' })} ${year}`;
    const startDayIndex = date.getDay() > 0 ? date.getDay() : 6;
    const monthMatrix = [];
    let index = 1;
    for (let i = 0; i < 7; i++) {
      const row = [];
      for (let k = 0; k < 7; k++) {
        if (i === 0 && k < startDayIndex) row.push(null);
        else if (index > this.monthsDays[month]) row.push(null);
        else row.push(index++);
      }
      monthMatrix.push(row);
      if (index > this.monthsDays[month]) break;
    }

    let html = '';
    for (let i = 0; i < monthMatrix.length; i++) {
      let inner = '<div class="calendar__row calendar__week">';
      for (let k = 0; k < 7; k++) {
        inner += monthMatrix[i][k]
          ? `<button type="button" class="calendar__day">${monthMatrix[i][k]}</button>`
          : `<button type="button" class="calendar__day empty" disabled></button>`;
      }
      html = html + inner + '</div>';
    }
    node.querySelector('.js-calendar-grid').innerHTML += html;
    return node;
  }
}
