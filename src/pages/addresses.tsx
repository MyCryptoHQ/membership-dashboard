import React, { FunctionComponent, useState, createRef } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import MetaData from '../components/MetaData';
import Address from '../components/Address';
import { Row, Col, Table, Input, Button, Icon, Typography } from 'antd';
import { getMemberships } from '../utils/membership';
import { useDispatch, useSelector } from '../hooks';
import { updateMemberships } from '../store/memberships';

import '../sass/index.scss';

const { Title } = Typography;

interface AddressMap {
    [key: string]: any;
}

const Transactions: FunctionComponent = () => {
    const dispatch = useDispatch();
    const memberships = useSelector(state => state.memberships.memberships);
    const updated = useSelector(state => state.memberships.updated);
    const [loading, setLoading] = useState(false);
    const searchInput: any = createRef();

    const updateData = () => {
        setLoading(true);
        getMemberships().then(result => {
            dispatch(updateMemberships(result));
            setLoading(false);
        });
    };

    if (!loading && Date.now() - updated > 30 * 1000) {
        updateData();
    }

    const addresses: AddressMap = {};

    memberships.forEach(membership => {
        if (!(membership.address in addresses)) {
            addresses[membership.address] = [];
        }
        addresses[membership.address].push(membership);
    });

    return (
        <Layout>
            <MetaData />
            <Row>
                <Col offset={2} span={20}>
                    <Title level={2}>Addresses</Title>
                    <Button
                        style={{ position: 'absolute', right: 0, top: 0 }}
                        shape="circle"
                        icon="reload"
                        loading={loading}
                        disabled={loading}
                        onClick={updateData}
                    />
                    <Table
                        columns={[
                            {
                                title: 'Address',
                                dataIndex: 'address',
                                filterDropdown: ({
                                    setSelectedKeys,
                                    selectedKeys,
                                    confirm,
                                    clearFilters
                                }: any) => (
                                    <div style={{ padding: 8 }}>
                                        <Input
                                            ref={searchInput}
                                            placeholder={`Search address`}
                                            value={selectedKeys[0]}
                                            onChange={e =>
                                                setSelectedKeys(
                                                    e.target.value ? [e.target.value] : []
                                                )
                                            }
                                            onPressEnter={confirm}
                                            style={{
                                                width: 188,
                                                marginBottom: 8,
                                                display: 'block'
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            onClick={confirm}
                                            icon="search"
                                            size="small"
                                            style={{ width: 90, marginRight: 8 }}
                                        >
                                            Search
                                        </Button>
                                        <Button
                                            onClick={clearFilters}
                                            size="small"
                                            style={{ width: 90 }}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                ),
                                filterIcon: filtered => (
                                    <Icon
                                        type="search"
                                        style={{ color: filtered ? '#1890ff' : undefined }}
                                    />
                                ),
                                onFilter: (value, record) =>
                                    record.address
                                        .toString()
                                        .toLowerCase()
                                        .includes(value.toLowerCase()),
                                onFilterDropdownVisibleChange: visible => {
                                    if (visible) {
                                        setTimeout(() => searchInput.current.select());
                                    }
                                },

                                render: (address, record) => (
                                    <Address network={record.network} address={address} />
                                )
                            },
                            {
                                title: 'Active',
                                dataIndex: 'active',
                                filters: [
                                    {
                                        text: 'Active',
                                        value: 'true'
                                    },
                                    {
                                        text: 'Expired',
                                        value: 'false'
                                    }
                                ],
                                filterMultiple: false,
                                onFilter: (value, entry) => entry.active.toString() === value,
                                render: active => {
                                    if (active) {
                                        return (
                                            <Icon
                                                type="check-square"
                                                theme="twoTone"
                                                twoToneColor="#52c41a"
                                            />
                                        );
                                    } else {
                                        return (
                                            <Icon
                                                type="close-square"
                                                theme="twoTone"
                                                twoToneColor="#f5222d"
                                            />
                                        );
                                    }
                                }
                            },
                            {
                                title: 'Transactions',
                                dataIndex: 'count',
                                sorter: (a, b) => b.count - a.count
                            },
                            {
                                title: '',
                                dataIndex: 'address',
                                key: 'actions',
                                render: address => (
                                    <Link to={`/transactions#${address}`}>
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon="search"
                                            size="small"
                                        />
                                    </Link>
                                )
                            }
                        ]}
                        dataSource={Object.keys(addresses)
                            .map((address, index) => {
                                const addressMemberships = addresses[address];
                                return {
                                    key: index,
                                    address,
                                    network: 'mainnet',
                                    active: addressMemberships.some(
                                        addressMembership =>
                                            addressMembership.expiration * 1000 > Date.now()
                                    ),
                                    count: addressMemberships.length.toString()
                                };
                            })
                            .sort((a, b) => a.address.localeCompare(b.address))}
                    />
                </Col>
            </Row>
        </Layout>
    );
};

export default Transactions;
