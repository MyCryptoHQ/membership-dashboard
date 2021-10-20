import React, { FunctionComponent, Fragment, useState } from 'react';
import Layout from '../components/Layout';
import MetaData from '../components/MetaData';
import ExternalLink from '../components/ExternalLink';
import { Row, Col, Table, Icon, Button, Typography } from 'antd';
import { getMemberships } from '../utils/membership';
import { memberships as membershipTypes } from '../data/contracts';
import networks from '../data/networks';
import { useDispatch, useSelector } from '../hooks';
import { updateMemberships } from '../store/memberships';

import '../sass/index.scss';

const { Title } = Typography;

const Index: FunctionComponent = () => {
    const dispatch = useDispatch();
    const memberships = useSelector(state => state.memberships.memberships);
    const updated = useSelector(state => state.memberships.updated);
    const [loading, setLoading] = useState(false);

    const updateData = () => {
        setLoading(true);
       
            getMemberships(
                newMemberships => {
                    dispatch(updateMemberships(newMemberships));
                },
            ).then(() => {
                setLoading(false);
            });
    };

    if (!loading && Date.now() - updated > 30 * 1000) {
        updateData();
    }

    return (
        <Layout>
            <MetaData />
            <Row>
                <Col offset={2} span={20}>
                    <Title level={2}>Overview</Title>
                    <span style={{ position: 'absolute', right: 0, top: 0 }}>
                        <Button
                            shape="circle"
                            icon="reload"
                            loading={loading}
                            disabled={loading}
                            onClick={updateData}
                        />
                    </span>
                    <Table
                        pagination={false}
                        columns={[
                            {
                                title: 'Network',
                                dataIndex: 'network',
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
                                title: 'Name',
                                dataIndex: 'name',
                                render: (name, item) => (
                                    <Row type="flex" justify="space-around">
                                        <Col span={4}>
                                            <img width="20px" height="20px" src={item.icon} />
                                        </Col>
                                        <Col span={20}>{name}</Col>
                                    </Row>
                                )
                            },
                            {
                                title: 'Active',
                                dataIndex: 'activeCount'
                            },
                            {
                                title: 'Total',
                                dataIndex: 'totalCount'
                            },
                            {
                                title: 'Contract',
                                dataIndex: 'contractAddress',
                                render: (contractAddress, item) => {
                                    const networkData = networks.find(
                                        entry => entry.id === item.network
                                    );
                                    if (!networkData) {
                                        return <Fragment />;
                                    }
                                    return (
                                        <ExternalLink
                                            to={`${networkData.explorer}${contractAddress}`}
                                        >
                                            <Icon type="link" />
                                        </ExternalLink>
                                    );
                                }
                            }
                        ]}
                        dataSource={membershipTypes.map((membershipType: any, index) => {
                            membershipType.key = index;
                            membershipType.activeCount = memberships.filter(
                                membership =>
                                    membership.contractAddress.toLowerCase() ===
                                        membershipType.contractAddress.toLowerCase() &&
                                    membership.expiration > Date.now()
                            ).length;
                            membershipType.totalCount = memberships.filter(
                                membership =>
                                    membership.contractAddress.toLowerCase() ===
                                    membershipType.contractAddress.toLowerCase()
                            ).length;
                            return membershipType;
                        })}
                    />
                </Col>
            </Row>
        </Layout>
    );
};

export default Index;
