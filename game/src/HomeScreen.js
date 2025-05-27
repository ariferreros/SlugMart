import { Container, Graphics, Sprite, Text, TextStyle, Assets } from 'pixi.js'
import { startDay1 } from './Days/script.js'
export async function loadHomeScreen(app) {
  const startContainer = new Container()

  //Set background for homecsreen
  // document.body.style.backgroundImage = "url("+ /assets/environment/filler_homescreen_replace_later.png +")";
  // document.body.style.backgroundSize = "cover";
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
