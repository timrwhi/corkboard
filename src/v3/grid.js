function getMinAspectRatio(containerWidth) {
  if (containerWidth < 640) return 2;
  if (containerWidth < 1280) return 4;
  return 5;
}

function buildRows(images, margin, containerSelector) {
  const containerElement = document.querySelector(containerSelector);
  const containerWidth = containerElement.clientWidth;
  const MIN_ASPECT_RATIO = getMinAspectRatio(containerWidth);

  let rows = [];
  let row = [];
  let rowAspectRatio = 0;
  let offsetY = 0;
  images.forEach((image, i) => {
    const isLastImage = i === images.length - 1;
    const { width, height } = image;
    rowAspectRatio += width / height;
    row.push(image);
    if (rowAspectRatio >= MIN_ASPECT_RATIO || isLastImage) {
      const totalRowWidth = containerWidth - margin * (row.length - 1);
      const rowHeight = Math.min(totalRowWidth / rowAspectRatio, 400);
      rows.push({
        aspectRatio: rowAspectRatio,
        rowHeight,
        offsetY,
        images: row,
      });
      offsetY = offsetY + rowHeight + margin;
      row = [];
      rowAspectRatio = 0;
    }
  });
  return { rows, totalHeight: offsetY };
}

const scaleRow = margin => ({ aspectRatio, rowHeight, offsetY, images }) => {
  let offsetX = 0;
  return images.map((image, i) => {
    const { width, height } = image;
    const figureWidth = (rowHeight / height) * width;
    const values = {
      originalData: image,
      translateX: offsetX,
      translateY: offsetY,
      width,
      height,
      figureHeight: rowHeight,
      figureWidth,
    };

    offsetX = offsetX + figureWidth + (i === images.length - 1 ? 0 : margin);
    return values;
  });
};

function makeFigures(figures, options = {}) {
  const { margin = 4, containerSelector = 'body' } = options;
  const { rows, totalHeight } = buildRows(figures, margin, containerSelector);
  return { totalHeight, plots: rows.map(scaleRow(margin)).flat() };
}

export default makeFigures;
