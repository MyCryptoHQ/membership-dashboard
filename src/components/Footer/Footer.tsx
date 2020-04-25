import React, { FunctionComponent } from 'react';
import ExternalLink from '../ExternalLink';
import { Icon, Avatar, Menu } from 'antd';

const socials = [
    {
        color: '#333',
        icon: <Icon type="github" />,
        title: 'GitHub',
        url: 'https://github.com/MrLuit/membership-dashboard'
    }
];

const Footer: FunctionComponent = () => (
    <Menu
        selectedKeys={[]}
        mode="horizontal"
        theme="dark"
        style={{ paddingTop: '10px', paddingBottom: '10px' }}
    >
        {socials.map((item, index) => (
            <Menu.Item key={index}>
                <ExternalLink to={item.url}>
                    <Avatar style={{ backgroundColor: item.color }} icon={item.icon} />
                </ExternalLink>
            </Menu.Item>
        ))}
    </Menu>
);

export default Footer;
