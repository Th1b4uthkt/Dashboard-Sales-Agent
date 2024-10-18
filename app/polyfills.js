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

export {}; // Ajout de cette ligne pour que le fichier soit considéré comme un module
