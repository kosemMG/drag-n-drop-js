export class Component {
  constructor(hostId, insertBefore = false) {
    if (hostId) {
      this.hostElement = document.getElementById(hostId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  attach() {
    this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element);
  }

  detach() {
    this.element && this.element.remove();
  }
}
