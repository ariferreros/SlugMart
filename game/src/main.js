// src/main.js
import { Application } from 'pixi.js'
import { SceneManager } from './SceneManager.js'
import { loadHomeScreen } from './HomeScreen.js'
import { initDevtools } from '@pixi/devtools'
;(async () => {
  const app = new Application()

  await app.init({
    background: '#1099bb',
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
  })

  document.getElementById('window')?.appendChild(app.canvas)

  const sceneManager = new SceneManager(app)
  app.sceneManager = sceneManager // Attach so screens can access it

  await sceneManager.changeScene(loadHomeScreen)
  initDevtools({ app })
  // resize function from chatgpt
  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight)
    sceneManager.onResize()
  })
})()
