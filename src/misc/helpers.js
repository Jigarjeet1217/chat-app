export function getNameInitials(name) {
  const words = name.toUpperCase().split(' ');
  if (words.length > 1) {
    return words[0][0] + words[1][0];
  }
  return words[0][0];
}
