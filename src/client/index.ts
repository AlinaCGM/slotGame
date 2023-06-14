import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import {
  Reel,
  AnimationObject,
  GameOutcome,
  TextMessage,
  SymbolCount,
} from "../shared/types";
import gsap from "gsap";

const app = new PIXI.Application({ background: "#1099bb" });
(app.view as HTMLCanvasElement).id = "pixi-app";
document.body.appendChild(app.view as HTMLCanvasElement);
(async () => {
  // Initialize the asset manager
  await Assets.init();

  // Load the textures asynchronously
  const textures = await Promise.all([
    Assets.load("images/sym1.png"),
    Assets.load("images/sym2.png"),
    Assets.load("images/sym3.png"),
    Assets.load("images/sym4.png"),
    Assets.load("images/sym5.png"),
    Assets.load("images/sym6.png"),
    Assets.load("images/sym7.png"),
    Assets.load("images/sym8.png"),
    Assets.load("images/sym9.png"),
  ])
    .then(onAssetsLoaded)
    .catch((error) => {
      console.error("Error loading assets:", error);
    });
})();
const bgTexture = PIXI.Texture.from("images/bg.jpg");
const bgSprite = new PIXI.Sprite(bgTexture);
bgSprite.width = app.renderer.width;
bgSprite.height = app.renderer.height;

app.stage.addChild(bgSprite);

const REEL_WIDTH: number = 160;
const SYMBOL_SIZE: number = 120;

let updatingSymbols: boolean = false;

function onAssetsLoaded(): void {
  // Create different slot symbols.
  const slotTextures: PIXI.Texture[] = [
    PIXI.Texture.from("images/sym1.png"),
    PIXI.Texture.from("images/sym2.png"),
    PIXI.Texture.from("images/sym3.png"),
    PIXI.Texture.from("images/sym4.png"),
    PIXI.Texture.from("images/sym5.png"),
    PIXI.Texture.from("images/sym6.png"),
    PIXI.Texture.from("images/sym7.png"),
    PIXI.Texture.from("images/sym8.png"),
    PIXI.Texture.from("images/sym9.png"),
  ];

  const reels: Reel[] = []; // Declare an array to hold the reels
  const reelContainer: PIXI.Container = new PIXI.Container(); //container to hold the reels
  for (let i = 0; i < 3; i++) {
    // Loop to create 3 reels
    const rc = new PIXI.Container();
    rc.x = i * REEL_WIDTH; // Set the x position of the reel (this will place each reel side by side)
    reelContainer.addChild(rc);

    const reel: Reel = {
      // Define the reel object with properties
      container: rc, // the container holding this reel
      symbols: [], // array to store symbols of this reel
      position: 0, // the current position of the reel
      previousPosition: 0, // the position of the reel in the previous frame
      textures: [], // textures for the symbols in the reel
    };

    // Build the symbols

    for (let j = 0; j < 3; j++) {
      // Loop to create 3 symbols for each reel
      const symbol: PIXI.Sprite = new PIXI.Sprite(slotTextures[j]); // Create a new PIXI Sprite for each symbol using the slotTextures
      // Scale the symbol to fit symbol area.
      symbol.y = j * SYMBOL_SIZE;
      // Math.min- to ensure that the scaling does not distort the symbol image.
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
      );
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2); // Center the symbol horizontally within the SYMBOL_SIZE
      reel.symbols.push(symbol as PIXI.Sprite);
      reel.textures.push(slotTextures[j]);
      rc.addChild(symbol);
    }
    reels.push(reel); // Add the created reel to the reels array
  }
  app.stage.addChild(reelContainer);

  // Build top  cover and position reelContainer
  const margin: number = (app.screen.height - SYMBOL_SIZE * 3) / 2;
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 4);

  const top = new PIXI.Graphics();

  top.beginFill(0x000000, 0); // Set alpha value to 0 for transparency
  top.drawRect(0, -margin, app.screen.width, margin + SYMBOL_SIZE / 2);

  // Add play text
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 30,
    fill: ["#FAE49F", "#C09149"],
    stroke: "#C09149",
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 3,
    wordWrap: true,
    wordWrapWidth: 440,
    align: "center",
  });

  // Add header text
  const headerText = new PIXI.Text("SIMPLE SLOT GAME!", style);
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  headerText.anchor.set(0.5);
  headerText.position.set(app.screen.width / 2, margin / 2);
  top.addChild(headerText);

  app.stage.addChild(top);

  //button/: A
  const textureButton = PIXI.Texture.from("images/spinButton.png");
  const textureButtonDisabled = PIXI.Texture.from(
    "images/spinButtonDisabled.png"
  );
  const textureButtonDown = PIXI.Texture.from("images/spinButtonDown.png");
  const textureButtonHover = PIXI.Texture.from("images/spinButtonHover.png");
  const button = new PIXI.Sprite(textureButton);
  (button as any).anchor.set(0.5);
  (button as any).position.set(
    app.screen.width / 2,
    app.screen.height - margin + margin / 2
  );
  (button as any).interactive = true;
  (button as any).buttonMode = true;
  (button as any).addListener("pointerdown", onButtonDown);
  (button as any).addListener("pointerup", onButtonUp);
  (button as any).addListener("pointerupoutside", onButtonUp);
  (button as any).addListener("pointerover", onButtonOver);
  (button as any).addListener("pointerout", onButtonOut);

  function onButtonDown(): void {
    button.texture = textureButtonDown;
  }

  function onButtonUp(): void {
    button.texture = textureButton;
  }

  function onButtonOver(): void {
    button.texture = textureButtonHover;
  }

  function onButtonOut(): void {
    button.texture = textureButton;
  }
  app.stage.addChild(button);
  // Set the interactivity.

  (button as any).buttonMode = true;
  (button as any).cursor = "pointer";
  (button as any).addEventListener("pointerdown", () => {
    spin();
  });

  // Function to start playing.
  let running: boolean = false;

  async function spin() {
    if (running || updatingSymbols) return;
    running = true;
    updatingSymbols = true;

    // Disable the button while spinning
    (button as any).texture = textureButtonDisabled;
    (button as any).interactive = false;
    (button as any).buttonMode = false;

    // Fetch the game outcome from the server
    try {
      const response = await fetch("http://localhost:3000/spin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const gameOutcome: GameOutcome = await response.json(); // Parse the game outcome from the response
      // Loop over all reels
      for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        const reelSymbols = gameOutcome.reels[i];

        // Reset the position of the reel
        reel.position = 0;
        reel.previousPosition = 0;
        // Loop over all symbols in the reel
        for (let j = 0; j < reel.symbols.length; j++) {
          const symbol = reel.symbols[j];
          const symbolIndex = reelSymbols[j];
          symbol.texture = slotTextures[symbolIndex]; // Update the texture of the symbol
          reel.textures[j] = symbol.texture; // Update the textures array of the reel
          reel.container.addChild(symbol);
          // Adjust the scale of the symbol to fit within the SYMBOL_SIZE constraints
          symbol.scale.x = symbol.scale.y = Math.min(
            SYMBOL_SIZE / symbol.texture.width,
            SYMBOL_SIZE / symbol.texture.height
          );
          symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        }
        // Calculate the target position for the reel
        const rotations = 4 * (i + 1); //  the number of extra rotations
        const finalOutcomeIndex =
          (rotations * reel.symbols.length) % reel.symbols.length;
        const targetPosition =
          rotations * reel.symbols.length + finalOutcomeIndex;

        tweenTo(
          reel,
          "position",
          targetPosition,
          2500 + i * 1,
          backout(0.5),
          () => {},
          // On complete, check if this is the last reel
          i === reels.length - 1
            ? () => {
                reelsComplete(gameOutcome as any); // If so, trigger the reelsComplete method and re-enable the spin button
                updatingSymbols = false;

                (button as any).texture = textureButton;
                (button as any).interactive = true;
                (button as any).buttonMode = true;
              }
            : () => {} // Otherwise, do nothing
        );
      }
    } catch (error) {
      console.error("Error:", error);
      running = false;
      updatingSymbols = false;

      // Re-enable the button after spinning is complete
      (button as any).texture = textureButton;
      (button as any).interactive = true;
      (button as any).buttonMode = true;
    }
  }
  // Add event listener to the button
  (button as any).addEventListener("click", spin);

  //Win text message
  let message: TextMessage;
  const styleMessage: PIXI.TextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 60,
    fontWeight: "bold",
    fill: ["#FAE49F", "#C09149"],
    stroke: "#C09149",
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    align: "center",
  });
  // Reels done handler.
  function reelsComplete(gameOutcome: GameOutcome) {
    running = false;

    if (gameOutcome.winTypes[0] !== "No Win") {
      message = {
        text: ` ${gameOutcome.winTypes[0]}`,
        styleMessage,
      };
    } else {
      message = {
        text: "Try again!",
        styleMessage,
      };
    }
    if (gameOutcome.bonusRoundWon) {
      message = {
        text: "BONUS ROUND!",
        styleMessage,
      };
      updatingSymbols = false;
      setTimeout(function () {
        spin();
      }, 2000); // 2 sec. delay before it spins automatically
    }
    // Scale non-consecutive similar symbols
    for (let j = 0; j < reels[0].symbols.length; j++) {
      // Iterate over all symbols in a single reel
      const symbolCounts: Record<string, SymbolCount> = {}; // track counts of each symbol in the row
      for (let i = 0; i < reels.length; i++) {
        // Iterate over all reels
        const symbol = reels[i].symbols[j]; // Get the current symbol
        const symbolIndex = symbol.texture.textureCacheIds[0];
        // If this symbol has already been encountered in the row, increment its count
        // and add the current reel to its list of reels
        if (symbolCounts[symbolIndex]) {
          symbolCounts[symbolIndex].count++;
          symbolCounts[symbolIndex].reels.push(i);
        } else {
          // Otherwise, initialize a new count and reel list for this symbol
          symbolCounts[symbolIndex] = { count: 1, reels: [i] };
        }
      }
      // Iterate over all counted symbols
      for (const symbolIndex in symbolCounts) {
        if (symbolCounts[symbolIndex].count >= 2) {
          for (const reelIndex of symbolCounts[symbolIndex].reels) {
            const symbol = reels[reelIndex].symbols[j];

            symbol.scale.set(1.2);

            let duration = 1750;
            // Apply a tween animation to gradually reduce the scale back to 1 along the x-axis
            tweenTo(
              symbol.scale,
              "x",
              0.5,
              duration,
              backout(0.7),
              () => {},
              () => {}
            );
            tweenTo(
              symbol.scale,
              "y",
              0.5,
              duration,
              backout(0.7),
              () => {},
              () => {}
            );
          }
        }
      }
    }
    const textObj = new PIXI.Text(message.text, styleMessage);
    textObj.anchor.set(0.5); // Set the anchor point to the center of the text

    // Position the text at the center of the stage
    textObj.x = app.renderer.width / 2;
    textObj.y = app.renderer.height / 2;

    // Set the initial scale and alpha to zero
    textObj.scale.set(0);
    textObj.alpha = 0;

    // Add the text to the stage
    app.stage.addChild(textObj);

    // Use GSAP to animate the pop-up effect
    gsap.to(textObj.scale, { x: 1, y: 1, duration: 0.5 });
    gsap.to(textObj, { alpha: 1, duration: 0.5 });
    // Make the message disappear after 3 seconds
    setTimeout(() => {
      gsap.to(textObj.scale, { x: 0, y: 0, duration: 0.5 });
      gsap.to(textObj, {
        alpha: 0,
        duration: 0.5,
        onComplete: () => {
          app.stage.removeChild(textObj);
        },
      });
    }, 1000);
  }

  app.ticker.add((delta) => {
    // Add a listener to the application ticker
    for (let i = 0; i < reels.length; i++) {
      // Iterate over all reels
      const r = reels[i];

      for (let j = 0; j < r.symbols.length; j++) {
        // Iterate over all symbols in the current reel: A
        const s = r.symbols[j];
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE; // Update the y-position of the symbol according to the reel's current position
      }

      if (!running) {
        // When not running, round the reel's position to the nearest integer
        r.position = Math.round(r.position);
      }
    }
  });

  const tweening: AnimationObject[] = []; // Define a tweening function that helps with animations
  function tweenTo(
    object: any,
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    onchange: (t: AnimationObject) => void,
    oncomplete: (t: AnimationObject) => void
  ): AnimationObject {
    // Define the tween object
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    tweening.push(tween);
    return tween;
  }
  // Add a listener for the animation update
  app.ticker.add((delta) => {
    const now = Date.now();
    const remove: AnimationObject[] = [];
    for (let i = 0; i < tweening.length; i++) {
      // Iterate over all tween objects
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = lerp(
        // Update the tweening property value
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );
      if (t.change) t.change(t); // Trigger the change function if it's defined
      if (phase === 1) {
        // If the tween has reached its target, trigger the complete function and flag it for removal
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      // Remove completed tweens from the list
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });
  // Define a linear interpolation function
  function lerp(a1: number, a2: number, t: number): number {
    return a1 * (1 - t) + a2 * t;
  }
  // Define an easing function
  function backout(amount: number): (t: number) => number {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }
}
