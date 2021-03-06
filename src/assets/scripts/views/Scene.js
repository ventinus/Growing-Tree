export default class Scene {
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

    if (this.element.getContext) {
      this.ctx = this.element.getContext('2d');
      this.init();
    } else {
      alert("Your browser doesn't support canvas");
    }

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

    this.setScene()
      .initSun()
      .initClouds()
      .initHills()
      .drawLoop()
      // .initTree()
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

  /***************
  Bringing all the draw looping together
  ***************/
  drawLoop() {
    this.drawScene()
      .animSun()
      .drawLand()
      .animClouds()
      .drawHills();

    setTimeout(function() {
      window.requestAnimationFrame(this.drawLoop.bind(this));
    }.bind(this), 1000 / this.fps)

    return this;
  }


  /*********************
  Scenery
  *********************/
  setScene() {
    this.element.height = 500;

    var windowWidth = window.innerWidth;

    // 16 is the body left and right margin
    this.element.width = windowWidth <= 768 ? windowWidth - 16 : windowWidth - 100;

    this.landHeight = 100;

    this.skyHeight = this.element.height - this.landHeight;

    this.skyColor = 'rgba(0,206,250,0.8)'; // animate the opacity of this color for transition between day and night

    this.fps = 60;

    this.drawScene();

    return this;
  }

  drawScene() {
    // Clear everything as this is always the beginng of each frame
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);

    // Sky
    this.ctx.fillStyle = this.skyColor;
    this.ctx.beginPath();
    this.ctx.fillRect(0, 0, this.element.width, this.element.height - this.landHeight);

    return this;
  }

  drawLand() {
    // Land
    this.ctx.fillStyle = '#FF941c';
    this.ctx.beginPath();
    this.ctx.fillRect(0, this.element.height - this.landHeight, this.element.width, this.element.height);

    return this;
  }


  /*********************
  Clouds
  *********************/
  initClouds() {
    // clouds seed
    this.clouds = [{
      xPos: 25,
      yPos: 50,
      velocity: .2,
      behind: Math.floor(Math.random() * 2) == 1 ? true : false
    }, {
      xPos: this.element.width / 2,
      yPos: 80,
      velocity: .4,
      behind: Math.floor(Math.random() * 2) == 1 ? true : false
    }, {
      xPos: this.element.width - 70,
      yPos: 50,
      velocity: .6,
      behind: Math.floor(Math.random() * 2) == 1 ? true : false
    }];

    this.drawClouds(true);

    return this;
  }

  makeCloud() {
    var cloud = {
      xPos: -80,
      yPos: Math.floor(Math.random() * (100 - 50) + 50),
      velocity: Math.random() * (0.6 - 0.2) + 0.2,
      behind: Math.floor(Math.random() * 2) == 1 ? true : false
    };

    this.clouds.push(cloud);

    this.drawCloud(cloud);

    return this;
  }

  drawCloud(cloud) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9';
    this.ctx.strokewidth = 0;
    this.ctx.beginPath();

    var xPos = cloud.xPos;

    for (var i = 0; i < 5; i++) {
      var altY = i % 2 === 0 ? cloud.yPos : cloud.yPos - 15;
      this.ctx.arc(xPos, altY, 20, 0, Math.PI * 2, false);
      xPos += 15;
    }

    this.ctx.fill();

    return this;
  }

  // I bet there's a better way to just do the clouds with behind true
  // Check also at end of drawHills where the false ones get drawn
  drawClouds(boolean) {
    if (boolean) {
      for (let cloud of this.clouds) {
        if (cloud.behind === true) {
          this.drawCloud(cloud);
        }
      }
    } else {
      for (let cloud of this.clouds) {
        if (cloud.behind === false) {
          this.drawCloud(cloud);
        }
      }
    }

    return this;
  }

  animClouds() {
    for (let cloud of this.clouds) {
      cloud.xPos += cloud.velocity;
      if (cloud.xPos - 20 > this.element.width) {
        var index = this.clouds.indexOf(cloud);
        this.clouds.splice(index, 1);
        setTimeout(function() {
          this.makeCloud();
        }.bind(this), Math.random() * (4000 - 1000) + 1000)
      }
    }

    this.drawClouds(true);

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



  /*********************
  Hills
  *********************/
  initHills() {
    // Hills properties set on initialization
    this.hill = {
      hillWidth: Math.random() * (70 - 50) + 50,
      hillWidthHalf: 0,
      xPos: Math.random() * (this.element.width / 2 - 20) + 20,
      small: Math.random() * (0.15 - 0.05) + 0.05,
      med: Math.random() * (0.3 - 0.2) + 0.2,
      large: Math.random() * (0.85 - 0.7) + 0.7,
      hillHeights: [],
      midway: 0
    }

    this.hill.hillWidthHalf = this.hill.hillWidth / 2;

    this.hill.hillHeights = [{
      full: this.skyHeight * this.hill.med,
      relative: -this.skyHeight * this.hill.med
    }, {
      full: (this.skyHeight * this.hill.med) + this.hill.hillWidthHalf,
      relative: 0
    }, {
      full: this.skyHeight * this.hill.large,
      relative: -((this.skyHeight * this.hill.large) - ((this.skyHeight * this.hill.med) + this.hill.hillWidth))
    }, {
      full: (this.skyHeight * this.hill.large) - this.hill.hillWidthHalf,
      relative: ((this.skyHeight * this.hill.large) - this.hill.hillWidthHalf) - ((this.skyHeight * this.hill.small) + this.hill.hillWidthHalf)
    }, {
      full: this.skyHeight * this.hill.small,
      relative: this.skyHeight * this.hill.small
    }];

    this.hill.midway = Math.floor(this.hill.hillHeights.length / 2);

    this.drawHills();

    return this;
  }

  drawHills() {
    var xPos = this.hill.xPos;
    var yPos = this.skyHeight;

    this.ctx.fillStyle = '#069611';
    this.ctx.strokewidth = 2;
    this.ctx.strokeStyle = '#000';

    this.ctx.beginPath();
    for (var i = 0, j = this.hill.hillHeights.length; i < j; i++) {
      this.ctx.moveTo(xPos, yPos);
      if (i <= this.hill.midway) {
        // First half
        yPos += this.hill.hillHeights[i].relative;
        this.ctx.lineTo(xPos, yPos);
      }

      this.ctx.arc(xPos + this.hill.hillWidthHalf, yPos, this.hill.hillWidthHalf, Math.PI, 0, false);
      this.ctx.fillRect(xPos, yPos - 1, this.hill.hillWidth, this.hill.hillHeights[i].full);

      this.ctx.moveTo(xPos + this.hill.hillWidthHalf - 5, yPos - (this.hill.hillWidthHalf / 2) - 4);
      this.ctx.lineTo(xPos + this.hill.hillWidthHalf - 5, yPos - (this.hill.hillWidthHalf / 2) + 4);
      this.ctx.moveTo(xPos + this.hill.hillWidthHalf + 5, yPos - (this.hill.hillWidthHalf / 2) - 4);
      this.ctx.lineTo(xPos + this.hill.hillWidthHalf + 5, yPos - (this.hill.hillWidthHalf / 2) + 4);

      xPos += this.hill.hillWidthHalf;

      if (i < this.hill.midway) {
        yPos -= this.hill.hillWidthHalf;
      } else if (i === this.hill.midway) {
        yPos += this.hill.hillWidthHalf;
      } else {
        xPos += this.hill.hillWidthHalf;
        this.ctx.moveTo(xPos, yPos);
        yPos += this.hill.hillHeights[i].relative;
        this.ctx.lineTo(xPos, yPos);
        xPos -= this.hill.hillWidthHalf;
        yPos += this.hill.hillWidthHalf;
      }
    }

    this.ctx.fill();
    this.ctx.stroke();

    this.drawClouds(false);

    return this;
  }


  /*********************
  Tree
  *********************/
  initTree() {
    this.baseWidth = 20;
    this.branchCount = 1;
    this.currentStrokeWidth = this.baseWidth;

    // Lower rateOfGrowth allows for a higher branchLength
    // lower rateOfGrowth means the branchSpread should
    // be lower as well to keep it from getting too wide
    this.branchLength = 0;
    this.rateOfGrowth = 0;
    this.branchSpread = 0;
    this.animationRequests = [];

    this.branches = [{
      xPos: (this.element.width - this.baseWidth) / 2,
      yPos: this.element.height - (this.landHeight / 2),
      startTime: null
      // branchLength: Math.random() * (0.8 - 0.3) + 0.3
    }];

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

    this.drawTree();

    return this;
  }

  drawTree() {
    var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, 0));
    this.animationRequests.push(request);

    return this;
  }

  splitBranch() {
    this.cancelAllAnimationRequests();

    for (var i = this.branchCount - 1; i >= 0; i--) {
      this.branches[i].startTime = null;

      var newBranch = {
        xPos: this.branches[i].xPos,
        yPos: this.branches[i].yPos,
        startTime: null
        // branchLength: Math.random() * (0.8 - 0.3) + 0.3
      };
      this.branches.push(newBranch);
    }

    this.branchCount = this.branches.length;
    this.currentStrokeWidth *= (2 / 3);
    this.branchLength *= (2 / 3);

    for (var i = this.branchCount - 1; i >= 0; i--) {
      var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, i));
      this.animationRequests.push(request);
    }

    return this;
  }

  taperedTrunk(branchIndex, timestamp) {
    if (!this.branches[branchIndex].startTime) this.branches[branchIndex].startTime = timestamp;
    var elapsedTime = timestamp - this.branches[branchIndex].startTime;
    var endTime = this.baseWidth * this.branchLength;

    var subtractedAmount = (elapsedTime / endTime) * 4;

    this.ctx.lineWidth = this.currentStrokeWidth - subtractedAmount;
    this.ctx.strokeStyle = '#825201';
    this.ctx.beginPath();
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
