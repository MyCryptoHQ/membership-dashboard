import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store';
import { ConfigProvider } from 'antd';

const wrapRootElement = ({ element }) => {
    const isSSR = typeof window === 'undefined';

    return (
        <Fragment>
            <Provider store={store}>
                {isSSR ? (
                    <Fragment>{element}</Fragment>
                ) : (
                    <PersistGate loading={null} persistor={persistor}>
                        <ConfigProvider>{element}</ConfigProvider>
                    </PersistGate>
                )}
            </Provider>
        </Fragment>
    );
};

export default wrapRootElement;
