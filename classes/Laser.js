export class Laser {
  static context
  static laserSprite = '../images/laserSprite.png'

  #laserImage = new Image()
  #position
  #xPosition = 0
  #yPosition = 0

  /**
   * @param  {HTMLCanvasElement } canvas
   * @param { 'left' | 'right' | 'top' | 'bottom' } position
   */
  constructor(canvas, position) {
    Laser.context = canvas.getContext('2d')
    


    this.#position = position
    this.#laserImage.src = Laser.laserSprite

    switch (position) {
      case 'top':
        this.#xPosition = 485
        this.#yPosition = 220
        break
      case 'bottom':
        this.#xPosition = 485
        this.#yPosition = 430
        break
      case 'left':
        this.#xPosition = -5
        this.#yPosition = 90
        break
      case 'right':
        this.#xPosition = -5
        this.#yPosition = -120
        break
      default:
        break
    }
  }

  update() {
    switch (this.#position) {
      case 'top':
        this.#yPosition = this.#yPosition - 10
        break
      case 'bottom':
        this.#yPosition = this.#yPosition + 10
        break
      case 'left':
        this.#yPosition = this.#yPosition + 10
        break
      case 'right':
        this.#yPosition = this.#yPosition - 10
      default:
        break
    }
  }

  draw() {
    if (this.#position === 'left' || this.#position === 'right') {
      Laser.context.translate(980 / 2, 680 / 2)
      Laser.context.rotate(90 * Math.PI/180)
      Laser.context.drawImage(this.#laserImage, this.#xPosition, this.#yPosition, 10, 30)
      Laser.context.resetTransform()
    } else {
      Laser.context.drawImage(this.#laserImage, this.#xPosition, this.#yPosition, 10, 30)
    }
  }
}