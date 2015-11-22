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

    this.branches = [];

    this.branchCount = 1;

    this.currentStrokeWidth = this.baseWidth;

    // Lower rateOfGrowth allows for a higher branchLength
    // lower rateOfGrowth means the branchSpread should
    // be lower as well to keep it from getting too wide
    this.branchLength = 0;
    this.rateOfGrowth = 0;
    this.branchSpread = 0;

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

    this.setAttrs()
      .drawScape()
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
    this.ctx.strokeStyle = '#825201';
    this.ctx.beginPath();
    // this.animTreeGrowth(0);

    var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, 0));
    this.animationRequests.push(request);

    return this;
  }

  setAttrs() {
    // this.element.height = window.innerHeight * 0.9;
    // this.element.width = window.innerWidth * 0.9;
    
    this.element.height = 500;
    this.element.width = window.innerWidth - 100;

    this.landHeight = 100;

    var branch = {
      xPos: (this.element.width - this.baseWidth) / 2,
      yPos: this.element.height - (this.landHeight / 2),
      startTime: null,
      // branchLength: Math.random() * (0.8 - 0.3) + 0.3
    }

    this.branches.push(branch);

    // In general, a higher rateOfGrowth means branchLength would
    // need to be shorter and thus branchSpread can be larger

    // How long a branch is with respect to the amount of time
    // it takes to grow it
    this.branchLength = 250;

    // upwards velocity. branches will be longer because same amount of
    // time is spent growing a branch
    this.rateOfGrowth = 1;

    //higher the number, the wider the branches shoot out
    this.branchSpread = 1;


    return this;
  }

  drawScape() {

    // Sky
    this.ctx.fillStyle = 'rgba(0,206,250,1)'; // animate the opacity of this color for transition between day and night
    this.ctx.fillRect(0, 0, this.element.width, this.element.height - this.landHeight);

    // Land
    this.ctx.fillStyle = '#FF941c';
    this.ctx.fillRect(0, this.element.height - this.landHeight, this.element.width, this.element.height);

    // Sun
    this.ctx.fillStyle = '#FF0';
    this.ctx.strokewidth = 0;
    this.ctx.beginPath();
    this.ctx.arc(this.element.width - 75, 75, 50, 0, Math.PI*2, false);
    this.ctx.fill();
    
    // Clouds
    this.drawCloud(25, 50);
    this.drawCloud(this.element.width / 2, 80);
    this.drawCloud(this.element.width - 70, 50);

    // Hills
    this.drawHills();

    return this;
  }

  drawHills() {
    var hillWidth = 70;
    var hillWidthHalf = hillWidth / 2;
    var xPos = 20;
    var skyHeight = this.element.height - this.landHeight;
    var yPos = skyHeight;

    // relative heights are the difference between a given hill
    // and its previous
    var small, med, large;
    small = 0.15;
    med = 0.25;
    large = 0.7;

    var hillHeights = [
      {
        full: skyHeight * med,
        relative: -skyHeight * med
      },{
        full: (skyHeight * med) + hillWidthHalf,
        relative: 0
      },{
        full: skyHeight * large,
        relative: -((skyHeight * large) - ((skyHeight * med) + hillWidth))
      },{
        full: (skyHeight * large) - hillWidthHalf,
        relative: ((skyHeight * large) - hillWidthHalf) - ((skyHeight * small) + hillWidthHalf)
      },{
        full: skyHeight * small,
        relative: skyHeight * small
      }
    ];

    var midway = Math.floor(hillHeights.length / 2);

    this.ctx.fillStyle = '#069611';
    this.ctx.strokewidth = 2;
    this.ctx.strokeStyle = '#000';
    this.ctx.beginPath();

    for (var i = 0, j = hillHeights.length; i < j; i++) {
      this.ctx.moveTo(xPos, yPos);
      if (i <= midway) {
        // First half
        yPos += hillHeights[i].relative;
        this.ctx.lineTo(xPos, yPos);
        this.ctx.arc(xPos + hillWidthHalf, yPos, hillWidthHalf, Math.PI, 0, false);
        this.ctx.fillRect(xPos, yPos, hillWidth, hillHeights[i].full);
      } else {
        // second half
        this.ctx.arc(xPos + hillWidthHalf, yPos, hillWidthHalf, Math.PI, 0, false);
        this.ctx.fillRect(xPos, yPos, hillWidth, hillHeights[i].full);
      }

      this.ctx.moveTo(xPos + hillWidthHalf - 5, yPos - (hillWidthHalf / 2) - 4);
      this.ctx.lineTo(xPos + hillWidthHalf - 5, yPos - (hillWidthHalf / 2) + 4);
      this.ctx.moveTo(xPos + hillWidthHalf + 5, yPos - (hillWidthHalf / 2) - 4);
      this.ctx.lineTo(xPos + hillWidthHalf + 5, yPos - (hillWidthHalf / 2) + 4);

      xPos += hillWidthHalf;
      
      if (i < midway) {
        yPos -= hillWidthHalf;
      } else if (i === midway) {
        yPos += hillWidthHalf;
      } else {
        xPos += hillWidthHalf;
        this.ctx.moveTo(xPos, yPos);
        yPos += hillHeights[i].relative;
        this.ctx.lineTo(xPos, yPos);
        xPos -= hillWidthHalf;
        yPos += hillWidthHalf;
      }
      
    }

    this.ctx.fill();
    this.ctx.stroke();

    return this;
  }

  drawCloud(xPos, yPos) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9';
    this.ctx.strokewidth = 0;
    this.ctx.beginPath();

    for (var i = 0; i < 5; i++) {
      var altY = i % 2 === 0 ? yPos : yPos - 15;
      this.ctx.arc(xPos, altY, 20, 0, Math.PI*2, false);
      xPos += 15;
    }
    
    this.ctx.fill();

    return this;
  }



  splitBranch() {
    this.cancelAllAnimationRequests();

    for (var i = this.branchCount - 1; i >= 0; i--) {
      this.branches[i].startTime = null;

      var newBranch = {
        xPos: this.branches[i].xPos,
        yPos: this.branches[i].yPos,
        startTime: null,
        // branchLength: Math.random() * (0.8 - 0.3) + 0.3
      };
      this.branches.push(newBranch);
    }

    this.branchCount = this.branches.length;
    this.currentStrokeWidth *= (2 / 3);
    this.branchLength *= (2 / 3);

    for (var i = this.branchCount - 1; i >= 0; i--) {
      // this.animTreeGrowth(i);
      var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, i));
      this.animationRequests.push(request);
    }

    return this;
  }

  taperedTrunk(branchIndex, timestamp) {
    if (!this.branches[branchIndex].startTime) this.branches[branchIndex].startTime = timestamp;
    var elapsedTime = timestamp - this.branches[branchIndex].startTime;
    // console.log(this.branches)
    var endTime = this.baseWidth * this.branchLength;

    // console.log('strokewidth', this.currentStrokeWidth);
    // console.log('elapsed time', elapsedTime);
    // console.log('branchLength', this.branchLength);
    var subtractedAmount = (elapsedTime / endTime) * 8;
    // console.log('subtracted amount', subtractedAmount);
    // console.log('endTime', endTime);

    this.ctx.lineWidth = this.currentStrokeWidth - subtractedAmount;
    // console.log('drawn lineWidth', this.ctx.lineWidth);
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

    // console.log(elapsedTime);
    // console.log(endTime);
    this.ctx.stroke();
    if (this.currentStrokeWidth < 0.2 || this.branchCount >= 64) {
      this.cancelAllAnimationRequests();
    } else if (elapsedTime >= endTime * (5 / 8)) {
      this.splitBranch();
    } else if (elapsedTime < endTime * (5 / 8)) {
      // this.animTreeGrowth(branchIndex);
      var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, branchIndex));
      this.animationRequests.push(request);
    }

    return this;
  }

  animTreeGrowth(index) {
    var request = window.requestAnimationFrame(this.animTreeGrowth.bind(this));
    this.animationRequests.push(request);
    var timestamp = new Date().getTime();
    this.taperedTrunk(index, timestamp);

    return this;
  }

  cancelAllAnimationRequests() {
    for (var i = this.animationRequests.length - 1; i >= 0; i--) {
      window.cancelAnimationFrame(this.animationRequests[i]);
    }
    this.animationRequests = [];

    return this;
  }

}
