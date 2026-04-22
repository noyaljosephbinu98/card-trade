let store = {};

module.exports = {
  setItem: jest.fn((k, v) => {
    store[k] = v;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((k) => Promise.resolve(store[k] ?? null)),
  removeItem: jest.fn((k) => {
    delete store[k];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    store = {};
    return Promise.resolve(null);
  }),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  flushGetRequests: jest.fn(),
};
