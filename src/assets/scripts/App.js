import TreeView from './views/TreeView';

export default class App {
  constructor() {
    this.createChildren()
      .init()
  }

  createChildren() {
    this.tree = document.getElementById('tree');

    return this;
  }

  init() {
    this.initTreeView();

    return this;
  }

  initTreeView() {
    this.TreeInstance = new TreeView(this.tree);
  }
}
