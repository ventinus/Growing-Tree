import Scene from './views/Scene';

export default class App {
  constructor() {
    this.createChildren()
      .init()
  }

  createChildren() {
    this.canvas = document.getElementById('canvas');

    return this;
  }

  init() {
    this.SceneInstance = new Scene(this.canvas);

    return this;
  }

}
