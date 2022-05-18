import React from 'react';
import ReactDOM from 'react-dom/client';
import ContextView from './context'
import RefView from './ref'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <ContextView /> */}
    <RefView />
  </React.StrictMode>
);


