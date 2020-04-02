class DOMHelper {
    static moveElement(elementId, newDestinationSelector) {
      const element = document.getElementById(elementId);
      const destinationElement = document.querySelector(newDestinationSelector);
      destinationElement.append(element);
    }

    static clearEventsListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
  }

  class ExtraInfo {
      constructor(closeNotifier) {
          this.closeNotifier = closeNotifier;

      }

      closeInfo = () => {
          this.detach();
          this.closeNotifier();

      }


      detach () {
          this.element.remove();
      }


      attach() {
          const infoElement = document.createElement('div');
          infoElement.className = 'card';
          infoElement.innerText = 'Place for additional info';
          infoElement.addEventListener('click', this.closeInfo.bind(this));
          this.element = infoElement;
          document.body.append(infoElement);
        
      }
    }

class ProjectItem{
    hasActiveInfo = false;

    constructor(id, updateProjectLists, type){
        this.id = id;
        this.updateProjectListsHandler = updateProjectLists;
        this.connectSwitchButton(type);
        this.connectMoreInfoButton();
    }

    connectMoreInfoButton() {
        const elementItem = document.getElementById(this.id);
        const moreInfoButton = elementItem.querySelector('button:first-of-type');
        moreInfoButton.addEventListener('click', this.showMoreInfoHandler);
    }

    showMoreInfoHandler() {
        if (!this.hasActiveInfo){
            const info = new ExtraInfo(() => {
                this.hasActiveInfo = false;
            });
            info.attach();
            this.hasActiveInfo = true;
        }
    }

    connectSwitchButton(type) {
        this.type = type;
        const elementItem = document.getElementById(this.id);
        let switchButton = elementItem.querySelector('button:last-of-type');
        switchButton.textContent = this.type === 'active' ? 'Finish' : "Activate";
        switchButton = DOMHelper.clearEventsListeners(switchButton);
        switchButton.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id));
    }

    update(updateProjectList) {
        this.updateProjectListsHandler = updateProjectList;

    }
}

class ProjectList{
    projects = [];

    constructor(type) {
        this.type = type;
        const projectItems = document.querySelectorAll(`#${type}-projects li`);
        for (const projectItem of projectItems){
            this.projects.push(new ProjectItem(projectItem.id, this.switchProject.bind(this), this.type))
        }
    }

    setSwitchHandlerFunction(switchHandlerFunction){
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
        project.connectSwitchButton(this.type);
      }

    switchProject(projectId) {
        this,this.switchHandler(this.projects.find(p => p.id === projectId));
        this.projects = this.projects.filter(p => p.id !== projectId);
    }
}

class App {
    static init() {


    }
}

App.init();

const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList));
finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));