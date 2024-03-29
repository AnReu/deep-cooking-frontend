import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    --border-color: #d0d0d0;
    --error-color: #e74c3c;
    --error-text-color: #ffffff;
    --primary-background: #fbfbfb;
    --primary-hover-background: #ffffff;
    --primary-text-color: #333333;
    --secondary-background: #eeeeee;
    --secondary-hover-background: #f5f5f5;
    --secondary-text-color: #979797;
    --success-color: #2ecc71;
    --success-text-color: #ffffff;
    --tertiary-background: #e0e0e0;
    --tertiary-hover-background: #e9e9e9;
    --warn-text-color: #ffffff;
    --warn-color: #f39c12;

    --theme-color: #2980b9;
    --theme-hover-color: #3498db;
    --theme-primary-text: #ffffff;
    --theme-secondary-text: #2980b9;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default GlobalStyle;
