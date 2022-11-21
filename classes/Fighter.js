class Fighter {
  static context
  static fighterSprite = { first: '../images/spaceShipSprites.png', second: '../images/spaceShipSprites2.png'}
  static fighterImage = new Image()
  static shootFunc
  static gameLevel

  #animationX = 0
  #animationY = 0
  #currentAnimation
  #position
  #animationInterval
  #shootTimeout
  #removeTimeout


  /**
   * @param  {HTMLCanvasElement } canvas
   * @param { 'left' | 'right' | 'top' | 'bottom' } position
   * @param { number } gameLevel
   * @param { Function } shootFunc
   * @param { object } positionObject
   */
  constructor(canvas, position, gameLevel, shootFunc, positionObject) {
    Fighter.context = canvas.getContext('2d')

    Fighter.fighterImage.src = gameLevel <= 10 ? Fighter.fighterSprite.first : Fighter.fighterSprite.second
    Fighter.gameLevel = gameLevel
    Fighter.shootFunc = shootFunc

    this.#position = position
    this.#currentAnimation = this.arrive

    this.#animationInterval = setInterval(() => this.#currentAnimation(), 60)

    const timeForStay = Math.floor(Math.random() * (30 - 15) + 15)
    this.#removeTimeout = setTimeout(() => {
      positionObject[position] = null
      this.destroy()
    }, timeForStay * 1000)

    this.shootTimer()
  }


  shootTimer() {
    let maxShootWait
    let minShootWait
    switch (Fighter.gameLevel) {
      case 1:
        maxShootWait = 30_000
        minShootWait = 10_000
        break;
      case 2:
        maxShootWait = 28_000
        minShootWait = 8_000
        break
      case 3:
        maxShootWait = 26_000
        minShootWait = 6_000
        break
      case 4:
        maxShootWait = 24_000
        minShootWait = 5_000
        break
      case 5:
        maxShootWait = 22_000
        minShootWait = 4_000
      case 6:
        maxShootWait = 20_000
        minShootWait = 4_000
        break
      default:
        break
    }

    const timeForShoot = Math.floor(Math.random() * (maxShootWait - minShootWait) + minShootWait)
    this.#shootTimeout = setTimeout(() => { this.#animationX = 0; this.#currentAnimation = this.shoot }, timeForShoot)
  }


  draw() {
    if (this.#position === 'left') {
      Fighter.context.translate(980 / 2, 680 / 2)
      Fighter.context.rotate(270 * Math.PI / 180)
      Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, -50, -480, 100, 77)
      Fighter.context.resetTransform()
    } else if (this.#position === 'right') {
      Fighter.context.translate(980 / 2, 680 / 2)
      Fighter.context.rotate(90 * Math.PI / 180)
      Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, -50, -480, 100, 77)
      Fighter.context.resetTransform()
    } else if (this.#position === 'bottom') {
      Fighter.context.translate(980 / 2, 680 / 2)
      Fighter.context.rotate(180 * Math.PI / 180)
      Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, -50, -330, 100, 77)
      Fighter.context.resetTransform()
    } else {
      Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, 440, 10, 100, 77)
    }
    
  }


  idle() {
    this.#animationY = 0
    this.#animationX === 3150
      ? this.#animationX = this.#animationX = 0
      : this.#animationX = this.#animationX + 350
  }


  stop() {
    this.#animationY = 270
    if (this.#animationX === 3150) {
      this.#animationX = 0
      this.#currentAnimation = this.idle
    } else {
      this.#animationX = this.#animationX + 350
    }
  }


  arrive() {
    this.#animationY = 540
    if (this.#animationX === 3150) {
      this.#animationX = 0
      this.#currentAnimation = this.stop
    } else {
      this.#animationX = this.#animationX + 350
    }
  }


  shoot() {
    this.#animationY = 1350
    if (this.#animationX === 3150) {
      this.#animationX = 0
      this.#currentAnimation = this.idle
      this.shootTimer()
    } else if (this.#animationX === 1400) {
      Fighter.shootFunc(this.#position)
      this.#animationX = this.#animationX + 350
    } else {
      this.#animationX = this.#animationX + 350
    }
  }

  destroy() {
    clearInterval(this.#animationInterval)
    clearTimeout(this.#shootTimeout)
    clearTimeout(this.#removeTimeout)
  }
}

export default Fighter