class Ship {
  static #singleton = false
  static width = 172
  static height = 172
  static baseSprite = '../images/shipBase.png'
  static glassSprite = '../images/glass.png'
  static coreSprite = '../images/coreSprite.png'
  static lightingSprite = '../images/colorLightning.png'
  static shieldSprite = '../images/shieldSprites.png'
  static cannonSprite = '../images/cannons.png'
  static orbsSprite = {
    blue: '../images/blueOrb.png',
    magenta: '../images/magentaOrb.png',
    green: '../images/greenOrb.png',
    yellow: '../images/yellowOrb.png'
  }
  static canvasWidth
  static canvasHeight
  static baseImage = new Image()
  static glassImage = new Image()
  static coreImage = new Image()
  static lightingImage = new Image()
  static shieldImage = new Image()
  static cannonImage = new Image()
  static orbs = {
    blue: new Image(),
    magenta: new Image(),
    green: new Image(),
    yellow: new Image()
  }
  static coreAnimationX = 0
  static coreAnimationY = 0
  static orbAnimationX = 0
  static orbAnimationY = 0
  static lightingAnimation = 0
  static shieldAnimation = 0
  static corpusCondition = {
    left: true,
    right: true,
    top: true,
    bottom: true
  }

  /** @type { 'none' | 'left' | 'right' | 'top' | 'bottom' } */
  static shield = 'none'
  static energy = 1000

  /** @type { 'none' | 'left' | 'right' | 'top' | 'bottom' } */
  static cannon = 'none'
  static heat = 0

  static context

  /**
   * @param  {HTMLCanvasElement } canvas 
   */
  constructor(canvas) {
    if (Ship.#singleton) {
      throw new Error(`Class 'Ship' must be singleton!`)
    }
    
    Ship.#singleton = true
    Ship.context = canvas.getContext('2d')
    Ship.canvasWidth = canvas.width
    Ship.canvasHeight = canvas.height
    Ship.baseImage.src = Ship.baseSprite
    Ship.glassImage.src = Ship.glassSprite
    Ship.coreImage.src = Ship.coreSprite
    Ship.lightingImage.src = Ship.lightingSprite
    Ship.shieldImage.src = Ship.shieldSprite
    Ship.cannonImage.src = Ship.cannonSprite
    Object.keys(Ship.orbs).forEach(key => Ship.orbs[key].src = Ship.orbsSprite[key])

    setInterval(() => Ship.drawCore(), 100)
    setInterval(() => Ship.drawPowerOrbs(), 100)
    setInterval(() => Ship.shieldFrames(), 20)
  }

  static drawBase() {
    Ship.context.drawImage(Ship.baseImage, (Ship.canvasWidth - Ship.width) / 2, (Ship.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
  }

  static drawGlass() {
    Ship.context.globalAlpha = 0.5
    Ship.context.drawImage(Ship.glassImage, (Ship.canvasWidth - Ship.width) / 2, (Ship.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    Ship.context.globalAlpha = 1
  }

  static drawCore() {
    if (Ship.coreAnimationX === 300 && Ship.coreAnimationY === 1400) {
      Ship.coreAnimationX = 0
      Ship.coreAnimationY = 0
    } else if (Ship.coreAnimationX === 900) {
      Ship.coreAnimationY < 1500
        ? Ship.coreAnimationY = Ship.coreAnimationY + 100
        : Ship.coreAnimationY = 0
      
      Ship.coreAnimationX = 0
    } else {
      Ship.coreAnimationX = Ship.coreAnimationX + 100
    }
  }

  static drawPowerOrbs() {
    if (Ship.orbAnimationX === 900) {
      Ship.orbAnimationY < 900
        ? Ship.orbAnimationY = Ship.orbAnimationY + 100
        : Ship.orbAnimationY = 0

        Ship.orbAnimationX = 0
    } else {
      Ship.orbAnimationX = Ship.orbAnimationX + 100
    }
  
  }

  static drawLightnings() {
    Ship.lightingAnimation < 224
      ? Ship.lightingAnimation = Ship.lightingAnimation + 32
      : Ship.lightingAnimation = 0
    
  
    Ship.context.rotate(45 * Math.PI / 180)
    Ship.context.scale(0.15, 0.15)
    Ship.context.drawImage(Ship.lightingImage, Ship.lightingAnimation, 256, 32, 128, 3870, -560, 78, 312)
    Ship.context.rotate(90 * Math.PI / 180)
    Ship.context.drawImage(Ship.lightingImage, Ship.lightingAnimation, 128, 32, 128, -745, -2985 - 770, 78, 312)
    Ship.context.rotate(90 * Math.PI / 180)
    Ship.context.drawImage(Ship.lightingImage, Ship.lightingAnimation, 384, 32, 128, -3950, 870, 78, 312)
    Ship.context.rotate(90 * Math.PI / 180)
    Ship.context.drawImage(Ship.lightingImage, Ship.lightingAnimation, 0, 32, 128, 670, 4050, 78, 312)
    Ship.context.resetTransform()
  }

  static shieldFrames() {
    Ship.shieldAnimation < 850
      ? Ship.shieldAnimation = Ship.shieldAnimation + 85
      : Ship.shieldAnimation = 0
  }

  static drawShield() {
    switch (Ship.shield) {
      case 'left':
        Ship.context.translate(Ship.canvasWidth / 2, Ship.canvasHeight / 2);      
        Ship.context.rotate(180*Math.PI/180)
        Ship.context.drawImage(Ship.shieldImage, Ship.shieldAnimation, 0, 85, 330, 90, -110, 57, 220)
        Ship.context.resetTransform()
        break
      case 'right':
        Ship.context.drawImage(Ship.shieldImage, Ship.shieldAnimation, 0, 85, 330, Ship.canvasWidth / 2 + 90, Ship.canvasHeight / 2 - 110, 57, 220)
        break
      case 'top':
        Ship.context.translate(Ship.canvasWidth / 2, Ship.canvasHeight / 2);      
        Ship.context.rotate(270*Math.PI/180)
        Ship.context.drawImage(Ship.shieldImage, Ship.shieldAnimation, 0, 85, 330, 90, -110, 57, 220)
        Ship.context.resetTransform()
        break
      case 'bottom':
        Ship.context.translate(Ship.canvasWidth / 2, Ship.canvasHeight / 2);      
        Ship.context.rotate(90*Math.PI/180)
        Ship.context.drawImage(Ship.shieldImage, Ship.shieldAnimation, 0, 85, 330, 90, -110, 57, 220)
        Ship.context.resetTransform()
        break
      default:
        break
    }
  }


  static drawCannon() {
    let cropX = 0
    switch (Ship.cannon) {
      case 'left':
        cropX = 673 * 4
        break
      case 'right':
        cropX = 673 * 2
        break
      case 'top':
        cropX = 673
        break
      case 'bottom':
        cropX = 673 * 3
        break
      default:
        break
    }
    
    Ship.context.drawImage(Ship.cannonImage, cropX, 0, 673, 673,(Ship.canvasWidth - 180) / 2, (Ship.canvasHeight - 180) / 2, 180, 180)
  }


  /**
   * Set shield active
   * @param { 'left' | 'right' | 'top' | 'bottom' } position 
   */
  createShield(position) {
    if (Ship.energy < 200) {
      console.log('not enough energy')
    }

    Ship.shield = position
  }

  /**
   * Set shoot position
   * @param { 'left' | 'right' | 'top' | 'bottom' } position 
   */
  shoot(position) {
    if (Ship.corpusCondition[position] === false) return
    Ship.cannon = position
  }


  draw() {
    Ship.context.drawImage(Ship.coreImage, Ship.coreAnimationX, Ship.coreAnimationY, 100, 100, (Ship.canvasWidth - 48) / 2, (Ship.canvasHeight - 48) / 2, 48, 48)
    Ship.drawBase()
    Ship.drawLightnings()
    Ship.context.drawImage(Ship.orbs.blue, Ship.orbAnimationX, Ship.orbAnimationY, 100, 100, 428, 278, 32, 32)
    Ship.context.drawImage(Ship.orbs.magenta, Ship.orbAnimationX, Ship.orbAnimationY, 100, 100, 520, 278, 32, 32)
    Ship.context.drawImage(Ship.orbs.yellow, Ship.orbAnimationX, Ship.orbAnimationY, 100, 100, 428, 370, 32, 32)
    Ship.context.drawImage(Ship.orbs.green, Ship.orbAnimationX, Ship.orbAnimationY, 100, 100, 520, 370, 32, 32)
    Ship.drawGlass()
    if (Ship.shield !== 'none') Ship.drawShield()
    Ship.drawCannon()
  }
}

export default Ship