import * as PIXI from "pixi.js";
import { Texture } from "pixi.js";

export interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
  textures: Texture[];
}

export interface AnimationObject {
  object: any;
  property: string;
  propertyBeginValue: number;
  target: number;
  easing: (t: number) => number;
  time: number;
  change?: ((animationObject: AnimationObject) => void) | null;
  complete?: ((animationObject: AnimationObject) => void) | null;
  start: number;
}

export interface GameOutcome {
  reels: number[][];
  winTypes: WinType[];
  bonusRoundWon: boolean;
}

export interface TextMessage {
  text: string;
  styleMessage: PIXI.TextStyle;
}

export type WinType = "Big Win" | "Small Win" | "No Win";
export type ReelSymbols = Texture[][];

export type GetWinTypeResult = {
  row?: number;
  winType: WinType;
};
export type Reels = number[][];
export interface SymbolCount {
  count: number;
  reels: number[];
}
