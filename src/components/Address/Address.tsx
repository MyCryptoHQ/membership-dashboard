import React, { FunctionComponent, Fragment } from 'react';
import ExternalLink from '../ExternalLink';
import makeBlockie from 'ethereum-blockies-base64';

interface Props {
    address: string;
    network?: 'mainnet' | 'xdai';
}

const getBlockExplorer = (network: string | undefined, address: string) => {
    if (network === 'xdai') {
        return `https://blockscout.com/poa/xdai/address/${address}`;
    } else if (network === 'polygon') {
        return `https://polygonscan.com/address/${address}`;
    } else {
        return `https://etherscan.io/address/${address}`;
    }
};

const Address: FunctionComponent<Props> = ({ network, address }) => (
    <Fragment>
        <ExternalLink to={getBlockExplorer(network, address)}>
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
