import React, { FunctionComponent, Fragment } from 'react';
import ExternalLink from '../ExternalLink';
import makeBlockie from 'ethereum-blockies-base64';

interface Props {
    address: string;
    network?: 'mainnet' | 'xdai';
}

const Address: FunctionComponent<Props> = ({ network, address }) => (
    <Fragment>
        <ExternalLink
            to={
                network && network === 'xdai'
                    ? `https://blockscout.com/poa/xdai/address/${address}`
                    : `https://etherscan.io/address/${address}`
            }
        >
            <img
                style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    verticalAlign: 'text-bottom'
                }}
                src={makeBlockie(address)}
            />{' '}
            <span className="ng-binding" style={{ marginLeft: '5px' }}>
                {address}
            </span>
        </ExternalLink>
    </Fragment>
);

export default Address;
