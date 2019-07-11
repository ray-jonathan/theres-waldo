import { combineReducers } from "redux";
const ACTION_SLEEP = "ACTION_SLEEP";
const ACTION_EAT = "ACTION_EAT";
const ACTION_PLAY = "ACTION_PLAY";

const initialState = {
  meRedux : {}
};

const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_EAT:
      return {
        ...state,
        meRedux:{
          ...action.payload
        }
      };
    case ACTION_SLEEP:
      return {
        ...state,
        activity: "sleeping"
      };
    case ACTION_PLAY:
      return {
        ...state,
        activity: "playing"
      };
    default: {
      return state;
    }
  }
};

export default combineReducers({ meRedux: activityReducer });