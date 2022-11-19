export class Bomb {
  static counter = 0
  static context
  static bombSprite = '../images/enemyBombSprite.png'
  static bombImage = new Image()
  static speed = 10

  #animationX = 0
  #animationY = 0
  #xPosition = 0
  #yPosition = 0
  #position
  #id

  get id() {
    return this.#id
  }

  get coordinates() {
    return { position: this.#position, x: this.#xPosition, y: this.#yPosition }
  }

  /**
   * @param  {HTMLCanvasElement } canvas
   * @param { 'left' | 'right' | 'top' | 'bottom' } position
   */
  constructor(canvas, position) {
    Bomb.context = canvas.getContext('2d')
    Bomb.bombImage.src = Bomb.bombSprite
    Bomb.counter = Bomb.counter + 1

    this.#id = Bomb.counter
    this.#position = position

    switch (position) {
      case 'top':
        this.#xPosition = 475
        this.#yPosition = 80
        break
      case 'bottom':
        this.#xPosition = 475
        this.#yPosition = 570
        break
      case 'left':
        this.#xPosition = 80
        this.#yPosition = 325
        break
      case 'right':
        this.#xPosition = 870
        this.#yPosition = 325
        break
      default:
        break
    }

    setInterval(() => this.animation(), 20)
  }

  draw() {
    Bomb.context.drawImage(Bomb.bombImage, this.#animationX, this.#animationY, 200, 200, this.#xPosition, this.#yPosition, 30, 30)
  }

  animation() {
    if (this.#animationX === 1000 && this.#animationY === 200) {
      this.#animationX = 0
      this.#animationY = 0
    } else if (this.#animationX === 1200) {
      this.#animationY < 200
        ? this.#animationY = this.#animationY + 200
        : this.#animationY = 0

        this.#animationX = 0
    } else {
      this.#animationX = this.#animationX + 200
    }
  }

  update() {
    switch (this.#position) {
      case 'top':
        this.#yPosition = this.#yPosition + Bomb.speed
        break
      case 'bottom':
        this.#yPosition = this.#yPosition - Bomb.speed
        break
      case 'left':
        this.#xPosition = this.#xPosition + Bomb.speed
        break
      case 'right':
        this.#xPosition = this.#xPosition - Bomb.speed
      default:
        break
    }
  }
}