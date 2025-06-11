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
  // открываем календарь при клике в область календарика
  const calendarPopup = document.querySelector('.js-calendar');
  const dateInputs = document.querySelectorAll('.js-date');
  dateInputs.forEach((input) =>
    input.addEventListener('click', (e) => {
      const { x, y } = e.target?.getBoundingClientRect();
      const { clientX, clientY } = e;
      if (clientX <= x + 50 && clientY <= y + 50) {
        showElement(calendarPopup);
      }
    }),
  );

  // закрываем календарь при клике на любую область страницы, кроме инпутов даты
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('js-date') && !e.target.closest('.js-calendar')) hideElement(calendarPopup);
  });

  // инициализируем календарь
  const calendar = new Calendar('.js-depart-date', '.js-return-date');
  calendar.init();
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
 * Включает видимость элемента
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
  wrapper;
  nextBtn;
  prevBtn;

  /**
   * Конструктор
   * @param {string} departSelector - селектор инпута даты отбытия
   * @param {string} returnSelector - селектор инпута даты прибытия
   * @param {Record<string, any>} options - дополнительные опции:
   * max - максимальное количество месяцев
   */

  constructor(departSelector, returnSelector, options) {
    this._today = new Date();
    this.year = this._today.getFullYear();
    this.months.push(this._today.getMonth(), this._incrementMonth(this._today.getMonth()));
    this.monthLeftIndex = 0;
    this.maxLeftIndex = options?.max ?? 15;
    this.departInput = document.querySelector(departSelector);
    this.returnInput = document.querySelector(returnSelector);
    this.departureDate = this.departInput.value;
    this.returnDate = this.returnInput.value;
    this.monthsDays[1] = this._getDaysInFebruary(this.year);

    const field = document.querySelector('.js-calendar-field');
    this.template = field.cloneNode(true);

    this.init = this.init.bind(this);
    this.slideToNext = this.slideToNext.bind(this);
    this.slideToPrev = this.slideToPrev.bind(this);
    this._slide = this._slide.bind(this);

    this.wrapper = document.querySelector('.js-main');
    this.nextBtn = document.querySelector('.js-next');
    this.prevBtn = document.querySelector('.js-prev');
  }

  /**
   * Прибавляет месяц, если месяц больше 12 - обнуляет и прибавляет год
   * @param {number} month - номер месяца (0-indexed)
   * @returns {number} - номер следующего месяца (0-indexed)
   */

  _incrementMonth(month) {
    // плохо что два дела делаются
    let res = ++month > 11 ? 0 : month;
    if (!res) this.year++;
    return res;
  }

  /**
   * Вычисляет количество дней в феврале года
   * @param {number} year - год для вычисления
   * @returns {number} - количество дней в феврале переданного года
   */

  _getDaysInFebruary(year) {
    let date = new Date(`${year}-28-02`).getTime();
    date += this.day;
    return new Date(date).getMonth() === 1 ? 29 : 28;
  }

  /**
   * Публичный метод, доступен из инстанса
   * Инициализирует календарь
   */

  init() {
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(this._makeMonthCalendarNode(this.year, this.months[0]));
    this.wrapper.appendChild(this._makeMonthCalendarNode(this.year, this.months[1]));
    this.wrapper.setAttribute('style', 'left: 0');
    this.nextBtn.addEventListener('click', this.slideToNext);
    this.prevBtn.addEventListener('click', this.slideToPrev);
  }

  /**
   * Публичный метод, доступен из инстанса
   * Перелистывает календарь вперед
   */

  slideToNext() {
    if (this.monthLeftIndex === 0) {
      this.prevBtn.removeAttribute('disabled');
    }
    this.monthLeftIndex++;
    if (this.months.length - 1 === this.monthLeftIndex && this.monthLeftIndex <= this.maxLeftIndex) {
      this.months.push(this._incrementMonth(this.months.at(-1)));
    }
    if (this.monthLeftIndex >= this.maxLeftIndex) {
      this.nextBtn.setAttribute('disabled', true);
    }

    this.wrapper.appendChild(this._makeMonthCalendarNode(this.year, this.months.at(-1)));
    this._slide();
  }

  /**
   * Публичный метод, доступен из инстанса
   * Перелистывает календарь назад
   */

  slideToPrev() {
    if (this.monthLeftIndex >= this.maxLeftIndex) {
      this.nextBtn.removeAttribute('disabled');
    }
    this.monthLeftIndex--;
    if (this.monthLeftIndex === 0) {
      this.prevBtn.setAttribute('disabled', true);
    }
    this._slide();
  }

  /**
   * Вспомогательный метод
   * Перелистывает календарь
   */

  _slide() {
    const { width } = document.querySelector('.js-calendar-field').getBoundingClientRect();
    const gap = 32;
    this.wrapper?.setAttribute('style', `left: -${this.monthLeftIndex * (width + gap)}px`);
  }

  /**
   * Создает элемент календаря на месяц (потом его надо вставить в документ)
   * @param {number} year - год для формирования календаря
   * @param {number} month - номер месяца для формирования календаря (0-indexed)
   * @returns {Element} - нода календаря на месяц
   */

  _makeMonthCalendarNode(year, month) {
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
