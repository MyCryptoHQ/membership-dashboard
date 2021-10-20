import React, { FunctionComponent, createRef, Fragment } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import MetaData from '../components/MetaData';
import Address from '../components/Address';
import { Row, Col, Table, Input, Button, Icon, Typography } from 'antd';
import { useSelector } from '../hooks';
import networks from '../data/networks';
import { memberships as contracts } from '../data/contracts';
import fileDownload from 'js-file-download';

import '../sass/index.scss';

const { Title } = Typography;

const downloadCSV = (addressData) => {
    const activeMemberships = addressData.filter(address => address.active);
    const rows = activeMemberships.map(activeMembership => [activeMembership.network, activeMembership.address, activeMembership.type]);
    
    const csvContent = rows.map(e => e.join(",")).join("\n");

    fileDownload(csvContent, 'export.csv');
}

interface AddressMap {
    [key: string]: any;
}

const Transactions: FunctionComponent = () => {
    const memberships = useSelector(state => state.memberships.memberships);
    const searchInput: any = createRef();

    const addresses: AddressMap = {};

    memberships.forEach(membership => {
        const id = `${membership.network}-${membership.address}`;
        if (!(id in addresses)) {
            addresses[id] = [];
        }
        addresses[id].push(membership);
    });

    const addressData = Object.values(addresses)
    .map((addressMemberships: any, index) => {
        let highestMembershipName = '';
        let highestMembershipDuration = 0;
        addressMemberships.forEach(addressMembership => {
            if(addressMembership.expiration > Date.now()) {
                const membershipType: any = contracts.find(contract => contract.contractAddress.toLowerCase() === addressMembership.contractAddress.toLowerCase());
                if(membershipType.durationInDays > highestMembershipDuration) {
                    highestMembershipDuration = membershipType.durationInDays;
                    highestMembershipName = membershipType.name;
                }
            }
        })
        return {
            key: index,
            address: addressMemberships[0].address,
            network: addressMemberships[0].network,
            active: addressMemberships.some(
                addressMembership =>
                    addressMembership.expiration > Date.now()
            ),
            type: highestMembershipName,
            count: addressMemberships.length.toString()
        };
    })
    .sort((a, b) => a.address.localeCompare(b.address));

    return (
        <Layout>
            <MetaData />
            <Row>
                <Col offset={2} span={20}>
                    <Title level={2}>Addresses</Title>
                    <span style={{ position: 'absolute', right: 0, top: 0 }}>
                        <Button
                            shape="circle"
                            icon="download"
                            onClick={() => downloadCSV(addressData)}
                        />
                    </span>
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

                                render: (address, record) => <Address address={address} network={record.network} />
                            },
                            {
                                title: 'Network',
                                dataIndex: 'network',
                                filters: networks.map(network => {
                                    return {
                                        text: network.name,
                                        value: network.id
                                    };
                                }),
                                onFilter: (value, entry) => entry.network === value,
                                render: network => {
                                    const networkData = networks.find(item => item.id === network);
                                    if (!networkData) {
                                        return <Fragment />;
                                    }
                                    return (
                                        <Row type="flex" justify="space-around">
                                            <Col span={6}>
                                                <img
                                                    width="20px"
                                                    height="20px"
                                                    src={networkData.icon}
                                                />
                                            </Col>
                                            <Col span={18}>{networkData.name}</Col>
                                        </Row>
                                    );
                                }
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
                        dataSource={addressData}
                    />
                </Col>
            </Row>
        </Layout>
    );
};

export default Transactions;
