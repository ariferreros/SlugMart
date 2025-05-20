// src/GameScreen.js
import { Container, Graphics, Assets, Sprite } from 'pixi.js'

export async function loadGameScreen(app) {
  const scene = new Container()
  console.log('GAME SCREEN')

  // load game sceen assets, maybe can liek use a bundle
  // hopefully can just reuse this screen for the different days
  // and have like a conteinre on top for the food and characters

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
  bag.anchor.set(0.5)

  const counter = new Sprite(counterTexture)
  counter.anchor.set(0.5)

  const register = new Sprite(registerTexture)
  register.anchor.set(0.5)

  scene.addChild(background, bag, counter, register)

  return scene
}
