import Scene from './Scene';

class SunView extends Scene {
  constructor(options) {
    console.log(options)
    super()
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
    this.element = options;

  }

  // Alias prototype
  // var proto = Scene.prototype;

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
    this.initSun()
      .drawLoop()
      .enable();

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



  /*********************
  Sun
  *********************/
  initSun() {
    this.sun = {
      xPos: this.element.width - 75,
      yPos: 75,
      percent: 0,
      radius: 50,
      rising: false
    };

    this.drawSun();

    return this;
  }

  drawSun() {
    this.ctx.fillStyle = '#FF0';
    this.ctx.strokewidth = 0;
    this.ctx.beginPath();
    this.ctx.arc(this.sun.xPos, this.sun.yPos, this.sun.radius, 0, Math.PI * 2, false);
    this.ctx.fill();

    return this;
  }

  animSun() {
    this.sun.percent = this.sun.percent > 1 ? 0 : this.sun.percent + .001;

    var xy = this.getQuadraticBezierXYatPercent({
      x: -100,
      y: this.element.height * 1.5
    }, {
      x: this.element.width / 2,
      y: -this.skyHeight * 2
    }, {
      x: this.element.width + 100,
      y: this.element.height * 1.5
    })

    this.sun.xPos = xy.x;
    this.sun.yPos = xy.y;

    if (this.sun.rising && this.sun.yPos < -this.sun.radius - 5) {
      this.sun.rising = false;
      this.sun.xPos = this.element.width - 75;
    } else if (!this.sun.rising && this.sun.yPos > this.skyHeight + this.sun.radius * 2) {
      this.sun.rising = true;
      this.sun.xPos = 75;
    }

    this.drawSun();

    this.updateSkyColor();

    return this;
  }

  drawLoop() {
    this.animSun();

    setTimeout(function() {
      window.requestAnimationFrame(this.drawLoop.bind(this));
    }.bind(this), 1000 / 60)
    return this;
  }

  getQuadraticBezierXYatPercent(startPt, controlPt, endPt) {
    var x = Math.pow(1 - this.sun.percent, 2) * startPt.x + 2 * (1 - this.sun.percent) * this.sun.percent * controlPt.x + Math.pow(this.sun.percent, 2) * endPt.x;
    var y = Math.pow(1 - this.sun.percent, 2) * startPt.y + 2 * (1 - this.sun.percent) * this.sun.percent * controlPt.y + Math.pow(this.sun.percent, 2) * endPt.y;
    return ({
      x: x,
      y: y
    });
  }

  updateSkyColor() {
    var skyOpacity = 1 - (this.sun.yPos / (this.skyHeight + (this.sun.radius * 2)));

    if (skyOpacity >= 1) {
      skyOpacity = 1;
    } else if (skyOpacity <= 0) {
      skyOpacity = 0;
    }

    this.skyColor = `rgba(0,206,250,${skyOpacity})`

    return this;
  }




}
export default SunView;