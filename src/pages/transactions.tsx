import React, { FunctionComponent, useState, createRef, Fragment } from 'react';
import Layout from '../components/Layout';
import MetaData from '../components/MetaData';
import Address from '../components/Address';
import { Row, Col, Table, Input, Button, Icon, Typography } from 'antd';
import { memberships as membershipTypes } from '../data/contracts';
import networks from '../data/networks';
import { useSelector } from '../hooks';

import moment from 'moment';

import '../sass/index.scss';

const { Title } = Typography;

const Transactions: FunctionComponent = () => {
    const memberships = useSelector(state => state.memberships.memberships);
    const [hashSearch, setHashSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const searchInput: any = createRef();
    const isSSR = typeof window === 'undefined';
    const hash = !isSSR ? location.hash.replace('#', '') : '';

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    if (searchText) {
        if (hash !== searchText && !isSSR) {
            location.hash = `#${searchText}`;
        }
    } else if (!isSSR && hashSearch && (hash || location.href.endsWith('#'))) {
        history.replaceState(null, '', ' ');
    }

    if (!isSSR && location.hash && !hashSearch) {
        setHashSearch(true);
        setSearchText(hash);
    }

    return (
        <Layout>
            <MetaData />
            <Row>
                <Col offset={2} span={20}>
                    <Title level={2}>Transactions</Title>
                    {/*<Button
                        style={{ position: 'absolute', right: 0, top: 0 }}
                        shape="circle"
                        icon="reload"
                        loading={loading}
                        disabled={loading}
                        onClick={updateData}
                    />*/}
                    <Table
                        columns={[
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
                            /*{
                                title: 'Transaction',
                                dataIndex: 'transactionHash',
                                render: (transactionhash, record) => (
                                    <ExternalLink
                                        to={
                                            record.network === 'mainnet'
                                                ? `https://etherscan.io/tx/${transactionhash}`
                                                : `https://blockscout.com/xdai/mainnet/tx/${transactionhash}`
                                        }
                                    >
                                        {transactionhash.substr(0, 12)}...
                                    </ExternalLink>
                                )
                            },*/
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
                                            onPressEnter={() => handleSearch(selectedKeys, confirm)}
                                            style={{
                                                width: 188,
                                                marginBottom: 8,
                                                display: 'block'
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            onClick={() => handleSearch(selectedKeys, confirm)}
                                            icon="search"
                                            size="small"
                                            style={{ width: 90, marginRight: 8 }}
                                        >
                                            Search
                                        </Button>
                                        <Button
                                            onClick={() => handleReset(clearFilters)}
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
                                filteredValue: searchText ? [searchText] : [],
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
                                title: 'Membership',
                                dataIndex: 'contractAddress',
                                filters: membershipTypes.map(membershipType => {
                                    const networkData = networks.find(
                                        item => item.id === membershipType.network
                                    );
                                    const networkName = networkData ? networkData.name : 'Unknown';
                                    const text = (
                                        <>
                                            <img
                                                width="16px"
                                                height="16px"
                                                src={membershipType.icon}
                                            />{' '}
                                            {membershipType.title} ({networkName})
                                        </>
                                    );
                                    return {
                                        text,
                                        value: membershipType.contractAddress
                                    };
                                }),
                                onFilter: (value, entry) =>
                                    entry.contractAddress.toLowerCase() === value.toLowerCase(),
                                render: contractAddress => {
                                    const type: any = membershipTypes.find(
                                        membership =>
                                            membership.contractAddress.toLowerCase() ===
                                            contractAddress.toLowerCase()
                                    );
                                    if (type) {
                                        return (
                                            <>
                                                <img width="16px" height="16px" src={type.icon} />{' '}
                                                {type.title}
                                            </>
                                        );
                                    } else {
                                        return <>Unknown</>;
                                    }
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
                                title: 'Date',
                                dataIndex: 'timestamp',
                                render: timestamp => moment(timestamp).format('LL'),
                                sorter: (a, b) => b.timestamp - a.timestamp
                            }
                        ]}
                        dataSource={memberships
                            .map((membership: any, index) => {
                                membership.key = index;
                                membership.active = membership.expiration > Date.now();
                                return membership;
                            })
                            .sort((a, b) => b.timestamp - a.timestamp)}
                    />
                </Col>
            </Row>
        </Layout>
    );
};

export default Transactions;
