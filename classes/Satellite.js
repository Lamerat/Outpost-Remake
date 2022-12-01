import GameObject from './GameObject.js'

class Satellite extends GameObject {
  static lastAngle = 46
  static radius = 250
  static importantAngles = [0, 90 , 180, 270]
  static finishFunc
  static damageFunc
  static shootAngles = {
    45: { thunderAnimationY: 560, thunderX: 543, thunderY: 396 },
    135: { thunderAnimationY: 840, thunderX: 313, thunderY: 396 },
    225: { thunderAnimationY: 0, thunderX: 313, thunderY: 163 },
    315: { thunderAnimationY: 280, thunderX: 543, thunderY: 163 },
  }
  static degrees (deg) {
    return deg * 0.0174532925
  }

  #mainImage = this._createImage('./images/satellite.png')
  #coreImage = this._createImage('./images/satelliteSphere.png')
  #explosionImage = this._createImage('./images/satelliteExplode.png')
  #thunderImage = this._createImage('./images/thunder.png')
  #destroyed = false
  #shoot = false
  #angle
  #xPos
  #yPos
  #thunderX = 0
  #thunderY = 0
  #mainAnimationX = 0
  #mainAnimationY = 0
  #coreAnimationX = 0
  #coreAnimationY = 0
  #thunderAnimationX = 0
  #thunderAnimationY = 0
  #animationInterval
  #thunderInterval

  get destroyed() {
    return this.#destroyed
  }


  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { Function } damageFunc
   * @param { Function } finishFunc
   */
  constructor (canvas, damageFunc, finishFunc) {
    super(canvas)
    Satellite.damageFunc = damageFunc
    Satellite.finishFunc = finishFunc

    this.#angle = Satellite.lastAngle

    this.#animationInterval = setInterval(() => {
      this._animateMain()
      this._animateCore()
    }, 100)
  }


  _animateMain() {
    if (this.#mainAnimationX === 900 && this.#mainAnimationY === 1200) {
      this.#mainAnimationX = 0
      this.#mainAnimationY = 0
    } else if (this.#mainAnimationX === 1200) {
      this.#mainAnimationY < 1200
        ? this.#mainAnimationY = this.#mainAnimationY + 300
        : this.#mainAnimationY = 0
      
      this.#mainAnimationX = 0
    } else {
      this.#mainAnimationX = this.#mainAnimationX + 300
    }
  }


  _animateCore() {
    if (this.#coreAnimationX === 1680 && this.#coreAnimationY === 840) {
      this.#coreAnimationX = 0
      this.#coreAnimationY = 0
    } else if (this.#coreAnimationX === 1680) {
      this.#coreAnimationY < 840
        ? this.#coreAnimationY = this.#coreAnimationY + 280
        : this.#coreAnimationY = 0
      
      this.#coreAnimationX = 0
    } else {
      this.#coreAnimationX = this.#coreAnimationX + 280
    }
  }


  _generateThunder () {
    if (this.#thunderAnimationX === 1960) {
      clearInterval(this.#thunderInterval)
      this.#thunderAnimationX = 0
      this.#shoot = false
      Satellite.damageFunc(this.#angle)
      this.#angle = this.#angle + 1
    } else {
      this.#thunderAnimationX = this.#thunderAnimationX + 280
    }
  }


  _explode () {
    if (this.#mainAnimationX === 768) {
      clearInterval(this.#animationInterval)
      setTimeout(() => Satellite.finishFunc(), 1000)
    } else {
      this.#mainAnimationX = this.#mainAnimationX + 192
    }
  }


  getCoordinates () {
    return { x: this.#xPos + 20, y: this.#yPos + 20, r: 20 }
  }


  destroy() {
    this.#destroyed = true
    clearInterval(this.#animationInterval)
    this.#mainAnimationX = 0
    this.#animationInterval = setInterval(() => this._explode(), 150)
  }


  clean() {
    clearInterval(this.#animationInterval)
  }


  pause() {
    clearInterval(this.#animationInterval)
    if (this.#shoot === true) clearInterval(this.#thunderInterval)
  }


  unpause() {
    if (this.#destroyed) {
      this.#animationInterval = setInterval(() => this._explode(), 150)
    } else {
      this.#animationInterval = setInterval(() => {
        this._animateMain()
        this._animateCore()
      }, 100)
      
      if (this.#shoot === true) this.#thunderInterval = setInterval(() => this._generateThunder(), 40)
    }
  }


  draw() {
    if (!this.#destroyed && Object.keys(Satellite.shootAngles).map(Number).includes(this.#angle)) {
      this.#thunderAnimationY = Satellite.shootAngles[this.#angle].thunderAnimationY
      this.#thunderX = Satellite.shootAngles[this.#angle].thunderX
      this.#thunderY = Satellite.shootAngles[this.#angle].thunderY

      if (this.#shoot === false) {
        this.#shoot = true
        this.#thunderInterval = setInterval(() => this._generateThunder(), 40)
      }
    } else if (!this.#destroyed) {
      this.#angle = this.#angle >= 359 ? 0 : this.#angle + 1
    }

    if (Satellite.importantAngles.includes(this.#angle)) Satellite.lastAngle = this.#angle + 46

    this.#xPos = Math.cos(Satellite.degrees(this.#angle)) * Satellite.radius + 465
    this.#yPos = Math.sin(Satellite.degrees(this.#angle)) * Satellite.radius + 315

    const coreX = Math.cos(Satellite.degrees(this.#angle)) * Satellite.radius
    const coreY = Math.sin(Satellite.degrees(this.#angle)) * Satellite.radius

    if (this.#shoot) {
      this.ctx.drawImage(this.#thunderImage, this.#thunderAnimationX, this.#thunderAnimationY, 280, 280, this.#thunderX, this.#thunderY, 123, 123)
    }

    if (this.#destroyed) {
      this.ctx.drawImage(this.#explosionImage, this.#mainAnimationX, 0, 192, 192, this.#xPos - 50, this.#yPos - 50, 150, 150)
    } else {
      this.ctx.drawImage(this.#mainImage, this.#mainAnimationX, this.#mainAnimationY, 300, 300, this.#xPos, this.#yPos, 50, 50)
      this.ctx.drawImage(this.#coreImage, this.#coreAnimationX, this.#coreAnimationY, 280, 280, coreX + 490 - 12.5 , coreY + 340 - 12.5, 25, 25)
    }
  }
}

export default Satellite