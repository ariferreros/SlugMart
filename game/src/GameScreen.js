// src/GameScreen.js
import { Container, Graphics, Assets, Sprite } from 'pixi.js'
import { DraggableItem } from './DraggableItem.js'
export async function loadGameScreen(app) {
  const scene = new Container()

  // load game sceen assets, maybe can like use a bundle
  // hopefully can just reuse this screen for the different days
  // and have like a counter on top for the food, day number, and characters
  // scene.x = app.screen.width / 2
  // scene.y = app.screen.height / 2
  const backgroundTexture = await Assets.load(
    './assets/environment/gameScreenBG.png'
  )

  const bagTexture = await Assets.load('./assets/environment/gameScreenBag.png')
  const counterTexture = await Assets.load('./assets/environment/belt.png')
  const registerTexture = await Assets.load('./assets/environment/register.png')
  const foodTexture = await Assets.load(
    './assets/environment/filler_food_item_replace_later.png'
  )
  const background = new Sprite(backgroundTexture)
  // allows the background image to be set to the height of the window then auto scales the width
  background.height = app.screen.height
  background.scale.x = background.scale.y
  background.anchor.set(0.5)
  scene.addChild(background)

  const counter = new Sprite(counterTexture)
  counter.height = app.screen.height
  counter.scale.x = counter.scale.y
  counter.anchor.set(0.5)
  scene.addChild(counter)
  // counter.scale.set(0.5)

  const register = new Sprite(registerTexture)
  register.height = app.screen.height
  register.scale.x = register.scale.y
  register.anchor.set(0.5)
  scene.addChild(register)

  const bag = new Sprite(bagTexture)
  bag.height = app.screen.height
  bag.scale.x = bag.scale.y
  bag.anchor.set(0.5)
  scene.addChild(bag)

  // create new instance of a draggable food item
  const food = new DraggableItem(foodTexture)
  food.scale.set(0.3)
  food.anchor.set(0.5)
  scene.addChild(food)
  // configure the container
  scene.scale.set(0.5)
  scene.position.set(app.screen.width * 0.5, app.screen.height * 0.5)

  return scene
}
