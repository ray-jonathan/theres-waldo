const ACTION_SLEEP = "ACTION_SLEEP";
const ACTION_EAT = "ACTION_EAT";
const ACTION_PLAY = "ACTION_PLAY";

export const sleep = () => {
  return {
    type: ACTION_SLEEP
  };
};

export const updateCoords = (coords) => {
  console.log("coords: ", coords);
  return {
    type: ACTION_EAT,
    payload: {...coords}
  };
};

export const play = () => {
  return {
    type: ACTION_PLAY
  };
};