import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducer';

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = () => {
    const isSSR = typeof window === 'undefined';
    const { NODE_ENV } = process.env;
    const middleware: any[] = [];
    if (!isSSR && NODE_ENV === 'development') {
        middleware.push(logger);
    }
    const store = createStore(persistedReducer, compose(applyMiddleware(...middleware)));
    const persistor = persistStore(store);
    return { store, persistor };
};
