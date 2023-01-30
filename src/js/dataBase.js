const dataBase = {
  memory: [],
  handler: null,
  listen(handler) {
    this.handler = handler;
  },
  add(content, coords) {
    this.memory.unshift({
      content,
      date: this.getDate(),
      coords,
    });
    if (!this.handler) {
      throw new Error('handler is not bind to dataBase');
    }
    this.handler();
  },
  getDate() {
    const formatter = new Intl.DateTimeFormat('ru', {
      timeZone: 'Europe/Moscow',
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const time = formatter.format(new Date());
    return this.cleanDate(time);
  },
  cleanDate(str) {
    const temp1 = str.split(' ');
    this.date = [temp1[0].slice(0, -1), temp1[1]].join(' ');
    return this.date;
  },
};

export { dataBase as default };