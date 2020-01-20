export class DOMHelper {
  static moveElement(id, destinationSelector) {
    const element = document.getElementById(id);
    const destinationElement = document.querySelector(destinationSelector);
    destinationElement.append(element);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  static clearEventListeners(element) {
    const clone = element.cloneNode(true);
    element.replaceWith(clone);
    return clone;
  }
}
