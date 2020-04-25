import React, { FunctionComponent, useState } from 'react';
import Layout from '../components/Layout';
import MetaData from '../components/MetaData';
import ExternalLink from '../components/ExternalLink';
import { Row, Col, Table, Icon, Button, Typography } from 'antd';
import { getMemberships } from '../utils/membership';
import { memberships as membershipTypes } from '../data/contracts';
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
        getMemberships().then(result => {
            dispatch(updateMemberships(result));
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
                    <Button
                        style={{ position: 'absolute', right: 0, top: 0 }}
                        shape="circle"
                        icon="reload"
                        loading={loading}
                        disabled={loading}
                        onClick={updateData}
                    />
                    <Table
                        pagination={false}
                        columns={[
                            {
                                title: 'Icon',
                                dataIndex: 'icon',
                                render: icon => <img width="16px" height="16px" src={icon} />
                            },
                            {
                                title: 'Name',
                                dataIndex: 'name'
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
                                render: contractAddress => (
                                    <ExternalLink
                                        to={`https://etherscan.io/address/${contractAddress}`}
                                    >
                                        <Icon type="link" />
                                    </ExternalLink>
                                )
                            }
                        ]}
                        dataSource={membershipTypes.map((membershipType: any, index) => {
                            membershipType.key = index;
                            membershipType.activeCount = memberships.filter(
                                membership =>
                                    membership.contractAddress === membershipType.contractAddress &&
                                    membership.expiration > Math.round(Date.now() / 1000)
                            ).length;
                            membershipType.totalCount = memberships.filter(
                                membership =>
                                    membership.contractAddress === membershipType.contractAddress
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
