class Star {
  static context
  static sprite = '../images/star.png'
  static starImage = new Image()

  #xPos
  #yPos
  #animationX
  #animationY

  /**
   * @param { HTMLCanvasElement } canvas
   */
  constructor(canvas, xPos, yPos) {
    Star.context = canvas.getContext('2d')
    Star.starImage.src = Star.sprite
    this.#animationX = Math.floor(Math.random() * (9 - 1) + 1) * 50
    this.#animationY = Math.floor(Math.random() * (4 - 1) + 1) * 50 - 50

    this.#xPos = xPos
    this.#yPos = yPos

    setInterval(() => this.animation(), 100)
  }

  draw() {
    Star.context.drawImage(Star.starImage, this.#animationX, this.#animationY, 50, 50, this.#xPos, this.#yPos, 7, 7)
  }

  animation() {
    if (this.#animationX === 450) {
      this.#animationX = 0
    } else {
      this.#animationX = this.#animationX + 50
    }
  }
}

export default Star