import React, { useState, useEffect } from 'react';

import layoutFigures from './grid';

const SCROLL_DIRECTION_DOWN = 'down';
const SCROLL_DIRECTION_UP = 'up';

const useScrollPosition = () => {
  const [offsetTop, setOffsetTop] = useState(window.pageYOffset);
  const [scrollDirection, setScrollDirection] = useState(SCROLL_DIRECTION_DOWN);

  const onScroll = () => {
    setScrollDirection(
      window.pageYOffset > offsetTop
        ? SCROLL_DIRECTION_DOWN
        : SCROLL_DIRECTION_UP
    );
    setOffsetTop(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  return { offsetTop, scrollDirection };
};

const useBufferedFigures = figures => {
  const { offsetTop, scrollDirection } = useScrollPosition();

  const upperBuffer = scrollDirection === SCROLL_DIRECTION_UP ? 1500 : 300;
  const lowerBuffer = scrollDirection === SCROLL_DIRECTION_DOWN ? 1500 : 300;

  return figures.map(figure => {
    const topOfFigure = figure.translateY;

    let isVisible = false;
    if (scrollDirection === SCROLL_DIRECTION_DOWN) {
      isVisible =
        offsetTop - upperBuffer <= topOfFigure &&
        topOfFigure <= offsetTop + lowerBuffer + window.innerHeight;
    } else {
      isVisible =
        topOfFigure >= offsetTop - upperBuffer &&
        topOfFigure <= offsetTop + lowerBuffer + window.innerHeight;
    }
    return {
      ...figure,
      isVisible,
    };
  });
};

const FigureGrid = ({ figures, renderFigure, options }) => {
  const { plots, totalHeight } = layoutFigures(figures, options);
  const bufferedFigures = useBufferedFigures(plots);
  return (
    <div id="figure-grid" style={{ height: totalHeight, position: 'relative' }}>
      {bufferedFigures.map(figure =>
        figure.isVisible ? (
          <Figure
            figure={figure}
            key={figure.url}
            renderFigure={renderFigure}
          />
        ) : null
      )}
    </div>
  );
};

const Figure = ({ figure, renderFigure }) => {
  const {
    figureWidth,
    figureHeight,
    originalData,
    translateX,
    translateY,
  } = figure;
  return (
    <figure
      style={{
        margin: 0,
        position: 'absolute',
        width: figureWidth,
        height: figureHeight,
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    >
      {renderFigure(originalData)}
    </figure>
  );
};

export default FigureGrid;
