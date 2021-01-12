export default class Action {
  constructor(name, App) {
    this.app = App;
    this._name = name;
    // console.log(this.name, this.app);
  }


  // init(canvas) {
  //     this.canvas = canvas;
  //     console.log('action is completed', this.canvas);
  // }

  getName() {
    return this._name;
  }

  getActiveObject() {
    return this.app.getActiveObject();
  }

  getCanvas() {
    return this.app.getCanvas();
  }

  getImageEditor() {
    return this.app.getImageEditor();
  }

  getBackgroundImage() {
    return this.app.getBackgroundImage();
  }

  getGrid() {
    return this.app.getGrid();
  }

  setGrid(grid) {
    return this.app.setGrid(grid);
  }

  getClipboard() {
    return this.app.getClipboard();
  }

  setClipboard(clip) {
    return this.app.setClipboard(clip);
  }

  addKeyDownEvent() {
    return this.app.addKeyDownEvent();
  }

  removeKeyDownEvent() {
    return this.app.removeKeyDownEvent();
  }

}


