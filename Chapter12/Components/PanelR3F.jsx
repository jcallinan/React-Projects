import React, { useState } from 'react';

export default function PanelR3F() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ ...panelStyle, opacity: open ? 1 : 0, transition: 'opacity 0.8s' }}>
      <div style={welcomeBoxStyle}>
        <div style={welcomeStyle}>Welcome to React VR World!</div>
      </div>
      <button style={closeButtonStyle} onClick={() => setOpen(false)}>Close X</button>
    </div>
  );
}

const panelStyle = {
  position: 'absolute',
  width: 800,
  height: 400,
  backgroundColor: 'rgba(255,255,255,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  left: '50%',
  transform: 'translateX(-50%)',
  top: '24px',
  zIndex: 10,
};

const welcomeBoxStyle = {
  padding: 20,
  backgroundColor: 'black',
  border: '2px solid blue',
};

const welcomeStyle = {
  fontSize: 30,
  color: 'white',
};

const closeButtonStyle = {
  position: 'absolute',
  top: 20,
  right: 20,
  fontSize: 20,
};
