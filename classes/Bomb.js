export class Bomb {
  static context
  static bombSprite = '../images/enemyBombSprite.png'
  static bombImage = new Image()

  #animationX = 0
  #animationY = 0

  #position

  /**
   * @param  {HTMLCanvasElement } canvas
   * @param { 'left' | 'right' | 'top' | 'bottom' } position
   */
  constructor(canvas, position) {
    Bomb.context = canvas.getContext('2d')
    Bomb.bombImage.src = Bomb.bombSprite

    this.#position = position
    setInterval(() => this.animation(), 20)
  }

  draw() {
    Bomb.context.drawImage(Bomb.bombImage, this.#animationX, this.#animationY, 200, 200, 475, 80, 30, 30)
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
}