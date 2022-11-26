class Satellite {
  static context
  static mainSprite = '../images/satellite.png'
  static sphereSprite = '../images/satelliteSphere.png'
  static explosionSprite = '../images/satelliteExplode.png'
  static thunderSprite = '../images/thunder.png'
  static mainImage = new Image()
  static sphereImage = new Image()
  static explosionImage = new Image()
  static thunderImage = new Image()
  static lastAngle = 46
  static radius = 250
  static importantAngles = [0, 90 , 180, 270]
  static finishFunc
  static damageFunc
  static shootAngles = {
    45: 'bottomRight',
    135: 'bottomLeft',
    225: 'topLeft',
    315: 'topRight'
  }

  #angle
  #coreInterval
  #mainInterval
  #thunderInterval
  #coreAnimationX = 0
  #coreAnimationY = 0
  #mainAnimationX = 0
  #mainAnimationY = 0
  #thunderAnimationX = 0
  #thunderAnimationY = 0
  #thunderX = 0
  #thunderY = 0
  #xPos
  #yPos
  #destroyed = false
  #shoot = false

  /**
   * Convert degrees to radians
   * @param { number } deg 
   * @returns { number }
   */
  static degrees (deg) {
    return deg * 0.0174532925
  }


  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { Function } finishFunc
   * @param { Function } damageFunc
   */
  constructor (canvas, finishFunc, damageFunc) {
    Satellite.context = canvas.getContext('2d')
    Satellite.mainImage.src = Satellite.mainSprite
    Satellite.sphereImage.src = Satellite.sphereSprite
    Satellite.explosionImage.src = Satellite.explosionSprite
    Satellite.thunderImage.src = Satellite.thunderSprite
    Satellite.finishFunc = finishFunc
    Satellite.damageFunc = damageFunc

    this.#angle = Satellite.lastAngle
    this.#coreInterval = setInterval(() => this.updateCore(), 100)
    this.#mainInterval = setInterval(() => this.updateMain(), 100)
  }


  draw () {
    if (this.#destroyed === false) {
      if (Object.keys(Satellite.shootAngles).map(Number).includes(this.#angle)) {
        switch (this.#angle) {
          case 45:
            this.#thunderAnimationY = 560
            this.#thunderX = 543
            this.#thunderY = 396
            break
          case 135:
            this.#thunderAnimationY = 840
            this.#thunderX = 313
            this.#thunderY = 396
          break
          case 225:
            this.#thunderAnimationY = 0
            this.#thunderX = 313
            this.#thunderY = 163
            break
          case 315:
            this.#thunderAnimationY = 280
            this.#thunderX = 543
            this.#thunderY = 163
            break
          default:
            break;
        }


        if (this.#shoot === false) {
          this.#shoot = true
          this.#thunderInterval = setInterval(() => this.generateThunder(), 40)
        }
      } else {
        this.#angle = this.#angle >= 359 ? 0 : this.#angle + 1
      }
    }

    if (Satellite.importantAngles.includes(this.#angle)) Satellite.lastAngle = this.#angle + 5

    this.#xPos = Math.cos(Satellite.degrees(this.#angle)) * Satellite.radius + 465
    this.#yPos = Math.sin(Satellite.degrees(this.#angle)) * Satellite.radius + 315

    const coreX = Math.cos(Satellite.degrees(this.#angle)) * Satellite.radius
    const coreY = Math.sin(Satellite.degrees(this.#angle)) * Satellite.radius

    if (this.#shoot) {
      Satellite.context.drawImage(Satellite.thunderImage, this.#thunderAnimationX, this.#thunderAnimationY, 280, 280, this.#thunderX, this.#thunderY, 123, 123)
    }

    if (this.#destroyed) {
      Satellite.context.drawImage(Satellite.explosionImage, this.#mainAnimationX, 0, 192, 192, this.#xPos - 50, this.#yPos - 50, 150, 150)
    } else {
      Satellite.context.drawImage(Satellite.mainImage, this.#mainAnimationX, this.#mainAnimationY, 300, 300, this.#xPos, this.#yPos, 50, 50)
      Satellite.context.drawImage(Satellite.sphereImage, this.#coreAnimationX, this.#coreAnimationY, 280, 280, coreX + 490 - 12.5 , coreY + 340 - 12.5, 25, 25)
    }
  }


  updateCore () {
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


  updateMain () {
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


  generateExplosion () {
    if (this.#mainAnimationX === 768) {
      clearInterval(this.#mainInterval)
      setTimeout(() => Satellite.finishFunc(), 1000)
    } else {
      this.#mainAnimationX = this.#mainAnimationX + 192
    }
  }


  generateThunder () {
    if (this.#thunderAnimationX === 1960) {
      clearInterval(this.#thunderInterval)
      this.#thunderAnimationX = 0
      this.#shoot = false
      Satellite.damageFunc(Satellite.shootAngles[this.#angle])
      this.#angle = this.#angle + 1
    } else {
      this.#thunderAnimationX = this.#thunderAnimationX + 280
    }
  }


  getCoordinates () {
    return { x: this.#xPos + 20, y: this.#yPos + 20, r: 20 }
  }


  destroy () {
    this.#destroyed = true
    clearInterval(this.#coreInterval)
    clearInterval(this.#mainInterval)
    this.#mainAnimationX = 0
    this.#mainInterval = setInterval(() => this.generateExplosion(), 150)
  }
}

export default Satellite