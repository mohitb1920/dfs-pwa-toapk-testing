const localStoreSupport = () => {
  try {
    return "sessionStorage" in window && window["sessionStorage"] !== null;
  } catch (e) {
    return false;
  }
};

const k = (key) => key === 'WebApp.Employee.locale' ? key : `DfsWeb.${key}`;
const getStorage = (storageClass) => ({
  get: (key) => {
    if (localStoreSupport() && key) {
      let valueInStorage = storageClass.getItem(k(key));
      if (!valueInStorage || valueInStorage === "undefined") {
        return null;
      }
      const item = JSON.parse(valueInStorage);
      if (Date.now() > item.expiry) {
        storageClass.removeItem(k(key));
        return null;
      }
      return item.value;
    } else {
      return null;
    }
  },
  set: (key, value, ttl = 86400) => {
    const item = {
      value,
      ttl,
      expiry: Date.now() + ttl * 1000,
    };
    if (localStoreSupport()) {
      storageClass.setItem(k(key), JSON.stringify(item));
    }
  },
  del: (key) => {
    if (localStoreSupport()) {
      storageClass.removeItem(k(key));
    }
  },
});

const sessionKey = (key) => `DfsWeb.${key}`;
const getSessionStorage = (storageClass) => ({
  get: (key) => {
    if (localStoreSupport() && key) {
      let valueInStorage = storageClass.getItem(sessionKey(key));
      if (!valueInStorage || valueInStorage === "undefined") {
        return null;
      }
      const item = JSON.parse(valueInStorage);
      return item.value;
    } else {
      return null;
    }
  },
  set: (key, value) => {
    const item = {
      value,
    };
    if (localStoreSupport()) {
      storageClass.setItem(sessionKey(key), JSON.stringify(item));
    }
  },
  del: (key) => {
    if (localStoreSupport()) {
      storageClass.removeItem(sessionKey(key));
    }
  },
});

export const SessionStorage = getSessionStorage(window.sessionStorage);
export const PersistantStorage = getStorage(window.localStorage);
