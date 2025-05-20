import { Application, Assets, Sprite, Text, TextStyle } from 'pixi.js'
console.log('main running')
;(async () => {
  // Create a new application
  const app = new Application()

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: window })

  // Append the application canvas to the document body
  document.getElementById('pixi-container').appendChild(app.canvas)

  const headerStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 'bold',
    fill: 0xffffff,
  })

  const title = new Text({
    text: 'SlugMart',
    headerStyle,
  })

  app.stage.addChild(title)
  // Load the bunny texture
  // const texture = await Assets.load("./assets/bunny.png");

  // // Create a bunny Sprite
  // const bunny = new Sprite(texture);

  // // Center the sprite's anchor point
  // bunny.anchor.set(0.5);

  // // Move the sprite to the center of the screen
  // bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // // Add the bunny to the stage
  // app.stage.addChild(bunny);

  // // Listen for animate update
  // app.ticker.add((time) => {
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  //   bunny.rotation += 0.1 * time.deltaTime;
  // });
})()
