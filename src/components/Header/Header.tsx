import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { Menu, Icon } from 'antd';

const Header: FunctionComponent = () => {
    const selectedKey = typeof window === 'undefined' ? '/' : window.location.pathname;
    return (
        <Menu
            selectedKeys={[selectedKey, selectedKey.replace(/\//g, '')]}
            mode="horizontal"
            theme="dark"
        >
            <Menu.Item key="/">
                <Link to="/">
                    <Icon type="home" />
                    Overview
                </Link>
            </Menu.Item>
            <Menu.Item key="transactions">
                <Link to="/transactions">
                    <Icon type="database" />
                    Transactions
                </Link>
            </Menu.Item>
            <Menu.Item key="addresses">
                <Link to="/addresses">
                    <Icon type="team" />
                    Addresses
                </Link>
            </Menu.Item>
        </Menu>
    );
};

export default Header;
