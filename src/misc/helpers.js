export function getNameInitials(name = '') {
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

export const getuserUpdates = async (userId, keyToUpdate, value, db) => {
  const updates = {};
  updates[`profiles/${userId}/${keyToUpdate}`] = value;

  const getMsgs = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');
  const getRooms = db
    .ref('/rooms')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');

  const [msgSnap, roomSnap] = await Promise.all([getMsgs, getRooms]);

  msgSnap.forEach(msg => {
    updates[`messages/${msg.key}/author/${keyToUpdate}`] = value;
  });

  roomSnap.forEach(room => {
    updates[`rooms/${room.key}/lastMessage/author/${keyToUpdate}`] = value;
  });

  return updates;
};

export function groupBy(arr, gpkey) {
  return arr.reduce((res, item) => {
    const groupingkey = gpkey(item);

    if (!res[groupingkey]) {
      res[groupingkey] = [];
    }

    res[groupingkey].push(item);
    return res;
  }, {});
}
