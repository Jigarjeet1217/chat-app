export function getNameInitials(name) {
  const words = name.toUpperCase().split(' ');
  if (words.length > 1) {
    return words[0][0] + words[1][0];
  }
  return words[0][0];
}

export const transformToArray = snapVal => {
  return snapVal
    ? Object.keys(snapVal).map(roomId => {
        return {
          ...snapVal[roomId],
          id: roomId,
        };
      })
    : [];
};
