import { Container, Graphics, Sprite, Text, TextStyle, Assets } from 'pixi.js'
import { loadGameScreen } from './GameScreen.js'

export async function loadHomeScreen(app) {
  const startContainer = new Container()

  const titleStyle = new TextStyle({
    fontSize: 70,
    fontFamily: 'Arial',
    fill: '#ffffff',
  })

  const title = new Text({ text: 'SlugMart', style: titleStyle })
  title.anchor.set(0.5)

  const startButtonTexture = await Assets.load(
    './assets/environment/filler_start_button_replace_later.png'
  )
  const startButton = new Sprite(startButtonTexture)
  startButton.anchor.set(0.5)
  startButton.position.y = 150
  //   startButton.position.y = app.screen.height * 0.75
  startButton.eventMode = 'static'
  startButton.cursor = 'pointer'

  startButton.on('pointerdown', async () => {
    const sceneManager = app.sceneManager
    await sceneManager.changeScene(loadGameScreen)
  })

  startContainer.scale.set(0.5)
  startContainer.position.set(app.screen.width * 0.5, app.screen.height * 0.5)
  startContainer.addChild(title, startButton)

  return startContainer
}
