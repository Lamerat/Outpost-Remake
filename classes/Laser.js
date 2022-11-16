export class Laser {
  static counter = 0
  static context
  static laserSprite = '../images/laserSprite.png'

  #laserImage = new Image()
  #id
  #position
  #xPosition = 0
  #yPosition = 0

  /**
   * @param  {HTMLCanvasElement } canvas
   * @param { 'left' | 'right' | 'top' | 'bottom' } position
   */
  constructor(canvas, position) {
    Laser.context = canvas.getContext('2d')

    this.#id = Laser.counter
    Laser.counter = Laser.counter + 1

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
        this.#xPosition = 370
        this.#yPosition = 335
        break
      case 'right':
        this.#xPosition = 580
        this.#yPosition = 335
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
        this.#xPosition = this.#xPosition - 10
        break
      case 'right':
        this.#xPosition = this.#xPosition + 10
      default:
        break
    }
  }

  draw() {
    if (this.#position === 'left' || this.#position === 'right') {
      Laser.context.drawImage(this.#laserImage, 0, 300, 300, 100, this.#xPosition, this.#yPosition, 30, 10)
    } else {
      Laser.context.drawImage(this.#laserImage, 0, 0, 100, 300, this.#xPosition, this.#yPosition, 10, 30)
    }
  }
}