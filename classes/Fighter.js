class Fighter {
  static context
  static fighterSprite = { first: './images/spaceShipSprites.png', second: './images/spaceShipSprites2.png' }
  static explosionSprite = './images/explosion.png'
  static fighterImage = new Image()
  static explosionImage = new Image()
  static shootFunc
  static gameLevel
  static clearFunc
  
  #explosionSound = new Audio('./sounds/explosion.wav')
  #animationX = 0
  #animationY = 0
  #currentAnimation
  #position
  #animationInterval
  #shootTimeout
  #removeTimeout
  #shootCount = 1
  #destroyed = false


  /**
   * @param { HTMLCanvasElement } canvas
   * @param { 'left' | 'right' | 'top' | 'bottom' } position
   * @param { number } gameLevel
   * @param { Function } shootFunc
   * @param { Function } clearFunc
   */
  constructor(canvas, position, gameLevel, shootFunc, clearFunc) {
    Fighter.context = canvas.getContext('2d')

    Fighter.fighterImage.src = gameLevel <= 5 ? Fighter.fighterSprite.first : Fighter.fighterSprite.second
    Fighter.explosionImage.src = Fighter.explosionSprite
    Fighter.gameLevel = gameLevel
    Fighter.shootFunc = shootFunc
    Fighter.clearFunc = clearFunc

    this.#position = position
    this.#currentAnimation = this.arrive

    this.#animationInterval = setInterval(() => this.#currentAnimation(), 60)

    const timeForStay = Math.floor(Math.random() * (20 - 10) + 10)
    this.#removeTimeout = setTimeout(() => {
      this.clean()
    }, timeForStay * 1000)

    this.shootTimer()
  }


  shootTimer () {
    let maxShootWait
    let minShootWait
    switch (Fighter.gameLevel) {
      case 1:
        maxShootWait = 3_000
        minShootWait = 1_500
        break;
      case 2:
        maxShootWait = 3_000
        minShootWait = 1_200
        break
      case 3:
        maxShootWait = 3_000
        minShootWait = 1_000
        break
      case 4:
        maxShootWait = 2_500
        minShootWait = 1_000
        break
      case 5:
        maxShootWait = 2_200
        minShootWait = 1_000
      case 6:
        maxShootWait = 2_000
        minShootWait = 700
        break
      case 7:
        maxShootWait = 1_700
        minShootWait = 500
        break
      case 8:
        maxShootWait = 1_500
        minShootWait = 500
        break
      case 9:
        maxShootWait = 1000
        minShootWait = 500
        break
      case 10:
        maxShootWait = 600
        minShootWait = 300
        break
      default:
        break
    }

    const timeForShoot = Math.floor(Math.random() * (maxShootWait - minShootWait) + minShootWait)
    this.#shootTimeout = setTimeout(() => { this.#animationX = 0; this.#currentAnimation = this.shoot }, timeForShoot * this.#shootCount)
  }


  draw () {
    if (this.#position === 'left') {
      if (this.#destroyed) {
        Fighter.context.drawImage(Fighter.explosionImage, this.#animationX, 0, 200, 200, 0, 290, 100, 100)
      } else {
        Fighter.context.translate(980 / 2, 680 / 2)
        Fighter.context.rotate(270 * Math.PI / 180)
        Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, -50, -480, 100, 77)
        Fighter.context.resetTransform()
      }
    } else if (this.#position === 'right') {
      if (this.#destroyed) {
        Fighter.context.drawImage(Fighter.explosionImage, this.#animationX, 0, 200, 200, 880, 290, 100, 100)
      } else {
        Fighter.context.translate(980 / 2, 680 / 2)
        Fighter.context.rotate(90 * Math.PI / 180)
        Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, -50, -480, 100, 77)
        Fighter.context.resetTransform()
      }
    } else if (this.#position === 'bottom') {
      if (this.#destroyed) {
        Fighter.context.drawImage(Fighter.explosionImage, this.#animationX, 0, 200, 200, 440, 580, 100, 100)
      } else {
        Fighter.context.translate(980 / 2, 680 / 2)
        Fighter.context.rotate(180 * Math.PI / 180)
        Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, -50, -330, 100, 77)
        Fighter.context.resetTransform()
      }
    } else {
      if (this.#destroyed) {
        Fighter.context.drawImage(Fighter.explosionImage, this.#animationX, 0, 200, 200, 440, 0, 100, 100)
      } else {
        Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, 440, 10, 100, 77)
      }
    }
  }


  idle () {
    this.#animationY = 0
    this.#animationX === 3150
      ? this.#animationX = this.#animationX = 0
      : this.#animationX = this.#animationX + 350
  }


  stop () {
    this.#animationY = 270
    if (this.#animationX === 3150) {
      this.#animationX = 0
      this.#currentAnimation = this.idle
    } else {
      this.#animationX = this.#animationX + 350
    }
  }


  arrive () {
    this.#animationY = 540
    if (this.#animationX === 3150) {
      this.#animationX = 0
      this.#currentAnimation = this.stop
    } else {
      this.#animationX = this.#animationX + 350
    }
  }


  shoot () {
    this.#animationY = 1350
    this.#shootCount = this.#shootCount + 0.5
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


  explode () {
    this.#explosionSound.volume = 0.2
    // this.#explosionSound.play()
    if (this.#animationX === 1200) {
      clearInterval(this.#animationInterval)
      Fighter.clearFunc(this.#position)
    } else {
      this.#animationX = this.#animationX + 200
    }
  }


  destroy () {
    clearTimeout(this.#shootTimeout)
    clearTimeout(this.#removeTimeout)
    clearInterval(this.#animationInterval)
    this.#animationInterval = setInterval(() => this.#currentAnimation(), 100)
    this.#destroyed = true
    this.#currentAnimation = this.explode
    this.#animationX = 0
  }


  clean () {
    clearInterval(this.#animationInterval)
    clearTimeout(this.#shootTimeout)
    clearTimeout(this.#removeTimeout)
    Fighter.clearFunc(this.#position)
  }
}

export default Fighter