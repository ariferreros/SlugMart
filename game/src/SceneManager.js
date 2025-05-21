// handles switching between scenes ex: game, home, game over, loading

export class SceneManager {
  constructor(app) {
    this.app = app
    this.currentScene = null
  }

  // destroys current container (scene) and loads new scene
  async changeScene(loadScene) {
    // remove current scene
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene)
      this.currentScene.destroy({ children: true })
    }

    // load new scene
    const newScene = await loadScene(this.app)
    if (newScene) {
      this.currentScene = newScene
      this.app.stage.addChild(this.currentScene)

      this.centerScene()
    }
  }

  onResize() {
    // When the window resizes, update scene position
    this.centerScene()
  }

  centerScene() {
    if (this.currentScene) {
      this.currentScene.x = this.app.screen.width / 2
      this.currentScene.y = this.app.screen.height / 2
    }
  }
}
