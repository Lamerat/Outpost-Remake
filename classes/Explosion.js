import GameObject from './GameObject.js'

class Explosion extends GameObject {
  static counter = 0  

  #sound = new Audio('./sounds/explosion2.mp3')
  #image = super._createImage('./images/explosion.png')
  #id
  #xPos
  #yPos
  #size = 100
  #animationX = 0
  #animationInterval
  #clearFunc

  get id() {
    return this.#id
  }


  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { number } xPos
   * @param { number } yPos
   * @param { number } size
   * @param { Function } clearFunc
   */
  constructor(canvas, xPos, yPos, size, clearFunc) {
    super(canvas)

    Explosion.counter = Explosion.counter + 1
    this.#id = Explosion.counter
    
    this.#clearFunc = clearFunc
    this.#xPos = xPos - size / 2
    this.#yPos = yPos - size / 2
    this.#size = size

    // this.#sound.volume = 0.1
    // this.#sound.play()

    this.#animationInterval = setInterval(() => this._animation(), 100)
  }


  _animation() {
    if (this.#animationX === 1200) {
      clearInterval(this.#animationInterval)
      this.#clearFunc(this.#id)
    } else {
      this.#animationX = this.#animationX + 200
    }
  }

  
  pause() {
    clearInterval(this.#animationInterval)
  }


  unpause() {
    this.#animationInterval = setInterval(() => this._animation(), 100)
  }


  draw() {
    this.ctx.drawImage(this.#image, this.#animationX, 0, 200, 200, this.#xPos, this.#yPos, this.#size, this.#size)
  }
}

export default Explosion