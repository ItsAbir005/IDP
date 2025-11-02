// frontend/src/hooks/useLocalStorage.jsx
import { useState, useEffect } from "react";

// ✅ Generate user-specific storage key
const getUserKey = (key) => {
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) return key;
  return `${userEmail}_${key}`;
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const userKey = getUserKey(key);
      const item = window.localStorage.getItem(userKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("LocalStorage error:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const userKey = getUserKey(key);
      window.localStorage.setItem(userKey, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Saving to localStorage failed:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

// ✅ Helper function to get user-specific data from localStorage
export const getUserData = (key) => {
  const userKey = getUserKey(key);
  const data = localStorage.getItem(userKey);
  return data ? JSON.parse(data) : null;
};

// ✅ Helper function to set user-specific data
export const setUserData = (key, value) => {
  const userKey = getUserKey(key);
  localStorage.setItem(userKey, JSON.stringify(value));
};