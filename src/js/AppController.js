import MediaContentHandler from './MediaContentHandler';
import dataBase from './dataBase';
import Geolocation from './Geolocation';
import Popup from './Popup';
import PostRenderer from './PostRenderer';
import TextContentHandler from './TextContentHandler';

export default class AppController {
  constructor(rootElement) {
    if (!(rootElement instanceof HTMLElement)) {
      throw new Error('rootElement is not HTMLElement');
    }
    this.rootElement = rootElement;
    this.geoHandler = new Geolocation();
    this.popup = new Popup();
    this.textHandler = new TextContentHandler(this.popup);
    this.postRenderer = new PostRenderer(this.rootElement.querySelector('.timeline'));
    this.mediaHandler = new MediaContentHandler(this.popup);
  }

  init() {
    this.popup.init();
    dataBase.listen(this.postRenderer.draw.bind(this.postRenderer, dataBase.memory));
  }
}