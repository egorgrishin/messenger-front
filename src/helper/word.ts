export function num2word(value: number, words: string[]) {
  value = Math.abs(value) % 100;
  const num = value % 10;

  switch (true) {
    case value > 10 && value < 20:
      return words[2];
    case num > 1 && num < 5:
      return words[1];
    case num == 1:
      return words[0];
    default:
      return words[2];
  }
}