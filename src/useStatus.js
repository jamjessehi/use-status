import { useState, useMemo, useCallback } from "react";
import { IDLE, PENDING, RESOLVE, REJECT } from "constants/status";

export default () => {
  const [state, setState] = useState(IDLE);
  const [data, setData] = useState();
  const [error, setError] = useState(false);

  const status = useMemo(
    () => ({
      isLoading: state === IDLE || state === PENDING,
      isIdle: state === IDLE,
      isPending: state === PENDING,
      isResolved: state === RESOLVE,
      isRejected: state === REJECT
    }),
    [state]
  );

  const resolve = useCallback(data => {
    setState(RESOLVE);
    setData(data);
    setError(false);
  }, []);

  const reject = useCallback(error => {
    setState(REJECT);
    setError(error);
  }, []);

  const pending = useCallback(() => {
    setError(false);
    setState(PENDING);
  }, []);

  return {
    status,
    data,
    error,
    resolve,
    reject,
    pending
  };
};
