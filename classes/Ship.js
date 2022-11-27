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
  static sideSprite = '../images/sideParts.png'
  static orbsSprite = {
    blue: '../images/blueOrb.png',
    magenta: '../images/magentaOrb.png',
    green: '../images/greenOrb.png',
    yellow: '../images/yellowOrb.png'
  }
  static canvasWidth
  static canvasHeight
  static powerSound = new Audio('../sounds/powerDown.mp3')
  static baseImage = new Image()
  static glassImage = new Image()
  static coreImage = new Image()
  static lightingImage = new Image()
  static shieldImage = new Image()
  static cannonImage = new Image()
  static sideImage = new Image()
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

  static destroyed = false
  static destroyedFunc

  static topLeftSensors = [
    { x: 411, y: 314},
    { x: 411, y: 304},
    { x: 411, y: 294},
    { x: 416, y: 282},
    { x: 424, y: 274},
    { x: 432, y: 266},
    { x: 444, y: 261},
    { x: 454, y: 261},
    { x: 464, y: 261}
  ]

  static topRightSensors = [
    { x: 516, y: 261},
    { x: 526, y: 261},
    { x: 536, y: 261},
    { x: 548, y: 266},
    { x: 556, y: 274},
    { x: 564, y: 282},
    { x: 569, y: 294},
    { x: 569, y: 304},
    { x: 569, y: 314},
  ]

  static bottomLeftSensors = [
    { x: 411, y: 366},
    { x: 411, y: 376},
    { x: 411, y: 386},
    { x: 416, y: 398},
    { x: 424, y: 406},
    { x: 432, y: 414},
    { x: 444, y: 419},
    { x: 454, y: 419},
    { x: 464, y: 419}
  ]

  static bottomRightSensors = [
    { x: 516, y: 419},
    { x: 526, y: 419},
    { x: 536, y: 419},
    { x: 548, y: 414},
    { x: 556, y: 406},
    { x: 564, y: 398},
    { x: 569, y: 386},
    { x: 569, y: 376},
    { x: 569, y: 366},
  ]

  /** @type { 'none' | 'left' | 'right' | 'top' | 'bottom' } */
  static shield = 'none'
  static energy = 100

  /** @type { 'none' | 'left' | 'right' | 'top' | 'bottom' } */
  static cannon = 'none'
  static heat = 0

  static context

  /**
   * @param { HTMLCanvasElement } canvas
   * @param { Function } destroyFunc
   */
  constructor(canvas, destroyFunc) {
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
    Ship.sideImage.src = Ship.sideSprite
    Ship.destroyedFunc = destroyFunc
    
    Object.keys(Ship.orbs).forEach(key => Ship.orbs[key].src = Ship.orbsSprite[key])

    setInterval(() => Ship.drawCore(), 100)
    setInterval(() => Ship.drawPowerOrbs(), 100)
    setInterval(() => Ship.shieldFrames(), 20)

    setInterval(() => Ship.updateHeat(), 400)
    setInterval(() => Ship.updateShield(), 200)
  }


  static drawBase() {
    const leftImgCoordinates = Ship.corpusCondition.left === false ? 0 : 172
    const rightImgCoordinates = Ship.corpusCondition.right === false ? 0 : 172
    const topImgCoordinates = Ship.corpusCondition.top === false ? 0 : 172
    const bottomImgCoordinates = Ship.corpusCondition.bottom === false ? 0 : 172
    
    Ship.context.drawImage(Ship.sideImage, leftImgCoordinates, 0, 172, 172, (Ship.canvasWidth - Ship.width) / 2, (Ship.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    Ship.context.drawImage(Ship.sideImage, rightImgCoordinates, 172, 172, 172, (Ship.canvasWidth - Ship.width) / 2, (Ship.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    Ship.context.drawImage(Ship.sideImage, topImgCoordinates, 344, 172, 172, (Ship.canvasWidth - Ship.width) / 2, (Ship.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    Ship.context.drawImage(Ship.sideImage, bottomImgCoordinates, 516, 172, 172, (Ship.canvasWidth - Ship.width) / 2, (Ship.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
    
    const x = Ship.destroyed ? 643 : 0
    Ship.context.drawImage(Ship.baseImage, x, 0, 643, 643, (Ship.canvasWidth - Ship.width) / 2, (Ship.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
  }

  static drawGlass() {
    Ship.context.globalAlpha = 0.5
    const xTrim = Ship.destroyed ? 643 : 0
    Ship.context.drawImage(Ship.glassImage, xTrim, 0, 643, 643, (Ship.canvasWidth - Ship.width) / 2, (Ship.canvasHeight - Ship.height) / 2, Ship.width, Ship.height)
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
        Ship.context.translate(Ship.canvasWidth / 2, Ship.canvasHeight / 2)      
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


  static updateHeat() {
    if (Ship.heat > 0) {
      Ship.heat = Ship.heat - 5
    }
  }


  static updateShield() {
    if (Ship.energy < 100 && Ship.shield === 'none') {
      Ship.energy = Ship.energy + 5
    }
  }


  /**
   * Set shield active
   * @param { 'left' | 'right' | 'top' | 'bottom' | 'none' } position 
   */
  createShield(position) {
    if ((Ship.energy < 20 && position !== 'none') || Ship.destroyed) {
      return
    }

    Ship.shield = position
  }


  /**
   * Set shoot position
   * @param { 'left' | 'right' | 'top' | 'bottom' } position 
   */
  shoot(position) {
    if (Ship.corpusCondition[position] === false) return false
    if (Ship.heat >= 100) return false
    if (Ship.destroyed) return false
    if (Ship.shield === position) Ship.shield = 'none'

    Ship.heat = Ship.heat + 10
    Ship.cannon = position
    return true
  }


  shieldDamage () {
    Ship.shield = 'none'
    Ship.energy = Ship.energy - 20
  }


  destroy () {
    Ship.shield = 'none'
    Ship.cannon = 'none'
    Ship.destroyed = true
    Ship.topLeftSensors = []
    Ship.topRightSensors = []
    Ship.bottomLeftSensors = []
    Ship.bottomRightSensors = []
  }

  /**
   * Set shoot position
   * @param { 'left' | 'right' | 'top' | 'bottom' } side 
   */
  corpusDamage(side) {
    if (Ship.corpusCondition[side] === false) {
      Ship.destroyedFunc()
    } else {
      Ship.corpusCondition[side] = false
    }

    if (Ship.cannon === side) Ship.cannon = 'none'
  }


  static playPowerSound () {
    if (Ship.powerSound.currentTime) Ship.powerSound.pause()
    Ship.powerSound.currentTime = 0
    Ship.powerSound.play()
  }


  /**
   * Get damage from diagonal
   * @param { 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' } side 
   */
  diagonalDamage(side) {
    switch (side) {
      case 'topLeft':
        if (Ship.topLeftSensors.length) {
          Ship.playPowerSound()
          setTimeout(() => Ship.topLeftSensors.shift(), 500)
          setTimeout(() => Ship.topLeftSensors.shift(), 1000)
          setTimeout(() => Ship.topLeftSensors.shift(), 1500)
        } else {
          Ship.destroyedFunc()
        }
        break
      case 'topRight':
        if (Ship.topRightSensors.length) {
          Ship.playPowerSound()
          setTimeout(() => Ship.topRightSensors.shift(), 500)
          setTimeout(() => Ship.topRightSensors.shift(), 1000)
          setTimeout(() => Ship.topRightSensors.shift(), 1500)
        } else {
          Ship.destroyedFunc()
        }
        break
      case 'bottomLeft':
        if (Ship.bottomLeftSensors.length) {
          Ship.playPowerSound()
          setTimeout(() => Ship.bottomLeftSensors.shift(), 500)
          setTimeout(() => Ship.bottomLeftSensors.shift(), 1000)
          setTimeout(() => Ship.bottomLeftSensors.shift(), 1500)
        } else {
          Ship.destroyedFunc()
        }
        break
      case 'bottomRight':
        if (Ship.bottomRightSensors.length) {
          Ship.playPowerSound()
          setTimeout(() => Ship.bottomRightSensors.shift(), 500)
          setTimeout(() => Ship.bottomRightSensors.shift(), 1000)
          setTimeout(() => Ship.bottomRightSensors.shift(), 1500)
        } else {
          Ship.destroyedFunc()
        }
      default:
        break
    }
  }


  draw() {
    if (Ship.destroyed === false) Ship.context.drawImage(Ship.coreImage, Ship.coreAnimationX, Ship.coreAnimationY, 100, 100, (Ship.canvasWidth - 48) / 2, (Ship.canvasHeight - 48) / 2, 48, 48)
    Ship.drawBase()

    if (Ship.destroyed === false) {
      Ship.drawLightnings()
      Ship.context.drawImage(Ship.orbs.blue, Ship.orbAnimationX, Ship.orbAnimationY, 100, 100, 428, 278, 32, 32)
      Ship.context.drawImage(Ship.orbs.magenta, Ship.orbAnimationX, Ship.orbAnimationY, 100, 100, 520, 278, 32, 32)
      Ship.context.drawImage(Ship.orbs.yellow, Ship.orbAnimationX, Ship.orbAnimationY, 100, 100, 428, 370, 32, 32)
      Ship.context.drawImage(Ship.orbs.green, Ship.orbAnimationX, Ship.orbAnimationY, 100, 100, 520, 370, 32, 32)
    }

    Ship.context.beginPath()
    Ship.context.fillStyle = '#d930db'
    Ship.topRightSensors.forEach(coords => {
      Ship.context.arc(coords.x, coords.y, 2, 0, 2 * Math.PI)
      Ship.context.closePath()
    })
    Ship.context.fill()

    Ship.context.beginPath()
    Ship.context.fillStyle = '#007acf'
    Ship.topLeftSensors.forEach(coords => {
      Ship.context.arc(coords.x, coords.y, 2, 0, 2 * Math.PI)
      Ship.context.closePath()
    })
    Ship.context.fill()

    Ship.context.beginPath()
    Ship.context.fillStyle = '#f1d907'
    Ship.bottomLeftSensors.forEach(coords => {
      Ship.context.arc(coords.x, coords.y, 2, 0, 2 * Math.PI)
      Ship.context.closePath()
    })
    Ship.context.fill()

    Ship.context.beginPath()
    Ship.context.fillStyle = '#16e129'
    Ship.bottomRightSensors.forEach(coords => {
      Ship.context.arc(coords.x, coords.y, 2, 0, 2 * Math.PI)
      Ship.context.closePath()
    })
    Ship.context.fill()

    Ship.drawGlass()
    if (Ship.shield !== 'none') Ship.drawShield()
    Ship.drawCannon()
  }
}

export default Ship