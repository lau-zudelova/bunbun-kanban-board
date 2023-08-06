import { COLORS } from "./Colors";

export class CardClass {
  constructor(title, message, containerId, images, color) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.message = message;
    this.containerId = containerId;
    this.images = images;
    this.color = color;
  }
}

export class ContainerClass {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.cards = [];
  }
}
