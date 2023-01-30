import dataBase from './dataBase';

export default class Popup {
  constructor(container = document.body) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
    this.mainInput = this.container.querySelector('.form__input');
    this.sample = null;
    this.cancelBtn = null;
    this.okBtn = null;
    this.popupInput = null;
    this.popupTitle = null;
    this.popupDescription = null;

    this.onOkClick = this.onOkClick.bind(this);
    this.resetChange = this.resetChange.bind(this);
  }

  init() {
    this.creat();
    this.cancelBtn = document.querySelector('[data-name="cancel"]');
    this.okBtn = document.querySelector('[data-name="save"]');
    this.popupForm = document.querySelector('.popup__form');
    this.popupInput = document.querySelector('.popup__input');
    this.popupTitle = document.querySelector('.popup__title');
    this.popupDescription = document.querySelector('.popup__description');
    this.popupLabel = document.querySelector('.popup__label');

    this.popupForm.addEventListener('submit', (e) => e.preventDefault());
    this.cancelBtn.addEventListener('click', () => this.hide());
    this.okBtn.addEventListener('click', this.onOkClick);
  }

  onOkClick() {
    if (this.popupInput.value) {
      if (Popup.checkPopupInput(this.popupInput.value)) {
        this.hideRedPlaceholder();
        const content = this.mainInput.value;
        const coords = Popup.formatingPopupInput(this.popupInput.value);
        dataBase.add(content, coords);
        this.mainInput.value = '';
        this.popupInput.value = '';
        this.hide();
      } else {
        this.popupInput.value = '';
        this.showRedPlaceholder('Неверный формат');
      }
    } else {
      this.showRedPlaceholder('Заполните пожалуйста это поле');
    }
  }

  showRedPlaceholder(text) {
    this.popupInput.classList.add('red');
    this.popupInput.placeholder = text;
  }

  hideRedPlaceholder() {
    this.popupInput.className = 'popup__input';
    this.popupInput.placeholder = 'Введите координаты';
  }

  static formatingPopupInput(string) {
    const arr = string
      .replace(/^\[/, '')
      .replace(/\]$/, '')
      .split(',');
    return {
      latitude: +arr[0],
      longitude: +arr[1].replace(/^ /, ''),
    };
  }

  static checkPopupInput(string) {
    const regex = /^\[?-?\d{1,2}(\.\d{1,5})?,\s?-?\d{1,2}(\.\d{1,5})?\]?$/;
    return regex.test(string);
  }

  static get markUP() {
    return `<div class="popup__body">
     <div class="popup__content">
      <h3 class="popup__title add"></h3>
      <div class="popup__description"></div>
      <form name="adding" class="popup__form" novalidate="">
        <label class="popup__label">
          <div class="popup__name">Широта и долгота через запятую:</div>
          <input name="title" id="title" type="text" class="popup__input" required="" placeholder="Введите координаты">
        </label>
        <div class="popup__buttons">
          <button name="save" data-name="save" class="button">Ok</button>
          <button name="cancel" data-name="cancel" class="button">Отмена</button>
        </div>
      </form>
    </div>
  </div>`;
  }

  creat() {
    this.sample = document.createElement('div');
    this.sample.className = 'popup';
    this.sample.innerHTML = Popup.markUP;
    this.container.appendChild(this.sample);
  }

  show(data) {
    if (data) {
      this.popupTitle.textContent = data.title;
      this.popupDescription.textContent = data.description;
      this.sample.classList.add('open');
    }
  }

  changePopup() {
    this.okBtn.classList.add('d_none');
    this.cancelBtn.classList.add('green');
    this.cancelBtn.textContent = 'OK';
    this.popupLabel.classList.add('d_none');
  }

  resetChange() {
    this.okBtn.className = 'button';
    this.cancelBtn.className = 'button';
    this.cancelBtn.textContent = 'Отмена';
    this.popupLabel.className = 'popup__label';
  }

  hide() {
    this.sample.classList.remove('open');
    setTimeout(() => {
      this.popupInput.value = '';
      this.popupTitle.textContent = '';
      this.popupDescription.textContent = '';
      this.resetChange();
    }, 500);
  }
}