import GameObject from './GameObject.js'

class Info extends GameObject {
  #image = super._createImage('./images/text.png')

  /** @param { HTMLCanvasElement } canvas */
  constructor(canvas) {
    super(canvas)
  }

  drawTitle() {
    this.ctx.drawImage(this.#image, 0, 0, 858, 81, 61, 80, 858, 81)
  }

  drawDescription() {
    this.ctx.drawImage(this.#image, 0, 81, 641, 63, 169.5, 490, 641, 63)
  }

  drawStartText() {
    this.ctx.font = '20px Arial'
    this.ctx.fillText('press any key to start', 400, 590)
  }

  drawPaused() {
    this.ctx.fillStyle = 'white'
    this.ctx.font = '20px Arial'
    this.ctx.fillText('PAUSE', 460, 190)
  }

  drawGameOver() {
    this.ctx.fillStyle = 'white'
    this.ctx.font = '30px Arial'
    this.ctx.fillText('GAME OVER', 400, 190)
    this.ctx.font = '20px Arial'
    this.ctx.fillText('press any key to start new game', 346, 500)
  }

  drawGameCompleted() {
    this.ctx.fillStyle = 'white'
    this.ctx.font = '30px Arial'
    this.ctx.fillText('CONGRATULATIONS - GAME COMPLETED', 188, 190)
    this.ctx.font = '20px Arial'
    this.ctx.fillText('press any key to start new game', 346, 500)
  }
}

export default Info