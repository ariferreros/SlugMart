// src/GameScreen.js
import { Container, Graphics, Assets, Sprite } from 'pixi.js'

export async function loadGameScreen(app) {
  const scene = new Container()
  console.log('GAME SCREEN')

  // load game sceen assets, maybe can like use a bundle
  // hopefully can just reuse this screen for the different days
  // and have like a counter on top for the food, day number, and characters
  scene.x = app.screen.width / 2
  scene.y = app.screen.height / 2
  const backgroundTexture = await Assets.load(
    './assets/environment/filler_background_replace_later.png'
  )
  const bagTexture = await Assets.load(
    './assets/environment/filler_bag_replace_later.png'
  )
  const counterTexture = await Assets.load(
    './assets/environment/filler_counter_replace_later.png'
  )
  const registerTexture = await Assets.load(
    './assets/environment/filler_register_replace_later.png'
  )

  const background = new Sprite(backgroundTexture)
  background.anchor.set(0.5)

  const bag = new Sprite(bagTexture)
  bag.scale.set(0.5)
  bag.anchor.set(0.5)

  const counter = new Sprite(counterTexture)
  counter.anchor.set(0.5)
  // counter.scale.set(0.5)
  counter.position.y = 120

  const register = new Sprite(registerTexture)
  register.scale.set(0.3)
  register.position.x = app.screen.width * 0.1
  console.log(register.position.x)
  register.anchor.set(0.5)
  register.position.y = 10

  scene.addChild(background, bag, counter, register)

  return scene
}
