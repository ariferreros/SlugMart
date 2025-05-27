export class SceneManager {
  constructor(app) {
    this.app = app
    this.currentScene = null
    this.foreground = null // Track foreground separately
  }

  async changeScene(loadScene) {
    // Remove current scene
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene)
      this.currentScene.destroy({ children: true })
      this.foreground = null // Clear foreground reference
    }

    // Load new scene
    const newScene = await loadScene(this.app)
    if (newScene) {
      this.currentScene = newScene
      this.app.stage.addChild(this.currentScene)
      this.centerScene()
    }
  }

  async addToScene(scene) {
    if (!this.currentScene) return

    this.foreground = scene
    this.currentScene.addChild(scene)

    // Position foreground relative to background
    scene.position.set(0, 0) // Align with background
    scene.scale.set(1) // Inherit parent's scale

    // If you need to center the combined scene
    this.centerScene()
  }

  centerScene() {
    if (this.currentScene) {
      this.currentScene.x = this.app.screen.width / 2
      this.currentScene.y = this.app.screen.height / 2
    }
  }

  onResize() {
    this.centerScene()
  }
}
