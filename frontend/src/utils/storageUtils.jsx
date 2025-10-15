// frontend/src/utils/storageUtils.jsx

export function getLocalStorage(key) {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}
