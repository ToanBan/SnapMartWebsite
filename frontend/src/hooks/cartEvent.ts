type Callback = (count?: number) => void;
let listeners: Callback[] = [];

export const subscribeCart = (callback: Callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(fn => fn !== callback);
  };
};

export const notifyCartChange = (count?: number) => {
  listeners.forEach(fn => fn(count));
};
