import GameObject from './GameObject.js'

class Hud extends GameObject {
  static xPos = 755
  static yPos = 625

  #image = super._createImage('./images/hud.png')

  /** @param { HTMLCanvasElement } canvas */
  constructor(canvas) {
    super(canvas)
  }

  static degrees (deg) {
    return deg * 0.0174532925
  }

  draw(heat = 0, energy = 100) {
    this.ctx.beginPath()
    this.ctx.rect(798, 625, (153 / 100) * energy, 15)
    this.ctx.fillStyle = energy >= 20 ? '#00FFFF' : 'red'
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(Hud.xPos, Hud.yPos, 33, Hud.degrees(-97), Hud.degrees((360 / 100) * heat - 97) )
    this.ctx.lineTo(Hud.xPos, Hud.yPos)
    this.ctx.closePath()

    if (heat >= 60 && heat < 80) {
      this.ctx.fillStyle =  '#FFCC00'
    } else if (heat >= 80) {
      this.ctx.fillStyle =  'red'
    } else {
      this.ctx.fillStyle =  '#00FFFF'
    }

    this.ctx.fill()
    this.ctx.drawImage(this.#image, 720, 590)
  }
}

export default Hud