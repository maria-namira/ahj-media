/* eslint-disable no-console */
import dataBase from './dataBase';
import Geolocation from './Geolocation';
import Timer from './Timer';

export default class MediaContentHandler {
  constructor(popup) {
    this.popup = popup;
    this.geoLocation = new Geolocation();
    this.btnMicro = document.querySelector('.form__micro');
    this.btnVideo = document.querySelector('.form__camera');
    this.mediaControl = document.querySelector('.form__media');
    this.recordControl = document.querySelector('.form__record');
    this.btnOk = document.querySelector('.form__record-btnOK');
    this.btnCancel = document.querySelector('.form__record-btnCancel');
    this.timer = document.querySelector('.form__timer');
    this.video = document.querySelector('.form__preview-video');
    this.recorder = null;
    this.stream = null;
    this.cancel = false;
    this.timer = new Timer(document.querySelector('.form__timer'));
    this.contentType = null;

    this.onBtnOkClick = this.onBtnOkClick.bind(this);
    this.onBtnMediaClick = this.onBtnMediaClick.bind(this);
    this.onBtnCancelClick = this.onBtnCancelClick.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.dataavailable = this.dataavailable.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.btnMicro.addEventListener('click', this.onBtnMediaClick);
    this.btnVideo.addEventListener('click', this.onBtnMediaClick);
    this.btnOk.addEventListener('click', this.onBtnOkClick);
    this.btnCancel.addEventListener('click', this.onBtnCancelClick);
  }

  onBtnCancelClick() {
    this.cancel = !this.cancel;
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());
    this.timer.resetTimer();
    this.recordControl.classList.add('d_none');
    this.mediaControl.classList.remove('d_none');

    if (this.contentType === 'video') {
      this.video.classList.add('d_none');
    }

    console.log('cancel');
  }

  onBtnOkClick() {
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());

    if (this.contentType === 'video') {
      this.video.classList.add('d_none');
    }
  }

  async onBtnMediaClick(evt) {
    if (!navigator.mediaDevices) {
      this.showError(MediaContentHandler.options.mediadevices);
      return;
    }

    try {
      if (this.cancel) {
        this.cancel = !this.cancel;
      }

      if (evt.target.className === 'form__micro') {
        this.contentType = 'audio';
        this.stream = await navigator.mediaDevices.getUserMedia(
          MediaContentHandler.options.streamAudio,
        );
      }

      if (evt.target.className === 'form__camera') {
        this.contentType = 'video';
        this.stream = await navigator.mediaDevices.getUserMedia(
          MediaContentHandler.options.streamVideo,
        );
        this.video.classList.remove('d_none');
        this.video.srcObject = this.stream;
        this.video.play();
      }

      if (!window.MediaRecorder) {
        this.showError(MediaContentHandler.options.mediarecorder);
        return;
      }

      this.recorder = new MediaRecorder(this.stream);
      this.chunks = [];

      this.recorder.addEventListener('start', this.startRecord);
      this.recorder.addEventListener('dataavailable', this.dataavailable);
      this.recorder.addEventListener('stop', this.stopRecord);

      this.recorder.start();
      this.timer.startTimer();
    } catch (err) {
      this.showError(MediaContentHandler.options.access, err);
    }
  }

  showError(options, err = '') {
    this.popup.changePopup();
    this.popup.show(options);
    if (err) console.error(err);
  }

  startRecord() {
    this.recordControl.classList.remove('d_none');
    this.mediaControl.classList.add('d_none');
    console.log('recording started');
  }

  dataavailable(evt) {
    if (!this.cancel) {
      this.chunks.push(evt.data);
      console.log('data available');
    }
  }

  stopRecord() {
    if (!this.cancel) {
      const blob = new Blob(this.chunks);
      const url = URL.createObjectURL(blob);
      let content;

      if (this.contentType === 'audio') {
        content = `<audio src="${url}" controls></audio>`;
      }

      if (this.contentType === 'video') {
        content = `<video src="${url}" controls></video>`;
      }

      const promise = this.geoLocation.getLocation();
      promise.then((data) => {
        if (data.success) {
          dataBase.add(content, data);
        } else {
          this.popup.show(data);
        }
      });

      this.timer.resetTimer();
      this.recordControl.classList.add('d_none');
      this.mediaControl.classList.remove('d_none');
      console.log('recorder stopped');
    }
  }

  static get options() {
    return {
      access: {
        title: 'Настройки вашего браузера запрещают доступ к микрофону или видеокамере',
        description: 'К сожалению нам не удалось выполнить запись, потому что у страницы не было на это разрешения, измените настройки конфидициальности текущего браузера и повторите попытку',
      },
      mediarecorder: {
        title: 'Ваш браузер не поддерживает API MediaRecorder',
        description: 'К сожалению нам не удалось выполнить запись, потому что ваш браузер не поддерживает функцию записи аудио-видео, смените браузер и повторите попытку',
      },
      mediadevices: {
        title: 'Ваш браузер не поддерживает API MediaDevices',
        description: 'К сожалению нам не удалось выполнить запись, потому что ваш браузер не поддерживает функцию записи аудио-видео, смените браузер и повторите попытку',
      },
      streamAudio: {
        audio: true,
        video: false,
      },
      streamVideo: {
        audio: true,
        video: true,
      },
    };
  }
}