class Validator {
  _form;
  _inputs;
  constructor(form) {
    this._form = form;
    this._inputs = Array.from(this._form.elements);
    this.validateForm = this.validateForm.bind(this);
  }

  validateForm() {
    this._inputs.forEach((input) => {
      if (!input.disabled) {
        const messageField = input.closest('label')?.querySelector('.js-error-message');
        switch (input.getAttribute('type')) {
          case 'text':
            if (!input.value) {
              this._invalidateInput(input, messageField, 'Please select station');
            } else {
              this._revalidateInput(input, messageField);
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

  _invalidateInput(input, messageField, message) {
    if (!input.classList.contains('invalid')) input.classList.add('invalid');
    if (messageField) messageField.textContent = message;
  }

  _revalidateInput(input, messageField) {
    input.classList.remove('invalid');
    if (messageField) messageField.textContent = '';
  }
}
