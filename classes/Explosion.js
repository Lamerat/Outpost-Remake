class Explosion {
  static counter = 0
  static context
  static sprite = '../images/explosion.png'
  static explosionImage = new Image()
  static clearFunction

  #sound = new Audio('../sounds/explosion2.mp3')
  #animationX = 0
  #explosionWidth = 100   // default for normal
  #explosionHeight = 100  // default for normal
  #positionX
  #positionY
  #id
  #animationInterval

  get id () {
    return this.#id
  }


  /**
   * @param { HTMLCanvasElement } canvas
   * @param { { x: number, y: number } } coordinates
   * @param { 'small' | 'normal' } size
   * @param { Function } clearFunc
   */
  constructor(canvas, coordinates, size, clearFunc) {
    Explosion.context = canvas.getContext('2d')
    Explosion.explosionImage.src = Explosion.sprite
    Explosion.clearFunction = clearFunc
    Explosion.counter = Explosion.counter + 1
    this.#id = Explosion.counter
    
    if (size === 'small') {
      this.#explosionWidth = 60
      this.#explosionHeight = 60
    }

    this.#positionX = coordinates.x
    this.#positionY = coordinates.y
    
    this.#sound.volume = 0.1
    // this.#sound.play()
    
    this.#animationInterval = setInterval(() => this.animation(), 100)
  }

  draw() {
    Explosion.context.drawImage(Explosion.explosionImage, this.#animationX, 0, 200, 200, this.#positionX, this.#positionY, this.#explosionWidth, this.#explosionHeight)
  }

  animation() {
    if (this.#animationX === 1200) {
      clearInterval(this.#animationInterval)
      Explosion.clearFunction(this.#id)
    } else {
      this.#animationX = this.#animationX + 200
    }
  }
}

export default Explosion