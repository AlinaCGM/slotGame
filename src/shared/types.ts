import * as PIXI from "pixi.js";
import { Texture, Sprite } from "pixi.js";

export interface SymbolSprite extends Sprite {
  texture: Texture;
}

export interface Reel {
  container: PIXI.Container;
  symbols: SymbolSprite[];
  position: number;
  previousPosition: number;
  blur: PIXI.BlurFilter;
  textures: Texture[];
  spinning: boolean;
}

export interface Tween {
  object: any;
  property: string;
  propertyBeginValue: number;
  target: number;
  easing: (t: number) => number;
  time: number;
  change?: ((tween: Tween) => void) | null;
  complete?: ((tween: Tween) => void) | null;
  start: number;
}

export interface BonusRoundWon {
  bonusRoundWon: boolean;
  row?: number;
  winType: string;
}

export interface GameOutcome {
  reels: number[][];
  winTypes: WinType[];
  bonusRoundWon: boolean;
}

export interface IMessage {
  text: string;
  styleMessage: PIXI.TextStyle;
}

export { Texture, Sprite };

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
