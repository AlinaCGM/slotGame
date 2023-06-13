import { GameOutcome, GetWinTypeResult, Reels, WinType } from "../shared/types";

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min; //calculates the range of values between max and min, inclusive of both ends.
}

export function getWinType(reels: Reels): GetWinTypeResult {
  for (let i = 0; i < reels.length; i++) {
    const row = reels[i];
    if (row.every((symbol) => symbol === row[0])) {
      return { winType: "Big Win" };
    }
  }

  for (let i = 0; i < reels.length; i++) {
    const row = reels[i];
    if (new Set(row).size === 2) {
      return { winType: "Small Win" };
    }
  }

  return { winType: "No Win" };
}

export function getGameOutcome(): GameOutcome {
  let winTypes: WinType[] = [];
  const reels: Reels = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => getRandomInt(0, 5))
  );
  const transposed = reels[0].map((_, colIndex) =>
    reels.map((row) => row[colIndex])
  );
  const result = getWinType(transposed);
  winTypes.push(result.winType);

  const bonusRoundWon = checkBonusRound();

  return {
    reels,
    winTypes,
    bonusRoundWon,
  };
}

export function checkBonusRound(): boolean {
  return getRandomInt(1, 100) <= 10;
}
