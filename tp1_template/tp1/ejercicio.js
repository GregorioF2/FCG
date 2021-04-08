// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)

const OFFSET_RED = 0;
const OFFSET_GREEN = 1;
const OFFSET_BLUE = 2;
const OFFSET_OPACITY = 3;
const PIXEL_SIZE = 4;

const getFunction = function (offset) {
  return function (row, column) {
    return this.data[
      column * PIXEL_SIZE + offset + row * this.width * PIXEL_SIZE
    ];
  };
};

const setFunction = function (offset) {
  return function ({ row, column, value }) {
    this.data[
      column * PIXEL_SIZE + offset + row * this.width * PIXEL_SIZE
    ] = value;
  };
};

const addPropsToImage = (image) => {
  Object.defineProperty(image, "red", {
    get: function () {
      return getFunction(OFFSET_RED);
    },
    set: setFunction(OFFSET_RED),
  });
  Object.defineProperty(image, "green", {
    get: function () {
      return getFunction(OFFSET_GREEN);
    },
    set: setFunction(OFFSET_GREEN),
  });
  Object.defineProperty(image, "blue", {
    get: function () {
      return getFunction(OFFSET_BLUE);
    },
    set: setFunction(OFFSET_BLUE),
  });
  Object.defineProperty(image, "opacity", {
    get: function () {
      return getFunction(OFFSET_OPACITY);
    },
    set: setFunction(OFFSET_OPACITY),
  });
};

const closestPaletColor = (color, factor) => {
  const step = Math.round(255 / factor);
  const availableColors = [];
  for (let currentColor = 0; currentColor < 255; currentColor += step) {
    availableColors.push(currentColor);
  }
  availableColors.push(255);

  let closestColor = 0;
  let closestError = 255;
  for (let currentColor of availableColors) {
    const currentError = Math.abs(currentColor - color);
    if (currentError < closestError) {
      closestColor = currentColor;
      closestError = currentError;
    }
  }
  return closestColor;
};

const setPixelAndNeighbors = (
  image,
  key,
  width,
  height,
  color,
  error,
  column,
  row
) => {
  image[key] = { row, column, value: color };
  if (column + 1 < width)
    image[key] = {
      row,
      column: column + 1,
      value: image[key](row, column + 1) + error * (7 / 16),
    };
  if (column - 1 >= 0 && row + 1 < height)
    image[key] = {
      row: row + 1,
      column: column - 1,
      value: image[key](row + 1, column - 1) + error * (3 / 16),
    };
  if (row + 1 < height)
    image[key] = {
      row: row + 1,
      column: column,
      value: image[key](row + 1, column) + error * (5 / 16),
    };
  if (column + 1 < width && row + 1 < height)
    image[key] = {
      row: row + 1,
      column: column + 1,
      value: image[key](row + 1, column + 1) + error * (1 / 16),
    };
};

function dither(image, factor) {
  addPropsToImage(image);
  const height = image.height;
  const width = image.width;

  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const oldRed = image.red(row, column);
      const oldGreen = image.green(row, column);
      const oldBlue = image.blue(row, column);

      const newRed = closestPaletColor(oldRed, factor);
      const newGreen = closestPaletColor(oldGreen, factor);
      const newBlue = closestPaletColor(oldBlue, factor);

      const redError = oldRed - newRed;
      const greenError = oldGreen - newGreen;
      const blueError = oldBlue - newBlue;

      setPixelAndNeighbors(
        image,
        "red",
        width,
        height,
        newRed,
        redError,
        column,
        row
      );
      setPixelAndNeighbors(
        image,
        "green",
        width,
        height,
        newGreen,
        greenError,
        column,
        row
      );
      setPixelAndNeighbors(
        image,
        "blue",
        width,
        height,
        newBlue,
        blueError,
        column,
        row
      );
    }
  }
}

// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA, imageB, result) {
  // completar
}
