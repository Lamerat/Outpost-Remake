import GameObject from './GameObject.js'

/** @typedef { 'left' | 'right' | 'top' | 'bottom' } sideDirections */

class Laser extends GameObject {
  static counter = 0
  static speed = 10
  static clearFunc
  static startPositions = {
    left: { x: 370, y: 335 },
    right: { x: 580, y: 335 },
    top: { x: 485, y: 220 },
    bottom: { x: 485, y: 430 },
  }


  #id
  #sound = new Audio('./sounds/laser.mp3')
  #image = super._createImage('./images/laserSprite.png')
  #xPos
  #yPos
  #position

  get id() {
    return this.#id
  }

  get position() {
    return this.#position
  }


  /**
   * @param { HTMLCanvasElement } canvas 
   * @param { sideDirections } position
   */
  constructor(canvas, position, clearFunc) {
    super(canvas)

    Laser.clearFunc = clearFunc
    Laser.counter = Laser.counter + 1
    this.#id = Laser.counter
    this.#xPos = Laser.startPositions[position].x
    this.#yPos = Laser.startPositions[position].y
    this.#position = position

    // this.#sound.volume = 0.1
    // this.#sound.play()
  }


  _updatePosition() {
    switch (this.#position) {
      case 'left':
        this.#xPos = this.#xPos - Laser.speed
        break
      case 'right':
        this.#xPos = this.#xPos + Laser.speed
        break
      case 'top':
        this.#yPos = this.#yPos - Laser.speed
        break
      case 'bottom':
        this.#yPos = this.#yPos + Laser.speed
        break
      default:
        break
    }

    if (this.#xPos >= this.canvasWidth || this.#yPos >= this.canvasHeight || this.#xPos + 30 <= 0 || this.#yPos + 30 <= 0) Laser.clearFunc(this.#id)
  }


  /**
   * @param { number } cx Circle center x
   * @param { number } cy Circle center y
   * @param { number } r Circle radius 
   * @returns { boolean }
   */
  collisionWithCircle(cx, cy, r) {
    let px = this.canvasHalfWidth
    let py = this.canvasHalfHeight

    if (this.#position === 'top' || this.#position === 'bottom') {
      py = this.#position === 'top' ? this.#yPos + 5 : this.#yPos + 25
    } else {
      px = this.#position === 'left' ? this.#xPos + 5 : this.#xPos + 25
    }

    const distX = px - cx
    const distY = py - cy
    const distance = Math.sqrt( (distX * distX) + (distY * distY) )

    if (distance <= r) {
      Laser.clearFunc(this.#id)
      return true
    }

    return false
  }


  coordinates() {
    return { position: this.#position, x: this.#xPos, y: this.#yPos }
  }


  draw() {
    this.#position === 'left' || this.#position === 'right' 
      ? super.ctx.drawImage(this.#image, 0, 300, 300, 100, this.#xPos, this.#yPos, 30, 10)
      : super.ctx.drawImage(this.#image, 0, 0, 100, 300, this.#xPos, this.#yPos, 10, 30)
    
    
    this._updatePosition()
  }
}

export default Laser