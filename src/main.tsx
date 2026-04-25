import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const root$ = createRoot(root);
const RootComponent = import.meta.env.PROD ? (
  <Suspense fallback={<div>Loading...</div>}>
    <App />
  </Suspense>
) : (
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </StrictMode>
);

root$.render(RootComponent);
