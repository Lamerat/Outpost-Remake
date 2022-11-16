export class Fighter {
  static context
  static fighterSprite = '../images/spaceShipSprites.png'
  static fighterImage = new Image()

  #animationX = 0
  #animationY = 0

  #position

  /**
   * @param  {HTMLCanvasElement } canvas
   * @param { 'left' | 'right' | 'top' | 'bottom' } position
   */
  constructor(canvas, position) {
    Fighter.context = canvas.getContext('2d')
    Fighter.fighterImage.src = Fighter.fighterSprite

    this.#position = position
    setInterval(() => this.update(), 60)
  }

  draw() {
    Fighter.context.drawImage(Fighter.fighterImage, this.#animationX, this.#animationY, 350, 270, 440, 10, 100, 77)
  }

  update() {
    if (this.#animationX === 3150) {
      this.#animationY < 1890
        ? this.#animationY = this.#animationY + 270
        : this.#animationY = 0

        this.#animationX = 0
    } else {
      this.#animationX = this.#animationX + 350
    }
  }

}