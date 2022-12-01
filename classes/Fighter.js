import GameObject from './GameObject.js'

/** @typedef { 'left' | 'right' | 'top' | 'bottom' } sideDirections */

class Fighter extends GameObject {
  static shootFunc
  static cleanFunc
  static shootTimes = {
    1: { max: 3000, min: 1500 },
    2: { max: 3000, min: 1200 },
    3: { max: 3000, min: 1000 },
    4: { max: 2500, min: 1000 },
    5: { max: 2200, min: 1000 },
    6: { max: 2000, min: 700 },
    7: { max: 1700, min: 500 },
    8: { max: 1500, min: 500 },
    9: { max: 1000, min: 500 },
    10: { max: 600, min: 300 },
    11: { max: 400, min: 300 },
    12: { max: 400, min: 200 },
    13: { max: 300, min: 150 },
    14: { max: 200, min: 150 },
    15: { max: 100, min: 80 },
  }
  
  #gameLevel
  #image
  #position
  #currentAnimation = this._animationArrive
  #animationX = 0
  #animationY = 0
  #shootCount = 1
  #destroyed = false
  #createdTime = new Date()
  #stayTime
  #shootStartTime
  #shootTime

  #animationInterval
  #leaveTimeout
  #shootTimeout

  get destroyed() {
    return this.#destroyed
  }

  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { sideDirections } position 
   * @param { number } gameLevel
   * @param { Function } shootFunc
   * @param { Function } leaveFunc
   */
  constructor(canvas, position, gameLevel, shootFunc, cleanFunc) {
    super(canvas)

    Fighter.shootFunc = shootFunc
    Fighter.cleanFunc = cleanFunc

    this.#image = this._createImage(gameLevel <= 5 ? './images/spaceShipSprites.png' : './images/spaceShipSprites2.png')
    this.#gameLevel = gameLevel
    this.#position = position

    this.#animationInterval = setInterval(() => this.#currentAnimation(), 60)
    this.#stayTime = this._randomBetween(20_000, 10_000)
    this.#leaveTimeout = setTimeout(() => this.destroy(false), this.#stayTime)
    this._shootTimer()
  }  


  _animationArrive () {
    this.#animationY = 540
    if (this.#animationX === 3150) {
      this.#animationX = 0
      this.#currentAnimation = this._animationStop
    } else {
      this.#animationX = this.#animationX + 350
    }
  }


  _animationStop () {
    this.#animationY = 270
    if (this.#animationX === 3150) {
      this.#animationX = 0
      this.#currentAnimation = this._animationIdle
    } else {
      this.#animationX = this.#animationX + 350
    }
  }


  _animationIdle() {
    this.#animationY = 0
    this.#animationX === 3150
      ? this.#animationX = this.#animationX = 0
      : this.#animationX = this.#animationX + 350
  }


  _animationShoot() {
    if (this.#animationX === 3150) {
      this.#animationX = 0
      this.#currentAnimation = this._animationIdle
      this._shootTimer()
    } else if (this.#animationX === 1400) {
      this.#shootCount = this.#shootCount + 0.5
      this.#animationX = this.#animationX + 350
      this.#shootTimeout = null
      Fighter.shootFunc(this.#position)
    } else {
      this.#animationX = this.#animationX + 350
    }
  }


  _shootTimer() {
    const { min, max } = Fighter.shootTimes[this.#gameLevel]
    this.#shootStartTime = new Date()
    this.#shootTime = this._randomBetween(min, max) * this.#shootCount

    this.#shootTimeout = setTimeout(() => {
      this.#animationX = 0
      this.#animationY = 1350
      this.#currentAnimation = this._animationShoot
    }, this.#shootTime)
  }


  /** @param { boolean } destroyed */
  destroy(destroyed) {
    this.#destroyed = true
    clearInterval(this.#animationInterval)
    clearTimeout(this.#shootTimeout)
    clearTimeout(this.#leaveTimeout)
    Fighter.cleanFunc(this.#position, destroyed)
  }


  pause() {
    clearInterval(this.#animationInterval)
    clearTimeout(this.#leaveTimeout)
    this.#stayTime = this.#stayTime - (new Date().getTime() - this.#createdTime.getTime())
    if (this.#shootTimeout) {
      clearTimeout(this.#shootTimeout)
      this.#shootTime = this.#shootTime - (new Date().getTime() - this.#shootStartTime.getTime())
    }
  }

  unpause() {
    this.#animationInterval = setInterval(() => this.#currentAnimation(), 60)
    this.#leaveTimeout = setTimeout(() => this.destroy(false), this.#stayTime)
    this.#createdTime = new Date()

    if (this.#shootTimeout && !this.#destroyed) {
      this.#shootTimeout = setTimeout(() => {
        this.#animationX = 0
        this.#animationY = 1350
        this.#currentAnimation = this._animationShoot
      }, this.#shootTime)
    } else {
      this._shootTimer()
    }
  }


  draw () {
    if (this.#position === 'left') {
      this.ctx.translate(this.canvasHalfWidth, this.canvasHalfHeight)
      this.ctx.rotate(270 * Math.PI / 180)
      this.ctx.drawImage(this.#image, this.#animationX, this.#animationY, 350, 270, -50, -480, 100, 77)
      this.ctx.resetTransform()
    } else if (this.#position === 'right') {
      this.ctx.translate(this.canvasHalfWidth, this.canvasHalfHeight)
      this.ctx.rotate(90 * Math.PI / 180)
      this.ctx.drawImage(this.#image, this.#animationX, this.#animationY, 350, 270, -50, -480, 100, 77)
      this.ctx.resetTransform()
    } else if (this.#position === 'top') {
      this.ctx.drawImage(this.#image, this.#animationX, this.#animationY, 350, 270, 440, 10, 100, 77)
    } else {
      this.ctx.translate(this.canvasHalfWidth, this.canvasHalfHeight)
      this.ctx.rotate(180 * Math.PI / 180)
      this.ctx.drawImage(this.#image, this.#animationX, this.#animationY, 350, 270, -50, -330, 100, 77)
      this.ctx.resetTransform()
    }
  }
}

export default Fighter