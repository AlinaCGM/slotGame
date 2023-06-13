import { getRandomInt, getWinType } from "../src/server/helpers";

it("should generate random number", () => {
  const num = getRandomInt(1, 10);
  expect(num).toBeLessThanOrEqual(10);
  expect(num).toBeGreaterThanOrEqual(1);
});

it('should return "Big Win" when all symbols in a row are the same', () => {
  const reels = [
    [1, 1, 1],
    [2, 2, 2],
    [3, 3, 3],
  ];
  const result = getWinType(reels);
  expect(result.winType).toBe("Big Win");
});

it('should return "Small Win" when 2 symbols in a row are the same', () => {
  const reels = [
    [1, 2, 1],
    [2, 2, 3],
    [3, 3, 1],
  ];
  const result = getWinType(reels);
  expect(result.winType).toBe("Small Win");
});

it('should return "No Win" when no symbols are the same in a row', () => {
  const reels = [
    [1, 2, 3],
    [2, 4, 5],
    [3, 1, 4],
  ];
  const result = getWinType(reels);
  expect(result.winType).toBe("No Win");
});
