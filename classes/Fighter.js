class Fighter {
  static context
  static fighterSprite = '../images/spaceShipSprites.png'
  static fighterImage = new Image()
  static shootFunc
  static gameLevel

  #animationX = 0
  #animationY = 0
  #currentAnimation
  #position
  #animationInterval
  #shootTimeout


  /**
   * @param  {HTMLCanvasElement } canvas
   * @param { 'left' | 'right' | 'top' | 'bottom' } position
   * @param { number } gameLevel
   * @param { Function } shootFunc
   */
  constructor(canvas, position, gameLevel, shootFunc) {
    Fighter.context = canvas.getContext('2d')
    Fighter.fighterImage.src = Fighter.fighterSprite
    Fighter.gameLevel = gameLevel
    Fighter.shootFunc = shootFunc

    this.#position = position
    this.#currentAnimation = this.arrive

    this.#animationInterval = setInterval(() => this.#currentAnimation(), 60)

    this.shootTimer()
  }


  shootTimer() {
    let maxShootWait
    let minShootWait
    switch (Fighter.gameLevel) {
      case 1:
        maxShootWait = 10000
        minShootWait = 3000
        break;
    
      default:
        break;
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
  }
}

export default Fighter