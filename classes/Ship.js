import GameObject from './GameObject.js'

/** @typedef { 'none' | 'left' | 'right' | 'top' | 'bottom' } positions */
/** @typedef { 'left' | 'right' | 'top' | 'bottom' } sideDirections */

class Ship extends GameObject {
  static width = 172
  static height = 172
  static shootFunction
  static destroyedFunction
  static cannonCropX = { left: 2692, right: 1346, top: 673, bottom: 2019, none: 0 }

  #demoMode
  #destroyed = false
  /** @type { positions } */
  #shield = 'none'
  /** @type { positions } */
  #cannon = 'none'
  #energy = 100
  #heat = 0

  #baseImage = super._createImage('./images/shipBase.png')
  #glassImage = super._createImage('./images/glass.png')
  #coreImage = super._createImage('./images/coreSprite.png')
  #lightingImage = super._createImage('./images/colorLightning.png')
  #shieldImage = super._createImage('./images/shieldSprites.png')
  #cannonImage = super._createImage('./images/cannons.png')
  #sidesImage = super._createImage('./images/sideParts.png')
  #blueOrbImage = super._createImage('./images/blueOrb.png')
  #magentaOrbImage = super._createImage('./images/magentaOrb.png')
  #greenOrbImage = super._createImage('./images/greenOrb.png')
  #yellowOrbImage = super._createImage('./images/yellowOrb.png')

  #coreAnimationX = 0
  #coreAnimationY = 0
  #orbAnimationX = 0
  #orbAnimationY = 0
  #lightingAnimation = 0
  #shieldAnimationX = 0
  #corpusCondition = { left: true, right: true, top: true, bottom: true }

  #coreInterval
  #powerOrbsInterval
  #shieldInterval
  #heatInterval
  #energyInterval

  #sensors = {
    225: {
      color: '#007acf',
      coords: [
        { x: 411, y: 314},
        { x: 411, y: 304},
        { x: 411, y: 294},
        { x: 416, y: 282},
        { x: 424, y: 274},
        { x: 432, y: 266},
        { x: 444, y: 261},
        { x: 454, y: 261},
        { x: 464, y: 261}
      ]
    },
    315: {
      color: '#d930db',
      coords: [
        { x: 516, y: 261},
        { x: 526, y: 261},
        { x: 536, y: 261},
        { x: 548, y: 266},
        { x: 556, y: 274},
        { x: 564, y: 282},
        { x: 569, y: 294},
        { x: 569, y: 304},
        { x: 569, y: 314},
      ]
    },
    135: {
      color: '#f1d907',
      coords: [
        { x: 411, y: 366},
        { x: 411, y: 376},
        { x: 411, y: 386},
        { x: 416, y: 398},
        { x: 424, y: 406},
        { x: 432, y: 414},
        { x: 444, y: 419},
        { x: 454, y: 419},
        { x: 464, y: 419}
      ]
    },
    45: {
      color: '#16e129',
      coords: [
        { x: 516, y: 419},
        { x: 526, y: 419},
        { x: 536, y: 419},
        { x: 548, y: 414},
        { x: 556, y: 406},
        { x: 564, y: 398},
        { x: 569, y: 386},
        { x: 569, y: 376},
        { x: 569, y: 366},
      ]
    }
  }

  get heat() {
    return this.#heat
  }

  get energy() {
    return this.#energy
  }

  get shield() {
    return this.#shield
  }


  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { number } xPos 
   * @param { number } yPos 
   * @param { boolean } demoMode
   */
  constructor(canvas, shootFunction, destroyedFunction, demoMode = false) {
    super(canvas)
    Ship.shootFunction = shootFunction
    Ship.destroyedFunction = destroyedFunction
    this.#demoMode = demoMode

    this.#coreInterval = setInterval(() => this._coreAnimation(), 100)
    this.#powerOrbsInterval = setInterval(() => this._powerOrbsAnimation(), 60)
    this.#shieldInterval = setInterval(() => this._shieldAnimation(), 20)
    this.#heatInterval = setInterval(() => this._updateHeat(), 400)
    this.#energyInterval = setInterval(() => this._updateEnergy(), 200)
  }


  _drawBase() {
    const leftSideX = this.#corpusCondition.left ? 172 : 0
    const rightSideX = this.#corpusCondition.right ? 172 : 0
    const topSideX = this.#corpusCondition.top ? 172 : 0
    const bottomSideX = this.#corpusCondition.bottom ? 172 : 0

    this.ctx.drawImage(this.#sidesImage, leftSideX, 0, 172, 172, (this.canvasWidth - Ship.width) / 2, (this.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    this.ctx.drawImage(this.#sidesImage, rightSideX, 172, 172, 172, (this.canvasWidth - Ship.width) / 2, (this.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    this.ctx.drawImage(this.#sidesImage, topSideX, 344, 172, 172, (this.canvasWidth - Ship.width) / 2, (this.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    this.ctx.drawImage(this.#sidesImage, bottomSideX, 516, 172, 172, (this.canvasWidth - Ship.width) / 2, (this.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)

    const baseX = this.#destroyed ? 643 : 0
    this.ctx.drawImage(this.#baseImage, baseX, 0, 643, 643, (this.canvasWidth - Ship.width) / 2, (this.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
  }

  
  _drawShield() {
    switch (this.#shield) {
      case 'left':
        this.ctx.translate(this.canvasHalfWidth, this.canvasHalfHeight)
        this.ctx.rotate(180 * Math.PI / 180)
        this.ctx.drawImage(this.#shieldImage, this.#shieldAnimationX, 0, 85, 330, 90, -110, 57, 220)
        this.ctx.resetTransform()
        break
      case 'right':
        this.ctx.drawImage(this.#shieldImage, this.#shieldAnimationX, 0, 85, 330, this.canvasHalfWidth + 90, this.canvasHalfHeight - 110, 57, 220)
        break
      case 'top':
        this.ctx.translate(this.canvasHalfWidth, this.canvasHalfHeight)
        this.ctx.rotate(270 * Math.PI / 180)
        this.ctx.drawImage(this.#shieldImage, this.#shieldAnimationX, 0, 85, 330, 90, -110, 57, 220)
        this.ctx.resetTransform()
        break
      case 'bottom':
        this.ctx.translate(this.canvasHalfWidth, this.canvasHalfHeight)
        this.ctx.rotate(90 * Math.PI / 180)
        this.ctx.drawImage(this.#shieldImage, this.#shieldAnimationX, 0, 85, 330, 90, -110, 57, 220)
        this.ctx.resetTransform()
        break
      default:
        break
    }
  }


  _coreAnimation() {
    if (this.#coreAnimationX === 300 && this.#coreAnimationY === 1400) {
      this.#coreAnimationX = 0
      this.#coreAnimationY = 0
    } else if (this.#coreAnimationX === 900) {
      this.#coreAnimationY < 1500 ? this.#coreAnimationY = this.#coreAnimationY + 100 : this.#coreAnimationY = 0
      this.#coreAnimationX = 0
    } else {
      this.#coreAnimationX = this.#coreAnimationX + 100
    }
  }


  _powerOrbsAnimation() {
    if (this.#orbAnimationX === 900) {
      this.#orbAnimationY < 900
        ? this.#orbAnimationY = this.#orbAnimationY + 100
        : this.#orbAnimationY = 0

        this.#orbAnimationX = 0
    } else {
      this.#orbAnimationX = this.#orbAnimationX + 100
    }

    this.#lightingAnimation < 224 ? this.#lightingAnimation = this.#lightingAnimation + 32 : this.#lightingAnimation = 0
  }



  _shieldAnimation() {
    this.#shieldAnimationX < 850 ? this.#shieldAnimationX = this.#shieldAnimationX + 85 : this.#shieldAnimationX = 0
  }


  _updateHeat() {
    if (this.#heat > 0) {
      this.#heat = this.#heat - 5
    }
  }


  _updateEnergy() {
    if (this.#energy < 100 && this.#shield === 'none') this.#energy = this.#energy + 5
  }


  draw() {
    if (!this.#destroyed) {
      this.ctx.drawImage(this.#coreImage, this.#coreAnimationX, this.#coreAnimationX, 100, 100, (this.canvasWidth - 48) / 2, (this.canvasHeight - 48) / 2, 48, 48)
    }

    this._drawBase()

    if (!this.#destroyed) {
      this.ctx.rotate(45 * Math.PI / 180)
      this.ctx.scale(0.15, 0.15)
      this.ctx.drawImage(this.#lightingImage, this.#lightingAnimation, 256, 32, 128, 3870, -560, 78, 312)
      this.ctx.rotate(90 * Math.PI / 180)
      this.ctx.drawImage(this.#lightingImage, this.#lightingAnimation, 128, 32, 128, -745, -2985 - 770, 78, 312)
      this.ctx.rotate(90 * Math.PI / 180)
      this.ctx.drawImage(this.#lightingImage, this.#lightingAnimation, 384, 32, 128, -3950, 870, 78, 312)
      this.ctx.rotate(90 * Math.PI / 180)
      this.ctx.drawImage(this.#lightingImage, this.#lightingAnimation, 0, 32, 128, 670, 4050, 78, 312)
      this.ctx.resetTransform()

      this.ctx.drawImage(this.#blueOrbImage,this.#orbAnimationX, this.#orbAnimationY, 100, 100, 428, 278, 32, 32)
      this.ctx.drawImage(this.#magentaOrbImage,this.#orbAnimationX, this.#orbAnimationY, 100, 100, 520, 278, 32, 32)
      this.ctx.drawImage(this.#yellowOrbImage,this.#orbAnimationX, this.#orbAnimationY, 100, 100, 428, 370, 32, 32)
      this.ctx.drawImage(this.#greenOrbImage,this.#orbAnimationX, this.#orbAnimationY, 100, 100, 520, 370, 32, 32)
    }

    Object.values(this.#sensors).forEach(el => {
      this.ctx.beginPath()
      this.ctx.fillStyle = el.color
      el.coords.forEach(coordinates => {
        this.ctx.arc(coordinates.x, coordinates.y, 2, 0, 2 * Math.PI)
        this.ctx.closePath()
      })
      this.ctx.fill()
    })

    this.ctx.globalAlpha = 0.5
    const glassX = this.#destroyed ? 643 : 0
    this.ctx.drawImage(this.#glassImage, glassX, 0, 643, 643, (this.canvasWidth - Ship.width) / 2, (this.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    this.ctx.globalAlpha = 1

    this.ctx.drawImage(this.#cannonImage, Ship.cannonCropX[this.#cannon], 0, 673, 673,(this.canvasWidth - 180) / 2, (this.canvasHeight - 180) / 2, 180, 180)
    if (this.#shield !== 'none') this._drawShield()
  }


  /** @param { positions } position  */
  createShield(position) {
    if ((this.#energy < 20 && position !== 'none') || this.#destroyed) return
    this.#shield = position
  }


  /** @param { sideDirections } position */
  shoot(position) {
    if (!this.#corpusCondition[position] || this.#heat >= 100 || this.#destroyed) return

    if (this.#shield === position) this.#shield = 'none'
    if (!this.#demoMode) this.#heat = this.#heat + 10
    this.#cannon = position
    Ship.shootFunction(position)
  }


  shieldDamage() {
    this.#shield = 'none'
    this.#energy = this.#energy - 20
  }

  /** @param { 45 | 135 | 225 | 315 } angle */
  diagonalDamage(angle) {
    if (this.#sensors[angle].coords.length) {
      setTimeout(() => this.#sensors[angle].coords.shift(), 300)
      setTimeout(() => this.#sensors[angle].coords.shift(), 600)
      setTimeout(() => this.#sensors[angle].coords.shift(), 900)
    } else {
      Ship.destroyedFunction()
    }
  }


  /** @param { sideDirections } side  */
  corpusDamage(side) {
    if (this.#cannon === side) this.#cannon = 'none'

    if (this.#corpusCondition[side]) {
      this.#corpusCondition[side] = false
    } else {
      Ship.destroyedFunction()
    }
  }


  destroy() {
    this.#shield = 'none'
    this.#cannon = 'none'
    this.#destroyed = true
    Object.keys(this.#sensors).forEach(x => this.#sensors[x].coords = [])
  }
}

export default Ship