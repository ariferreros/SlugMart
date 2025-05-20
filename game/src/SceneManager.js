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
    }
  }
}
