import React from 'react';
import styled from 'styled-components';
import {Card} from '.';

const Container = styled.div`
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 16px;
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  width: 100%;
  height: 150px;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  margin-left: 24px;
  max-width: 500px;
`;

const Image = styled.div`
  height: 100%;
  width: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;
const Title = styled.h2`
  font-size: 1.3em;
`;
const Description = styled.p`
  font-size: 0.8em;
`;

const Content = ({title, description}) => (
  <ContentContainer>
    <Title>{title}</Title>
    <Description>{description}</Description>
  </ContentContainer>
);

const ActionContainer = styled.div`
  width: 40px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  :hover {
    cursor: pointer;
    background: #ccc;
  }
`;

const Actions = ({onDelete}) => (
  <ActionContainer onClick={onDelete}>
    <i className='material-icons'>delete</i>
  </ActionContainer>
);

export default ({og = {}, images = [], snippet = '', onDelete}) => {
  return (
    <Container>
      <div style={{display: 'flex'}}>
        <Image src={og.image || images[0] || 'http://dummyimage.com/200x150'} />
        <Content
          title={og.title || snippet || 'oops'}
          description={og.description || snippet}
        />
      </div>
      <Actions onDelete={onDelete} />
    </Container>
  );
};
