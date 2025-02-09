import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

let persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
   <div className="min-h-[80vh]">
      <StrictMode>
         <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
               <App />
               <Toaster />
            </PersistGate>
         </Provider>
      </StrictMode>
   </div>
)