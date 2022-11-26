class Satellite {
  static context
  static mainSprite = '../images/satellite.png'
  static sphereSprite = '../images/satelliteSphere.png'
  static mainImage = new Image()
  static sphereImage = new Image()
  static lastAngle = 10
  static radius = 250

  #angle
  #coreInterval
  #mainInterval
  #coreAnimationX = 0
  #coreAnimationY = 0
  #mainAnimationX = 0
  #mainAnimationY = 0

  /**
   * Convert degrees to radians
   * @param { number } deg 
   * @returns { number }
   */
  static degrees (deg) {
    return deg * 0.0174532925
  }

  /**
   * 
   * @param { HTMLCanvasElement } canvas 
   */
  constructor (canvas) {
    Satellite.context = canvas.getContext('2d')
    Satellite.mainImage.src = Satellite.mainSprite
    Satellite.sphereImage.src = Satellite.sphereSprite
    this.#angle = Satellite.lastAngle
    this.#coreInterval = setInterval(() => this.updateCore(), 60)
    this.#coreInterval = setInterval(() => this.updateMain(), 100)
  }



  draw () {
    this.#angle = this.#angle > 359 ? 0 : this.#angle + 0.5

    const x = Math.cos(Satellite.degrees(this.#angle)) * Satellite.radius
    const y = Math.sin(Satellite.degrees(this.#angle)) * Satellite.radius

    const coreX = Math.cos(Satellite.degrees(this.#angle)) * Satellite.radius
    const coreY = Math.sin(Satellite.degrees(this.#angle)) * Satellite.radius

    Satellite.context.drawImage(Satellite.mainImage, this.#mainAnimationX, this.#mainAnimationY, 300, 300, x + 490 - 25, y + 340 - 25, 50, 50)
    Satellite.context.drawImage(Satellite.sphereImage, this.#coreAnimationX, this.#coreAnimationY, 280, 280, coreX + 490 - 12.5 , coreY + 340 - 12.5, 25, 25)
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
}

export default Satellite