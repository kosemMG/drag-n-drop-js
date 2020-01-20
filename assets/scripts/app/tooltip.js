import { Component } from './component.js';

export class Tooltip extends Component {
  constructor(closeNotifier, message, hostElementId) {
    super(hostElementId);
    this.closeNotifier = closeNotifier;
    this.message = message;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = 'card';
    const tooltipTemplate = document.getElementById('tooltip');
    const tooltipBody = document.importNode(tooltipTemplate.content, true);
    tooltipBody.querySelector('p').textContent = this.message;
    this.element.append(tooltipBody);

    const hostPositionLeft = this.hostElement.offsetLeft;
    const hostPositionTop = this.hostElement.offsetTop;
    const hostHeight = this.hostElement.clientHeight;
    const parentElementScrolling = this.hostElement.parentElement.scrollTop;

    const x = hostPositionLeft + 20;
    const y = hostPositionTop + hostHeight - parentElementScrolling - 10;

    this.element.style.position = 'absolute';
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    this.element.addEventListener('click', () => this.closeTooltip());
  }

  closeTooltip() {
    this.detach();
    this.closeNotifier();
  }
}
