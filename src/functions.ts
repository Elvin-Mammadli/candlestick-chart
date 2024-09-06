export function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const percentage = (num: number, per: number) => (num / 100) * per;
