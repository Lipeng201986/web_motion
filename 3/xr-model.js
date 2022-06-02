import SpaceManager from './space-manager.js';

export default class XRModel extends HTMLElement {
  constructor() {
    super();
    this.transform = {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    };
    this.src = "";
  }
  connectedCallback() {
    console.log("connectedCallback", this.attributes);

    if (this.hasAttribute("src")) {
      this.src = this.getAttribute("src");
    }
    if (this.hasAttribute("position")) {
      this.transform.position = this.getAttribute("position").split(" ");
    }
    if (this.hasAttribute("rotation")) {
      this.transform.rotation = this.getAttribute("rotation").split(" ");
    }
    if (this.hasAttribute("scale")) {
      this.transform.scale = this.getAttribute("scale").split(" ");
    }

    this._loadModel(this.src, this.transform);
  }

  attributesChangedCallback(name, oldValue, newValue) {
    console.log("attributesChangedCallback", name, oldValue, newValue);
    if (name === "src") {
      this.src = newValue;
    } else if (name === "position") {
      this.position = newValue.split(" ");
    } else if (name === "rotation") {
      this.rotation = newValue.split(" ");
    } else if (name === "scale") {
      this.scale = newValue.split(" ");
    }

    // TODO: how to detect which model should be changed?
  }

  _loadModel(url, transform) {
    // TODO: relative or absolute path
    if(window.SpaceManager === undefined){
      window.SpaceManager = new SpaceManager();
    }
    window.SpaceManager.loadModel( url, transform);
  }
}

customElements.define("xr-model", XRModel);
