import * as PIXI from "pixi.js";
import { BlurFilter, Assets } from "pixi.js";
import {
  SymbolSprite,
  Reel,
  Tween,
  GameOutcome,
  IMessage,
  SymbolCount,
} from "../shared/types";
import gsap from "gsap";

const app: PIXI.Application = new PIXI.Application({ background: "#1099bb" });
document.body.appendChild(app.view as HTMLCanvasElement);

(async () => {
  //   // Initialize the asset manager
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
const SYMBOL_SIZE: number = 150;

let updatingSymbols: boolean = false;

// // onAssetsLoaded handler builds the example.
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

  const reels: Reel[] = [];
  const reelContainer: PIXI.Container = new PIXI.Container();
  for (let i = 0; i < 3; i++) {
    const rc = new PIXI.Container();
    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    const reel: Reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new BlurFilter(),
      textures: [],
      spinning: false,
    };
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols

    for (let j = 0; j < 3; j++) {
      const symbol: SymbolSprite = new PIXI.Sprite(slotTextures[j]);
      // Scale the symbol to fit symbol area.
      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
      );
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol as SymbolSprite);
      reel.textures.push(slotTextures[j]);
      rc.addChild(symbol);
    }
    reels.push(reel);
    console.log("math random" + slotTextures);
  }
  app.stage.addChild(reelContainer);

  // Build top & bottom covers and position reelContainer
  const margin: number = (app.screen.height - SYMBOL_SIZE * 3) / 2;
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 4);

  const top = new PIXI.Graphics();
  const bottom = new PIXI.Graphics();

  top.beginFill(0x000000, 0); // Set alpha value to 0 for transparency
  top.drawRect(0, -margin, app.screen.width, margin + SYMBOL_SIZE / 2);

  // Set the position and size of the bottom graphics
  bottom.beginFill(0x000000, 0); // Set color to red
  bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin * 2);

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
  app.stage.addChild(bottom);

  //   ///////////////////////////////////////button/////////////////////////////////////////////////////////
  const textureButton = PIXI.Texture.from("images/spinButton.png");
  const textureButtonDisabled = PIXI.Texture.from(
    "images/spinButtonDisabled.png"
  );
  const textureButtonDown = PIXI.Texture.from("images/spinButtonDown.png");
  const textureButtonHover = PIXI.Texture.from("images/spinButtonHover.png");
  const button = new PIXI.Sprite(textureButton);
  (button as any).anchor.set(0.7);
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
  (button as any).interactive = true;
  (button as any).buttonMode = true;
  (button as any).cursor = "pointer";
  (button as any).addEventListener("pointerdown", () => {
    startPlay();
  });

  // Function to start playing.
  let running: boolean = false;
  let spinning: boolean = false;

  async function startPlay() {
    if (running || updatingSymbols) return;
    running = true;
    updatingSymbols = true;
    spinning = true;

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

      const gameOutcome: GameOutcome = await response.json();
      console.log("Game outcome from server:", gameOutcome);

      for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        const reelSymbols = gameOutcome.reels[i];

        console.log(`Reel ${i} outcome:`, reelSymbols);
        reel.position = 0;
        reel.previousPosition = 0;

        for (let j = 0; j < reel.symbols.length; j++) {
          const symbol = reel.symbols[j];
          const symbolIndex = reelSymbols[j];
          symbol.texture = slotTextures[symbolIndex];
          reel.textures[j] = symbol.texture;
          reel.container.addChild(symbol);
          symbol.scale.x = symbol.scale.y = Math.min(
            SYMBOL_SIZE / symbol.texture.width,
            SYMBOL_SIZE / symbol.texture.height
          );
          symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        }

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
          () => {}, // Empty function as a placeholder
          i === reels.length - 1
            ? () => {
                console.warn(
                  "[parcel] 🚨 Connection to the HMR server was lost"
                );
                reelsComplete(gameOutcome as any);
                updatingSymbols = false;
                spinning = false;
                // Re-enable the button after spinning is complete
                (button as any).texture = textureButton;
                (button as any).interactive = true;
                (button as any).buttonMode = true;
              }
            : () => {} // Empty function as a placeholder
        );

        updatingSymbols = false;
      }
    } catch (error) {
      console.error("Error:", error);
      running = false;
      updatingSymbols = false;
      spinning = false;

      // Re-enable the button after spinning is complete
      (button as any).texture = textureButton;
      (button as any).interactive = true;
      (button as any).buttonMode = true;
    }
  }
  // Add event listener to the button
  (button as any).addEventListener("click", startPlay);
  let message: IMessage;
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
        startPlay();
      }, 2000); // 2 sec. delay before it spins automatically
    }
    // Scale non-consecutive similar symbols
    for (let j = 0; j < reels[0].symbols.length; j++) {
      const symbolCounts: Record<string, SymbolCount> = {}; // track counts of each symbol in the row
      for (let i = 0; i < reels.length; i++) {
        const symbol = reels[i].symbols[j];
        const symbolIndex = symbol.texture.textureCacheIds[0];

        if (symbolCounts[symbolIndex]) {
          symbolCounts[symbolIndex].count++;
          symbolCounts[symbolIndex].reels.push(i);
        } else {
          symbolCounts[symbolIndex] = { count: 1, reels: [i] };
        }
      }

      for (const symbolIndex in symbolCounts) {
        if (symbolCounts[symbolIndex].count >= 2) {
          for (const reelIndex of symbolCounts[symbolIndex].reels) {
            const symbol = reels[reelIndex].symbols[j];

            symbol.scale.set(1.2);

            let duration = 1750;
            tweenTo(
              symbol.scale,
              "x",
              1,
              duration,
              backout(0.5),
              () => {},
              () => {}
            );
            tweenTo(
              symbol.scale,
              "y",
              1,
              duration,
              backout(0.5),
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
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];

      if (r.spinning) {
        r.position += delta;
        if (r.position >= r.symbols.length) {
          r.position -= r.symbols.length;
        }
      }

      r.blur.blurY = (r.position - r.previousPosition) * 10;
      r.previousPosition = r.position;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE;
      }

      if (!running) {
        r.position = Math.round(r.position);
      }
    }
  });

  // tweening utility function.
  const tweening: Tween[] = [];
  function tweenTo(
    object: any,
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    onchange: (t: Tween) => void,
    oncomplete: (t: Tween) => void
  ): Tween {
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
  // Listen for animate update.
  app.ticker.add((delta) => {
    const now = Date.now();
    const remove: Tween[] = [];
    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });

  // Basic lerp funtion.
  function lerp(a1: number, a2: number, t: number): number {
    return a1 * (1 - t) + a2 * t;
  }

  function backout(amount: number): (t: number) => number {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }
}


