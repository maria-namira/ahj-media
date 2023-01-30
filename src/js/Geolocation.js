export default class Geolocation {
  constructor() {
    this.options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };
    this.coords = null;
    this.errorInfo = null;

    this.succesHandler = this.succesHandler.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
  }

  getLocation() {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(this.succesHandler(position)),
          (error) => resolve(this.errorHandler(error)),
        );
      } else {
        this.errorInfo = {
          success: false,
          title: 'Ваш браузер не поддерживает геолокацию',
          description: 'К сожалению, нам не удалось определить ваше местоположение, смените браузер, либо введите координаты вручную.',
        };
        resolve(this.errorInfo);
      }
    });
  }

  succesHandler(position) {
    this.errorInfo = null;
    const { latitude, longitude } = position.coords;
    this.coords = {
      success: true,
      latitude: +latitude.toFixed(5),
      longitude: +longitude.toFixed(5),
    };
    return this.coords;
  }

  errorHandler(error) {
    this.coords = null;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.errorInfo = {
          success: false,
          title: 'Настройки текущего браузера запрещают определение вашего местоположения',
          description: 'К сожалению, нам не удалось определить ваше местоположение, потому что у страницы не было на это разрешения, нажмите кнопку "отмена", затем измените настройки конфидициальности в текущем браузере и повторите попытку, либо введите координаты вручную',
        };
        break;
      case error.POSITION_UNAVAILABLE:
        this.errorInfo = {
          success: false,
          title: 'Информация о вашем текущем местоположении недоступна',
          description: 'К сожалению, нам не удалось определить ваше местоположение, потому что один или несколько внутренних источников местоположения вернули внутреннюю ошибку, нажмите кнопку "отмена" и повторите попытку, либо введите координаты вручную',
        };
        break;
      case error.TIMEOUT:
        this.errorInfo = {
          success: false,
          title: 'Истекло время ожидания',
          description: 'К сожалению, нам не удалось определить ваше местоположение, поскольку информация о геолокации не была получена в отведенное время, нажмите кнопку "отмена" и повторите попытку, либо введите координаты вручную',
        };
        break;
      default:
        this.errorInfo = {
          success: false,
          title: 'Произошла неизвестная ошибка',
          description: 'К сожалению, нам не удалось определить ваше местоположение, нажмите кнопку "отмена" и повторите попытку, либо введите координаты вручную',
        };
    }
    return this.errorInfo;
  }
}