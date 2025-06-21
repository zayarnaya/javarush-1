class Validator {
  _form;
  _inputs;

  /**
   * Конструктор валидатора формы
   * @param {Element} form - элемент формы
   */
  constructor(form) {
    this._form = form;
    this._inputs = Array.from(this._form.elements);
    this.validateForm = this.validateForm.bind(this);
  }
  /**
   * Публичный метод, доступен из инстанса
   * Проверяет форму на предмет заполнены ли станции отбытия и прибытия,
   * заполнена ли дата
   */

  validateForm() {
    let station = '';
    this._inputs.forEach((input) => {
      if (!input.disabled) {
        const messageField = input.closest('label')?.querySelector('.js-error-message');
        switch (input.getAttribute('type')) {
          case 'text':
            if (!input.value) {
              this._invalidateInput(input, messageField, 'Please select station');
            } else {
              if (!station) {
                station = input.value;
              } else if (station === input.value) {
                this._invalidateInput(input, messageField, 'Departure and arrival stations should differ');
              } else {
                this._revalidateInput(input, messageField);
              }
            }
            break;
          case 'date':
            const minDate = input.getAttribute('min');
            const maxDate = input.getAttribute('max');
            if (!input.value && !input.disabled) {
              this._invalidateInput(input, messageField, 'Please choose date');
            } else if (!!input.value && input.value < minDate) {
              this._invalidateInput(
                input,
                messageField,
                `Too early! Date should be ${new Date(maxDate).toLocaleDateString('en')} or later`,
              );
            } else if (!!input.value && input.value > maxDate) {
              this._invalidateInput(
                input,
                messageField,
                `Too late! Date should be earlier than ${new Date(maxDate).toLocaleDateString('en')}`,
              );
            } else {
              this._revalidateInput(input, messageField);
            }
        }
      }
    });
    if (this._inputs.some((input) => input.classList.contains('invalid'))) {
      if (!this._form.classList.contains('invalid')) this._form.classList.add('invalid');
    } else {
      this._form.classList.remove('invalid');
    }
  }

  /**
   * Инвалидирует инпут (ставит класс 'invalid')
   * @param {Element} input - элемент проверяемого инпута
   * @param {Element} messageField  - элемент подсказки проверяемого инпута
   * @param {string} message - сообщение для вывода
   */

  _invalidateInput(input, messageField, message) {
    if (!input.classList.contains('invalid')) input.classList.add('invalid');
    if (messageField) messageField.textContent = message;
  }

  /**
   * Снимает класс 'invalid' с инпута
   * @param {Element} input - элемент проверяемого инпута
   * @param {Element} messageField - элемент подсказки проверяемого инпута
   */

  _revalidateInput(input, messageField) {
    input.classList.remove('invalid');
    if (messageField) messageField.textContent = '';
  }
}
