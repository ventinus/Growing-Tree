// Dependencies

export default class TurtleView {
  constructor(element) {
    /**
     * Flag to indicate whether the module has been enabled
     *
     * @property isEnabled
     * @type {Boolean}
     * @default false
     */
    this.isEnabled = false;

    /**
     * Primary jQuery Element
     *
     * @property element
     * @type {jQuery}
     */
    this.element = element;

    this.ctx = null;
    this.x = 200;
    this.y = 350;
    this.d = 1.5;

    this.buffer = document.createElement('canvas');
    this.buffer.width = 60;
    this.buffer.height = 60;
    this.bufferCtx = this.buffer.getContext('2d');

    this.init();
  }

  // Alias prototype
  // var proto = TurtleView.prototype;

  /**
   * Init
   *
   * Top level function which kicks off
   * functionality of the constructor
   *
   * @public
   * @chainable
   * @method init
   */
  init() {

    this.setupHandlers()
      .createChildren()
      .enable();

    return this;
  }

  /**
   * Setup Handlers
   *
   * Ensure that the proper context of
   * 'this' is referenced by event handlers
   *
   * @public
   * @chainable
   * @method setupHandlers
   */
  setupHandlers() {

    return this;
  }

  /**
   * Create Children
   *
   * Cache DOM selectors as properties of the
   * constructor for public use.
   *
   * @public
   * @chainable
   * @method createChildren
   */
  createChildren() {
    this.ctx = this.element.getContext('2d');

    return this;
  }

  /**
   * Enable
   *
   * Event listeners and any other calls required to
   * make the constructor work properly.
   *
   * @public
   * @chainable
   * @method enable
   */
  enable() {
    if (this.isEnabled) {
      return this;
    }

    this.isEnabled = true;

    if (this.element.getContext) {
      this.drawTree();
    }
    return this;
  }

  /**
   * Disables the view
   * Tears down any event binding to handlers
   * Exits early if it is already disabled
   *
   * @method disable
   * @chainable
   */
  disable() {
    if (!this.isEnabled) {
      return this;
    }

    this.isEnabled = false;

    return this;
  }

  /**
   * Destroys the view
   * Tears down any events, handlers, elements
   * Should be called when the object should be left unused
   *
   * @method destroy
   * @chainable
   */
  destroy() {
    this.disable();

    for (var key in this) {
      if (this.hasOwnProperty(key)) {
        this[key] = null;
      }
    }

    return this;
  }

  drawTree() {
    // this.drawTriangle('rgb(255,255,255)');
    // this.drawSmileFace();
    // this.drawSpeechBubble();
    this.drawTurtle();
    return this;
  }

  drawTriangle(color) {
    var ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(75,50);
    ctx.lineTo(100,75);
    ctx.lineTo(100,25);
    ctx.fill();

    return this;
  }

  drawSmileFace() {
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
    ctx.moveTo(110,75);
    ctx.arc(75,75,35,0,Math.PI,false);  // Mouth (clockwise)
    ctx.moveTo(65,65);
    ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    ctx.moveTo(95,65);
    ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    ctx.stroke();

    return this;
  }

  drawSpeechBubble() {
    var ctx = this.ctx;
    ctx.moveTo(75,25);
    ctx.quadraticCurveTo(25,25,25,62.5);
    ctx.quadraticCurveTo(25,100,50,100);
    ctx.quadraticCurveTo(50,120,30,125);
    ctx.quadraticCurveTo(60,120,65,100);
    ctx.quadraticCurveTo(125,100,125,62.5);
    ctx.quadraticCurveTo(125,25,75,25);
    ctx.stroke();

    return this;
  }

  drawTurtle() {
    var ctx = this.ctx;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - Math.sin(this.d-(Math.PI/2))*10, this.y - Math.cos(this.d-(Math.PI/2))*10);
    ctx.lineTo(this.x - Math.sin(this.d)*20, this.y - Math.cos(this.d)*20);
    ctx.lineTo(this.x + Math.sin(this.d-(Math.PI/2))*10, this.y + Math.cos(this.d-(Math.PI/2))*10);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    return this;
  }

  prerender() {
    this.ctx.drawImage(this.buffer, 0, 0, 60, 60, this.x-30, this.y-30, 60, 60)

    return this;
  }

  turnLeft(degrees){
    if (!degrees) { degrees = 1; }
    var radians = degrees * (Math.PI/180);
    this.d += radians;
    this.drawTurtle();
    return this;


  }

}

