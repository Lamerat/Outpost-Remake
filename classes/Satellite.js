class Satellite {
  static context
  static mainSprite = '../images/satellite.png'
  static sphereSprite = '../images/satelliteSphere.png'
  static explosionSprite = '../images/satelliteExplode.png'
  static mainImage = new Image()
  static sphereImage = new Image()
  static explosionImage = new Image()
  static lastAngle = 5
  static radius = 250
  static importantAngles = [0, 90 , 180, 270]
  static finishFunc

  #angle
  #coreInterval
  #mainInterval
  #coreAnimationX = 0
  #coreAnimationY = 0
  #mainAnimationX = 0
  #mainAnimationY = 0
  #xPos
  #yPos
  #destroyed = false

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
   */
  constructor (canvas, finishFunc) {
    Satellite.context = canvas.getContext('2d')
    Satellite.mainImage.src = Satellite.mainSprite
    Satellite.sphereImage.src = Satellite.sphereSprite
    Satellite.explosionImage.src = Satellite.explosionSprite
    Satellite.finishFunc = finishFunc

    this.#angle = Satellite.lastAngle
    this.#coreInterval = setInterval(() => this.updateCore(), 100)
    this.#mainInterval = setInterval(() => this.updateMain(), 100)

    // setInterval(() => this.generateExplosion(), 100)
  }



  draw () {
    if (this.#destroyed === false) this.#angle = this.#angle >= 359 ? 0 : this.#angle + 1

    if (Satellite.importantAngles.includes(this.#angle)) Satellite.lastAngle = this.#angle + 5

    this.#xPos = Math.cos(Satellite.degrees(this.#angle)) * Satellite.radius + 465
    this.#yPos = Math.sin(Satellite.degrees(this.#angle)) * Satellite.radius + 315

    const coreX = Math.cos(Satellite.degrees(this.#angle)) * Satellite.radius
    const coreY = Math.sin(Satellite.degrees(this.#angle)) * Satellite.radius

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
      // this.#mainAnimationX = 0
      clearInterval(this.#mainInterval)
      setTimeout(() => Satellite.finishFunc(), 1000)
    } else {
      this.#mainAnimationX = this.#mainAnimationX + 192
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