import React, { FunctionComponent, Fragment, ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Layout as AntLayout } from 'antd';

interface Props {
    children: ReactNode;
}

const Layout: FunctionComponent<Props> = ({ children }: Props) => (
    <Fragment>
        <AntLayout style={{ backgroundColor: '#FFF' }}>
            <AntLayout.Header style={{ padding: '0', height: 'auto', marginBottom: '25px' }}>
                <Header />
            </AntLayout.Header>
            <AntLayout.Content>{children}</AntLayout.Content>
            <AntLayout.Footer style={{ padding: '0', textAlign: 'center', marginTop: '20px' }}>
                <Footer />
            </AntLayout.Footer>
        </AntLayout>
    </Fragment>
);

export default Layout;
