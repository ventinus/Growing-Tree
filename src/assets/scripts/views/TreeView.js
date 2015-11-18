export default class TreeView {
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

    this.ctx = this.element.getContext('2d');

    this.baseWidth = 20;

    this.branches = [{
      xPos: (this.element.width - this.baseWidth) / 2,
      yPos: this.element.height - 20,
      startTime: null
    }];

    this.branchCount = 1;

    this.currentStrokeWidth = this.baseWidth;


    // Lower rateOfGrowth allows for a higher branchLength
    // lower rateOfGrowth means the branchSpread should
    // be lower as well to keep it from getting too wide
    this.branchLength = 250;
    this.rateOfGrowth = 1;
    this.branchSpread = 1;

    this.animationRequests = [];


    this.init();
  }

  // Alias prototype
  // var proto = TreeView.prototype;

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

    this.enable();

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

    // this.drawSegment();
    var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, 0));
    this.animationRequests.push(request);

    return this;
  }

  drawTrunk(val) {
    for (var i = 0; i < this.baseWidth; i++) {
      if (val) {
        this.drawLine(i, 0);
      } else {
        this.makeBranch(i, 0);
      }
    }

    return this;
  }

  drawLine(index, delta) {
    this.ctx.moveTo(this.lines[index].xPos, this.lines[index].yPos);
    this.lines[index].yPos -= this.lines[index].speed;
    this.ctx.lineTo(this.lines[index].xPos, this.lines[index].yPos);
    this.ctx.stroke();

    return this;
  }

  makeBranch(index, delta) {
    this.ctx.moveTo(this.lines[index].xPos, this.lines[index].yPos);
    this.lines[index].yPos -= this.lines[index].speed;
    if (index <= this.lines.length / 2) {
      this.lines[index].xPos -= this.lines[index].speed;
    } else {
      this.lines[index].xPos += this.lines[index].speed;
    }
    this.ctx.lineTo(this.lines[index].xPos, this.lines[index].yPos);
    this.ctx.stroke();

    return this;
  }

  drawSegment() {
    this.ctx.lineWidth = this.currentStrokeWidth;
    this.ctx.moveTo(this.branches[0].xPos, this.branches[0].yPos);
    this.branches[0].yPos -= 100
    this.ctx.lineTo(this.branches[0].xPos, this.branches[0].yPos);
    this.ctx.stroke();

    for (var i = 0; i < 5; i++) {
      this.splitBranch();
      this.drawMoreBranches();
    }

    return this;
  }

  drawMoreBranches() {
    this.ctx.lineWidth = this.currentStrokeWidth;
    for (var i = 0; i < this.branchCount; i++) {
      this.ctx.moveTo(this.branches[i].xPos, this.branches[i].yPos);
      this.branches[i].yPos -= (Math.floor(Math.random() * (55 - 15 + 1)) + 15);
      if (i < this.branchCount / 2) {
        this.branches[i].xPos -= (Math.floor(Math.random() * (50 - 15 + 1)) + 15);
        this.ctx.lineTo(this.branches[i].xPos, this.branches[i].yPos);
      } else {
        this.branches[i].xPos += (Math.floor(Math.random() * (50 - 15 + 1)) + 15);
        this.ctx.lineTo(this.branches[i].xPos, this.branches[i].yPos);
      }

      this.ctx.stroke();
    }

    return this;
  }

  splitBranch() {
    this.cancelAllAnimationRequests();

    for (var i = 0; i < this.branchCount; i++) {
      this.branches[i].startTime = null;

      var newBranch = {
        xPos: this.branches[i].xPos,
        yPos: this.branches[i].yPos,
        startTime: null
      };
      this.branches.push(newBranch);
    }

    this.branchCount = this.branches.length;
    this.currentStrokeWidth *= (2 / 3);
    this.branchLength *= (2 / 3);

    for (var i = 0; i < this.branchCount; i++) {
      var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, i));
      this.animationRequests.push(request);
    }

    return this;
  }

  taperedTrunk(branchIndex, timestamp) {
    if (!this.branches[branchIndex].startTime) this.branches[branchIndex].startTime = timestamp;
    var elapsedTime = timestamp - this.branches[branchIndex].startTime;

    var endTime = this.baseWidth * this.branchLength;

    this.ctx.lineWidth = this.currentStrokeWidth - elapsedTime / this.branchLength;
    this.ctx.moveTo(this.branches[branchIndex].xPos, this.branches[branchIndex].yPos)

    this.branches[branchIndex].yPos -= (Math.random() * this.rateOfGrowth);

    if (branchIndex === 0 && this.branchCount === 1) {
      var newX = Math.random() * 0.5;
      newX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      this.branches[branchIndex].xPos += newX;
    } else if (branchIndex < this.branchCount / 2) {
      this.branches[branchIndex].xPos -= (Math.random() * this.branchSpread);
    } else if (branchIndex >= this.branchCount / 2) {
      this.branches[branchIndex].xPos += (Math.random() * this.branchSpread);
    }

    this.ctx.lineTo(this.branches[branchIndex].xPos, this.branches[branchIndex].yPos);

    this.ctx.stroke();
    if (this.currentStrokeWidth < 0.2 || this.branchCount >= 64) {
      this.cancelAllAnimationRequests();
    } else if (elapsedTime >= endTime * (5 / 8)) {
      this.splitBranch();
    } else if (elapsedTime < endTime * (5 / 8)) {
      var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, branchIndex));
      this.animationRequests.push(request);
    }

    return this;
  }

  cancelAllAnimationRequests() {
    for (var i = 0; i < this.animationRequests.length; i++) {
      window.cancelAnimationFrame(this.animationRequests[i]);
    }
    this.animationRequests = [];

    return this;
  }

}
