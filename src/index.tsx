import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

// export const BASE_URL = 'http://localhost:8010/proxy';
export const BASE_URL = 'https://deep.cooking';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
