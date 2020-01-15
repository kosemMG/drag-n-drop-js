class DOMHelper {
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

class Component {
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

class Tooltip extends Component {
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

class Project {
  hasActiveTooltip = false;

  constructor(id, updateProjectListsFn, type) {
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
    const tooltip = new Tooltip(() => this.hasActiveTooltip = false, tooltipMessage, this.id);
    tooltip.attach();
    this.hasActiveTooltip = true;
  }

  update(updateProjectListsFn, type) {
    this.updateProjectListsHandler = updateProjectListsFn;
    this.setButtonHandlers(type);
  }
}

class ProjectList {
  projects = [];

  constructor(type) {
    this.type = type;

    const projectItems = document.querySelectorAll(`#${type}-projects li`);
    for (const projectItem of projectItems) {
      this.projects.push(new Project(projectItem.id, this.switchProject.bind(this), this.type));
    }
    this.setDropHandler();
  }

  setDropHandler() {
    const list = document.querySelector(`#${this.type}-projects ul`);

    list.addEventListener('dragenter', event => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        list.parentElement.classList.add('droppable');
        event.preventDefault();
      }
    });

    list.addEventListener('dragover', event => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
      }
    });

    list.addEventListener('dragleave', event => {
      if (event.relatedTarget.closest && event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
        list.parentElement.classList.remove('droppable');
      }
    });

    list.addEventListener('drop', event => {
      event.preventDefault(); // not required in Chrome
      const projectId = event.dataTransfer.getData('text/plain');
      if (this.projects.find(project => project.id === projectId)) {
        return;
      }
      document.getElementById(projectId).querySelector('button:last-of-type').click();
      list.parentElement.classList.remove('droppable');
    });
  }

  setSwitchHandler(switchHandler) {
    this.switchHandler = switchHandler;
  }

  switchProject(projectId) {
    this.switchHandler(this.projects.find(project => project.id === projectId));
    this.projects = this.projects.filter(project => project.id !== projectId);
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }
}

class App {
  static init() {
    const activeProjectsList = new ProjectList('active');
    const finishedProjectsList = new ProjectList('finished');
    activeProjectsList.setSwitchHandler(finishedProjectsList.addProject.bind(finishedProjectsList));
    finishedProjectsList.setSwitchHandler(activeProjectsList.addProject.bind(activeProjectsList));
  }
}

App.init();
