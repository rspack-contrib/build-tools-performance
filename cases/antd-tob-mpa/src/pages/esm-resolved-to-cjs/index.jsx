import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'antd';

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2>ESM resolved to CJS</h2>
      <Button type="primary">Antd Button</Button>
    </div>
  );
}

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(<App />);
