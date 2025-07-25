class Calendar {
  _today;
  year;
  month;
  months = [];
  monthLeftIndex;
  maxLeftIndex;
  monthsDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  departureDate;
  returnDate;
  departInput;
  returnInput;
  day = 1000 * 60 * 60 * 24;
  template;
  wrapper;
  nextBtn;
  prevBtn;
  resetBtn;
  applyBtn;
  form;
  isOneWay;
  isMobile;
  isTablet;

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
    this.month = this._today.getMonth();
    this.months.push(this.month + 1, this._incrementMonth(this.month + 1));
    this.monthLeftIndex = 0;
    this.maxLeftIndex = options?.max ?? 15;
    this.departInput = document.querySelector(departSelector);
    this.returnInput = document.querySelector(returnSelector);
    this.departureDate = this.departInput.value;
    this.returnDate = this.returnInput.value;
    this.monthsDays[2] = this._getDaysInFebruary(this.year);

    const field = document.querySelector('.js-calendar-field');
    this.template = field.cloneNode(true);

    this.init = this.init.bind(this);
    this.slideToNext = this.slideToNext.bind(this);
    this.slideToPrev = this.slideToPrev.bind(this);
    this._slide = this._slide.bind(this);
    this.setDepartureDate = this.setDepartureDate.bind(this);
    this.setReturnDate = this.setReturnDate.bind(this);
    this.reset = this.reset.bind(this);
    this.apply = this.apply.bind(this);
    this.setIsOneWay = this.setIsOneWay.bind(this);

    this.wrapper = document.querySelector('.js-main');
    this.nextBtn = document.querySelector('.js-next');
    this.prevBtn = document.querySelector('.js-prev');
    this.resetBtn = document.querySelector('.js-reset');
    this.applyBtn = document.querySelector('.js-apply');
    this.form = document.querySelector('.js-calendar-form');

    this.isOneWay = this.returnInput.hasAttribute('disabled');
    this.isMobile = window.innerWidth < 768;
    this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;

    document.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;
    });
  }

  /**
   * Публичный метод, доступный из инстанса
   * Устанавливает значение флага "поездка в одну сторону"
   * @param {boolean} flag - true, если это поездка в одну сторону
   */

  setIsOneWay(flag) {
    this.isOneWay = flag;
  }

  /**
   * Прибавляет месяц, если месяц больше 12 - обнуляет и прибавляет год
   * @param {number} month - номер месяца (1-indexed)
   * @returns {number} - номер следующего месяца (1-indexed)
   */

  _incrementMonth(month) {
    // плохо что два дела делаются
    let res = ++month > 12 ? 1 : month;
    if (res === 1) this.year++;
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
    this.resetBtn.addEventListener('click', this.reset);
    this.applyBtn.addEventListener('click', this.apply);
    this.form.addEventListener('click', (e) => {
      if (e.target?.classList?.contains('js-day')) {
        const { date } = e.target?.dataset;
        if (!!this.departureDate && date === this.departureDate) {
          this.setDepartureDate('');
        } else if (!!this.returnDate && date === this.returnDate) {
          this.setReturnDate('');
        } else if (!this.departureDate || this.isOneWay) {
          this.setDepartureDate(date);
        } else if (!this.returnDate && !this.isOneWay) {
          this.setReturnDate(date);
        } else {
          if (!!this.departureDate && date > this.departureDate) {
            this.setReturnDate(date);
          } else {
            this.setDepartureDate(date);
          }
        }
      }
    });
  }

  /**
   * Генерирует и рендерит следующий месяц,
   * выключает кнопку перелистывания, если достигнут лимит
   */

  _makeNextMonth() {
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
  }

  /**
   * Модифицирует индекс на предмет сколько месяцев отсчитать обратно
   */

  _countPrevMonth() {
    if (this.monthLeftIndex >= this.maxLeftIndex) {
      this.nextBtn.removeAttribute('disabled');
    }
    this.monthLeftIndex--;
    if (this.monthLeftIndex === 0) {
      this.prevBtn.setAttribute('disabled', true);
    }
  }

  /**
   * Публичный метод, доступен из инстанса
   * Перелистывает календарь вперед
   */

  slideToNext() {
    this._makeNextMonth();
    if (this.isMobile) this._makeNextMonth();

    this._slide();
  }

  /**
   * Публичный метод, доступен из инстанса
   * Перелистывает календарь назад
   */

  slideToPrev() {
    this._countPrevMonth();
    if (this.isMobile) this._countPrevMonth();
    this._slide();
  }

  /**
   * Вспомогательный метод
   * Перелистывает календарь
   */

  _slide() {
    const { width } = document.querySelector('.js-calendar-field').getBoundingClientRect();
    const gap = this.isTablet ? 24 : this.isMobile ? 0 : 32;
    const shift = this.isMobile ? Math.floor(this.monthLeftIndex / 2) : this.monthLeftIndex;
    this.wrapper?.setAttribute('style', `left: -${shift * (width + gap)}px`);
  }

  /**
   * Создает элемент календаря на месяц (потом его надо вставить в документ)
   * @param {number} year - год для формирования календаря
   * @param {number} month - номер месяца для формирования календаря (1-indexed)
   * @returns {Element} - нода календаря на месяц
   */

  _makeMonthCalendarNode(year, month) {
    const node = this.template.cloneNode(true); // клонируем шаблон месяца
    const date = new Date(`${year}-${month}-01`); // создаем объект даты первого дня месяца

    // выносим название месяца в заголовок
    node.querySelector('.js-legend').textContent = `${date.toLocaleDateString('en', { month: 'long' })} ${year}`;

    // определяем день недели для первого дня месяца
    const startDayIndex = date.getDay() > 0 ? date.getDay() : 6;

    // собираем матрицу с датами
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

    // формируем из матрицы дат календарик
    let html = '';
    for (let i = 0; i < monthMatrix.length; i++) {
      let inner = '<div class="calendar__row calendar__week">';
      for (let k = 0; k < 7; k++) {
        inner += monthMatrix[i][k]
          ? `<button type="button" class="calendar__day js-day" data-date="${year}-${this._numberToTwoDigits(month)}-${this._numberToTwoDigits(monthMatrix[i][k])}">${monthMatrix[i][k]}</button>`
          : `<button type="button" class="calendar__day empty" disabled></button>`;
      }
      html = html + inner + '</div>';
    }

    // вставляем html календарика
    node.querySelector('.js-calendar-grid').innerHTML += html;

    // если это текущий месяц, то ставим disabled на кнопки с датами раньше, чем сегодня
    if (month === this.month + 1) {
      const minDate = this._today.toISOString().slice(0, 10);
      for (let day of node.querySelectorAll('.js-day')) {
        if (day.dataset.date < minDate) {
          day.setAttribute('disabled', true);
        } else break;
      }
    }
    return node;
  }

  /**
   * Трансформирует число в двухциферную строку и досыпает нулей, если цифр не хватает
   * @param {number} number
   * @returns {number} число в формате 2 цифр
   */

  _numberToTwoDigits(number) {
    return number.toLocaleString('en', {
      minimumIntegerDigits: 2,
    });
  }

  /**
   * Публичный метод. Устанавливает дату отбытия
   * @param {string} date - дата в формате "yyyy-mm-dd"
   */

  setDepartureDate(date) {
    const prevDate = this.departureDate;
    this._deselectDate(prevDate);
    this.departureDate = date;
    this._selectDate(date);

    if (!!this.departureDate && !!this.returnDate && this.departureDate > this.returnDate) {
      [this.departureDate, this.returnDate] = [this.returnDate, this.departureDate];
    }

    if (!this.isOneWay && !!this.departureDate && !!this.returnDate) {
      this.highlight();
    } else {
      this.removeHighlight();
    }
  }

  /**
   * Публичный метод. Устанавливает дату возвращения
   * @param {string} date - дата в формате "yyyy-mm-dd"
   */

  setReturnDate(date) {
    const prevDate = this.returnDate;
    this._deselectDate(prevDate);
    this.returnDate = date;
    this._selectDate(date);

    if (!!this.departureDate && !!this.returnDate && this.departureDate > this.returnDate) {
      [this.departureDate, this.returnDate] = [this.returnDate, this.departureDate];
    }

    if (!this.isOneWay && !!this.departureDate && !!this.returnDate) {
      this.highlight();
    } else {
      this.removeHighlight();
    }
  }

  /**
   * Отмечает дату в календаре
   * @param {string} date - дата в формате "yyyy-mm-dd"
   * @returns
   */

  _selectDate(date) {
    if (!date) return;
    document.querySelector(`[data-date="${date}"`)?.classList.add('selected');
  }

  /**
   * "Развыбирает" дату в календаре
   * @param {string} date - дата в формате "yyyy-mm-dd"
   * @returns void
   */

  _deselectDate(date) {
    if (!date) return;
    document.querySelector(`[data-date="${date}"`)?.classList.remove('selected');
  }

  /**
   * Сбрасывает выбор дат
   */
  // решила не делать сброс из инпутов
  reset() {
    this.setReturnDate('');
    this.setDepartureDate('');
    const days = document.querySelectorAll('.js-day');
    days.forEach((day) => day.classList.remove('selected'));
  }

  /**
   * Применяет изменения и закрывает всплывашку
   * Публичный метод
   */

  apply() {
    const changeEvent = new Event('change', { bubbles: true });
    this.departInput.value = this.departureDate;
    this.departInput.dispatchEvent(changeEvent); // чтобы изменения отобразились текстом
    if (!this.isOneWay) {
      this.returnInput.value = this.returnDate;
      this.returnInput.dispatchEvent(changeEvent);
    }
    this.close();
  }

  /**
   * Закрывает всплывашку
   * Публичный метод
   */

  close() {
    // некрасивое, но пока так
    document.querySelector('.js-calendar').classList.add('hidden');
  }

  /**
   * Подсвечивает дате между начальной и конечной
   * Публичный метод
   */

  highlight() {
    const highlightColor = 'var(--highlight)';
    const allWeeks = Array.from(document.querySelectorAll('.calendar__week'));
    for (let week of allWeeks) {
      week.setAttribute('style', '');
    }
    const indexFrom = allWeeks.findIndex((week) => !!week.querySelector(`[data-date="${this.departureDate}"]`));
    const indexTo = allWeeks.findIndex((week) => !!week.querySelector(`[data-date="${this.returnDate}"]`));

    const { width } = document.querySelector('.js-day').getBoundingClientRect();
    const { width: rowWidth } = document.querySelector('.calendar__week').getBoundingClientRect();
    const dayFromIndex = Array.from(allWeeks[indexFrom].querySelectorAll('.calendar__day')).findIndex(
      (day) => day.dataset.date === `${this.departureDate}`,
    );
    const dayToIndex = Array.from(allWeeks[indexTo].querySelectorAll('.calendar__day')).findIndex(
      (day) => day.dataset.date === `${this.returnDate}`,
    );
    const startAbs = dayFromIndex * width + dayFromIndex * 4 + 0.5 * width;
    const startPercent = (startAbs / rowWidth) * 100;
    const endAbs = dayToIndex * width + dayToIndex * 4 + 0.5 * width + 1;
    const endPercent = (endAbs / rowWidth) * 100;
    if (indexFrom === indexTo) {
      allWeeks[indexTo].setAttribute(
        'style',
        `background: linear-gradient(to right, transparent ${startPercent}%, ${highlightColor} ${startPercent}% ${endPercent}%, transparent ${endPercent}%);`,
      );
    } else {
      allWeeks[indexFrom].setAttribute(
        'style',
        `background: linear-gradient(to right, transparent ${startPercent}%, ${highlightColor} ${startPercent}%);`,
      );
      allWeeks[indexTo].setAttribute(
        'style',
        `background: linear-gradient(to right, ${highlightColor} ${endPercent}%, transparent ${endPercent}%);`,
      );
      for (let i = indexFrom + 1; i < indexTo; i++) {
        allWeeks[i].setAttribute('style', `background-color: ${highlightColor}`);
      }
    }
  }

  /**
   * Убирает подсветку с дат
   * Публичный метод
   */

  removeHighlight() {
    const allWeeks = Array.from(document.querySelectorAll('.calendar__week'));
    for (let week of allWeeks) {
      week.setAttribute('style', '');
    }
  }
}
