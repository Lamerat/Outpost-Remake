class BigBang {
  static context
  static sprite = './images/explosionCore.png'
  static image = new Image()
  static callbackFunc

  #interval
  #animationX = 0
  #animationY = 0


  /**
   * @param { HTMLCanvasElement } canvas
   * @param { Function } callback
   */
  constructor (canvas, callback) {
    BigBang.context = canvas.getContext('2d')
    BigBang.image.src = BigBang.sprite
    BigBang.callbackFunc = callback

    this.#interval = setInterval(() => this.animate(), 20)
  }

  draw () {
    BigBang.context.drawImage(BigBang.image, this.#animationX, this.#animationY, 512, 512, 340, 190, 300, 300)
  }

  animate () {
    if (this.#animationX === 3584 && this.#animationY === 3584) {
      this.#animationX = 0
      this.#animationY = 0
      clearInterval(this.#interval)
      BigBang.callbackFunc()
    } else if (this.#animationX === 3584) {
      this.#animationY < 3584
        ? this.#animationY = this.#animationY + 512
        : this.#animationY = 0
      
      this.#animationX = 0
    } else {
      this.#animationX = this.#animationX + 512
    }
  }
}

export default BigBang