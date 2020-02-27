import React, {useState, useEffect} from 'react';
import styled, {keyframes} from 'styled-components';
import Logo from './Logo';
import Input from './Input';
import FigureGrid from './FigureGrid';
import Button from './ui/Button';
import {fetchCollection, saveCollection} from './services';

// const PRIMARY = '#292c3c';

const useFetchImages = query => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    try {
      if (!query) return;
      fetch('//dumpster-api.sixfstudios.now.sh/items', {
        method: 'post',
        body: JSON.stringify({url: query}),
      })
        .then(res => res.json())
        .then(receivedImages => setImages([...receivedImages, ...images]));
    } catch (e) {
      console.log('whoops');
    }
  }, [query]);

  const imagesByUrl = {};
  images.filter(({isSmall}) => !isSmall).forEach(image => {
    imagesByUrl[image.url] = image;
  })

  return [imagesByUrl, setImages];
};

const Shadow = styled.div`
  background: #0000007a;
  position: absolute;
  width: 100%;
  height: 100%;
  ::after {
    color: white;
    content: '✔';
    font-size: 36px;
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;

const SelectableFigure = ({url, onSelect, selected}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{height: '100%', position: 'relative'}} onClick={() => {
      onSelect(url);
    }}>
      {selected && <Shadow />}
      <img
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
          height: '100%',
        }}
        alt={url}
        src={url}
        onLoad={() => {
          setTimeout(() => setLoaded(true), Math.random() * 1000);
        }}
      />
    </div>
  );
}

const without = (images, selectedImages) => {
  const updated = {...images}
  Object.keys(selectedImages).forEach(selected => {
    delete updated[selected]
  })
  return Object.values(updated);
}

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useFetchImages(query);
  const [selectedImages, selectImage] = useState({});

  const collectionId = window.location.pathname.substring(1);
  useEffect(() => {
    if (collectionId) {
      fetchCollection(collectionId).then((items = {}) => {
        if (!items) window.history.pushState(null, null, '/')
        setImages(Object.values(items))
      })
    }
  }, [collectionId])

  const imageValues = Object.values(images);

  return (
    <>
      <header style={{padding: 16}}>
        <Logo />
        <Input onChange={e => setQuery(e.target.value)} />
      </header>
      <div style={{position: 'fixed', zIndex: 99, display: 'flex', justifyContent: 'center', width: '100%'}}>
        <SlideInOut in={Object.keys(selectedImages).length > 0}>
          <Button destructive onClick={() => {
            setImages(without(images, selectedImages))
            selectImage({})
          }}>Remove Selected</Button>
        </SlideInOut>
        <SlideInOut in={imageValues.length > 0}>
          <Button onClick={() => {
            let id = collectionId;
            if (!id) {
              id = Math.floor(Math.random() * 100000000)
              window.history.pushState(null, null, id);
            }
            saveCollection(id, imageValues);
          }}>Save Collection</Button>
        </SlideInOut>
      </div>
      {!imageValues.length && (
        <div style={{textAlign: 'center', padding: 100}}>So empty :(</div>
      )}
      <FigureGrid
        figures={imageValues}
        renderFigure={figure => <SelectableFigure url={figure.url} selected={selectedImages[figure.url]} onSelect={(imageId) => {
          let images = {...selectedImages};
          if (selectedImages[imageId]) {
            delete images[imageId];
            selectImage(images);
            return;
          }
          selectImage({...images, [imageId]: true})
        }} />}
        options={{margin: 8, containerSelector: '#root'}}
      />
     
    </>
  );
};

const slideInOut = props => keyframes`
  from {
    opacity: ${props.in ? 0 : 1};
    transform: translateY(${props.in ? 0 : -50}px);
  }
  
  to {
    opacity: ${props.in ? 1 : 0};
    transform: translateY(${props.in ? -50 : 0}px);
  }
`;

const SlideInOut = styled.div`
  animation: ${slideInOut} 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
`;

export default App;
