import GameObject from './GameObject.js'

class Star extends GameObject {
  #image = super._createImage('./images/star.png')
  #xPos
  #yPos
  #animationX
  #animationY

  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { number } xPos 
   * @param { number } yPos 
   */
  constructor(canvas, xPos, yPos) {
    super(canvas)

    this.#animationX = super._randomBetween(9, 1) * 50
    this.#animationY = super._randomBetween(4, 1) * 50 - 50
    this.#xPos = xPos
    this.#yPos = yPos

    setInterval(() => this.animation(), 100)
  }

  draw() {
    this.ctx.drawImage(this.#image, this.#animationX, this.#animationY, 50, 50, this.#xPos, this.#yPos, 7, 7)
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