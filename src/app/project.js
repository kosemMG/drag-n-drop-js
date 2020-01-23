// import { Tooltip } from './tooltip.js';
import { DOMHelper } from '../utility/dom-helper';

export class Project {
  // hasActiveTooltip = false;

  constructor(id, updateProjectListsFn, type) {
    this.hasActiveTooltip = false;
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFn;
    this.setButtonHandlers(type);
    this.setDragHandler();
  }

  setDragHandler() {
    document.getElementById(this.id).addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', this.id);
      event.dataTransfer.effectAllowed = 'move';
    });
  }

  setButtonHandlers(type) {
    let switchButton = document.getElementById(this.id).querySelector('button:last-of-type');
    switchButton = DOMHelper.clearEventListeners(switchButton);
    switchButton.textContent = type === 'active' ? 'Finish' : 'Activate';
    switchButton.addEventListener('click', () => this.updateProjectListsHandler(this.id));

    const moreInfoButton = document.getElementById(this.id).querySelector('button:first-of-type');
    moreInfoButton.addEventListener('click', () => this.showMoreInfoHandler());
  }

  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const projectElement = document.getElementById(this.id);
    const tooltipMessage = projectElement.dataset.extraInfo;

    import('./tooltip')
      .then(module => {
        const tooltip = new module.Tooltip(() => this.hasActiveTooltip = false, tooltipMessage, this.id);
        tooltip.attach();
        this.hasActiveTooltip = true;
      });
  }

  update(updateProjectListsFn, type) {
    this.updateProjectListsHandler = updateProjectListsFn;
    this.setButtonHandlers(type);
  }
}
