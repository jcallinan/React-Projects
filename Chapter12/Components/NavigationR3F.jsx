import React from 'react';

export default function NavigationR3F({ changeBackground, current }) {
  return (
    <div style={overlayStyle}>
      <button style={buttonStyle} onClick={() => changeBackground(-1)}>{'< Prev'}</button>
      <button style={buttonStyle} onClick={() => changeBackground(1)}>{'Next >'}</button>
    </div>
  );
}

const overlayStyle = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: '24px',
  display: 'flex',
  gap: '12px',
  zIndex: 10,
};

const buttonStyle = {
  padding: '12px 20px',
  fontSize: '16px',
  fontWeight: '700',
  background: 'white',
  border: '2px solid black',
  color: 'blue',
  cursor: 'pointer',
};
