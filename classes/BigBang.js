import GameObject from './GameObject.js'

class BigBang extends GameObject {
  static clearFunc
  static size = 300

  #image = super._createImage('./images/explosionCore.png')
  #animationX = 0
  #animationY = 0
  #animationInterval

  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { Function } clearFunc
   */
  constructor(canvas, clearFunc) {
    super(canvas)
    BigBang.clearFunc = clearFunc
    this.#animationInterval = setInterval(() => this._animation(), 20)
  }


  _animation() {
    if (this.#animationX === 3584 && this.#animationY === 3584) {
      this.#animationX = 0
      this.#animationY = 0
      clearInterval(this.#animationInterval)
      BigBang.clearFunc()
    } else if (this.#animationX === 3584) {
      this.#animationY < 3584 ? this.#animationY = this.#animationY + 512 : this.#animationY = 0
      this.#animationX = 0
    } else {
      this.#animationX = this.#animationX + 512
    }
  }


  pause() {
    clearInterval(this.#animationInterval)
  }


  unpause() {
    this.#animationInterval = setInterval(() => this._animation(), 20)
  }


  draw() {
    this.ctx.drawImage(this.#image, this.#animationX, this.#animationY, 512, 512, (this.canvasWidth - BigBang.size) / 2, (this.canvasHeight - BigBang.size) / 2, BigBang.size, BigBang.size)
  }
}

export default BigBang