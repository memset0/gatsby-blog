function load(key, defaultValue) {
  const isSSR = typeof window === "undefined";
  if (isSSR) {
    return defaultValue;
  }

  const { localStorage } = window;
  const value = localStorage.getItem(key);
  if (value === null) {
    return defaultValue;
  }
  return value;
}

function save(key, value) {
  const isSSR = typeof window === "undefined";
  if (isSSR) {
    return;
  }

  const { localStorage } = window;
  localStorage.setItem(key, value);
}

const storageUtils = { load, save };
export default storageUtils;
