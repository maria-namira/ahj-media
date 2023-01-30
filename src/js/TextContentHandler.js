import dataBase from './dataBase';
import Geolocation from './Geolocation';

export default class TextContentHandler {
  constructor(popup) {
    this.form = document.querySelector('.form');
    this.popup = popup;
    this.input = this.form.querySelector('.form__input');
    this.geoLocation = new Geolocation();

    this.onSubmit = this.onSubmit.bind(this);
    this.form.addEventListener('submit', this.onSubmit);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.input.value) {
      this.hideRedPlaceholder();
      const content = this.input.value;
      const promise = this.geoLocation.getLocation();
      promise.then((data) => {
        if (data.success) {
          dataBase.add(content, data);
          this.input.value = '';
        } else {
          this.popup.show(data);
        }
      });
    } else {
      this.showRedPlaceholder('Введите пожалуйста сообщение');
    }
  }

  showRedPlaceholder(text) {
    this.input.classList.add('red');
    this.input.placeholder = text;
  }

  hideRedPlaceholder() {
    this.input.className = 'form__input';
    this.input.placeholder = 'Введите сообщение';
  }
}