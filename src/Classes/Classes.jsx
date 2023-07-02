export class CardClass {
  constructor(title, message, containerId) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.message = message;
    this.containerId = containerId;
    this.images = [];
  }
}

export class ContainerClass {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.cards = [];
  }
}
