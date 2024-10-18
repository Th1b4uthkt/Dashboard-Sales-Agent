if (typeof window !== 'undefined') {
    if (!('DOMMatrix' in window)) {
      window.DOMMatrix = class DOMMatrix {
        constructor(init) {
          return init;
        }
      };
    }
    if (!('Path2D' in window)) {
      window.Path2D = class Path2D {
        constructor(path) {
          return path;
        }
      };
    }
  }

if (!Promise.withResolvers) {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}
