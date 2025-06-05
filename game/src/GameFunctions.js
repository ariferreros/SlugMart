import { Container, Graphics, Assets, Sprite } from 'pixi.js'
import { DraggableItem } from './Classes/DraggableItem.js'
import { startDay1 } from './Days/script.js'
import { food } from './Char1/text.js'

export async function loadBackground(app) {
  const bg = new Container()
  const backgroundTexture = await Assets.load(
    './assets/environment/gameScreenBG.png'
  )

  const background = new Sprite(backgroundTexture)
  background.height = app.screen.height
  background.scale.x = background.scale.y
  background.anchor.set(0.5)
  bg.addChild(background)
  // bg.scale.set(0.5)
  bg.position.set(app.screen.width * 0.5, app.screen.height * 0.5)

  return bg
}

export async function loadForeground(app) {
  const foreground = new Container()

  // bgsize.anchor.set(0.5)
  const bagTexture = await Assets.load('./assets/environment/gameScreenBag.png')
  const counterTexture = await Assets.load('./assets/environment/belt.png')
  const registerTexture = await Assets.load('./assets/environment/register.png')

  const counter = new Sprite(counterTexture)
  // do this to ensure that the container size is the same as the bg
  counter.height = app.screen.height
  counter.scale.x = counter.scale.y
  counter.anchor.set(0.5)

  const register = new Sprite(registerTexture)
  register.height = app.screen.height
  register.scale.x = register.scale.y
  register.anchor.set(0.5)

  const bag = new Sprite(bagTexture)
  bag.height = app.screen.height
  bag.scale.x = bag.scale.y
  bag.anchor.set(0.5)
  // bag.width = app.screen.width
  // bag.anchor.set(0.5)
  // foreground.addChild(register)
  foreground.addChild(counter)
  foreground.addChild(register)
  foreground.addChild(bag)
  // foreground.addChild(bag)
  // Create and add draggable items
  // const dropZone = createDropZone(app)
  // foreground.addChild(dropZone)

  // const trackedFoodItems = new Set()
  // createDraggableItems(foreground, trackedFoodItems, dropZone, foodTexture, app.screen)

  // foreground.scale.set(0.5)
  foreground.position.set(app.screen.width * 0.5, app.screen.height * 0.5)

  return foreground
}

export function createDropZone(screen) {
  const dropZone = new Graphics().rect(0, 0, 300, 200).fill(0x000000)

  dropZone.position.set(screen.width * 0.8 - 100, screen.height * 0.7 - 100)

  return dropZone
}

export function loadFood(scene, trackedFoodItems, dropZone, foodItems, app) {
  const startX = app.screen.width * -0.3
  const yPos = app.screen.height * 0.17
  const xSpacing = app.screen.width * 0.1

  foodItems.forEach((foodPath, i) => {
    Assets.load(foodPath).then((texture) => {
      const item = new DraggableItem(texture)

      item.scale.set(0.3)
      item.anchor.set(0.5)
      item.position.set(startX + i * xSpacing, yPos)
      item.dropZone = dropZone

      const originalRemove = item.removeFromParent.bind(item)
      item.removeFromParent = function () {
        const index = trackedFoodItems.indexOf(item)
        if (index > -1) {
          trackedFoodItems.splice(index, 1)
        }
        originalRemove()
        if (trackedFoodItems.length === 0) {
          checkCharacterComplete(app)
        }
      }

      trackedFoodItems.push(item)
      scene.addChild(item)
    })
  })
}

export async function loadHomeScreen(app) {
  const startContainer = new Container()

  const backgroundTexture = await Assets.load(
    './assets/environment/homescreen.png'
  )
  const startButtonTexture = await Assets.load(
    './assets/environment/startbutton.png'
  )
  const background = new Sprite(backgroundTexture)
  // allows the background image to be set to the height of the window then auto scales the width
  background.height = app.screen.height
  background.scale.x = background.scale.y
  background.anchor.set(0.5)

  startContainer.addChild(background)
  const startButton = new Sprite(startButtonTexture)
  startButton.anchor.set(0.5)
  startButton.scale.set(0.35)
  startButton.position.y = 190
  startButton.position.x = background.width * 0.35
  //   startButton.position.y = app.screen.height * 0.75
  startButton.eventMode = 'static'
  startButton.cursor = 'pointer'

  startButton.on('pointerover', () => {
    startButton.scale.set(0.45)
  })
  startButton.on('pointerout', () => {
    startButton.scale.set(0.35)
  })
  startButton.on('pointerdown', async () => {
    // const sceneManager = app.sceneManager
    startDay1(app)
    // await sceneManager.changeScene(loadGameScreen)
  })

  // startContainer.scale.set(0.5)
  startContainer.position.set(app.screen.width * 0.5, app.screen.height * 0.5)
  startContainer.addChild(startButton)
  return startContainer
}

export function checkCharacterComplete(app) {
  console.log('All items bagged')
  console.log('Starting next day (repeating day one here)')
  startDay1(app)
  // also check if there is any more character dialog to go through
}
