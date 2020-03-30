export const IDLE = "IDLE";
export const PENDING = "PENDING";
export const RESOLVE = "RESOLVE";
export const REJECT = "REJECT";

export default state => ({
  isLoading: state === IDLE || state === PENDING,
  isIdle: state === IDLE,
  isPending: state === PENDING,
  isResolved: state === RESOLVE,
  isRejected: state === REJECT
});
