class GameObject {
  /**@type { CanvasRenderingContext2D } */
  #ctx
  #canvasWidth
  #canvasHeight
  #canvasHalfWidth
  #canvasHalfHeight

  get ctx() {
    return this.#ctx
  }

  get canvasWidth() {
    return this.#canvasWidth
  }

  get canvasHeight() {
    return this.#canvasHeight
  }

  get canvasHalfWidth() {
    return this.#canvasHalfWidth
  }

  get canvasHalfHeight() {
    return this.#canvasHalfHeight
  }


  /**@param { HTMLCanvasElement } canvas */
  constructor(canvas) {    
    this.#ctx = canvas.getContext('2d')
    this.#canvasWidth = canvas.width
    this.#canvasHeight = canvas.height
    this.#canvasHalfWidth = canvas.width / 2
    this.#canvasHalfHeight = canvas.height / 2
  }

  _createImage(src) {
    const image =  new Image()
    image.src = src
    return image
  }

  _randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }
}

export default GameObject