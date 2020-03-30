import { useReducer, useMemo, useCallback } from "react";

import deriveFromStatus, {
  IDLE,
  PENDING,
  RESOLVE,
  REJECT
} from "constants/status";

const REQUEST = "REQUEST";
const RECEIVE = "RECEIVE";
const ERROR = "ERROR";

const initialState = {
  data: undefined,
  status: IDLE,
  error: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        error: false,
        status: PENDING
      };

    case RECEIVE:
      return {
        ...state,
        status: RESOLVE,
        data: action.payload,
        error: false
      };

    case ERROR:
      return {
        ...state,
        status: REJECT,
        error: action.payload
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const requestAction = () => ({ type: REQUEST });

const receiveAction = payload => ({ type: RECEIVE, payload });

const failAction = payload => ({ type: ERROR, payload });

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const status = useMemo(() => deriveFromStatus(state.status), [state.status]);

  const request = useCallback(() => dispatch(requestAction()), []);
  const receive = useCallback(payload => dispatch(receiveAction(payload)), []);
  const fail = useCallback(payload => dispatch(failAction(payload)), []);

  return {
    state,
    status,
    request,
    receive,
    fail
  };
};
