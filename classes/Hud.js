class Hud {
  static context
  static hudSprite = './images/hud.png'
  static hudImage = new Image()
  static hudX = 755
  static hudY = 625

  /**
   * Convert degrees to radians
   * @param { number } deg 
   * @returns { number }
   */
  static degrees (deg) {
    return deg * 0.0174532925
  }


  /**
  * @param { HTMLCanvasElement } canvas
  */
  constructor(canvas) {
    Hud.context = canvas.getContext('2d')
    Hud.hudImage.src = Hud.hudSprite
  }

  draw(energy = 100, heat = 10) {
    Hud.context.beginPath()
    Hud.context.rect(798, 625, (153/100) * energy, 15)
    Hud.context.fillStyle = energy >= 20 ? '#00FFFF' : 'red'
    Hud.context.fill()

    Hud.context.beginPath()
    Hud.context.arc(Hud.hudX, Hud.hudY, 33, Hud.degrees(-97), Hud.degrees((360 / 100) * heat - 97) )
    Hud.context.lineTo(Hud.hudX, Hud.hudY)
    Hud.context.closePath()
    if (heat >= 60 && heat < 80) {
      Hud.context.fillStyle =  '#FFCC00'
    } else if (heat >= 80) {
      Hud.context.fillStyle =  'red'
    } else {
      Hud.context.fillStyle =  '#00FFFF'
    }
    Hud.context.fill()

    Hud.context.drawImage(Hud.hudImage, 720, 590)
  }
}

export default Hud