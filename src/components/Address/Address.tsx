import React, { FunctionComponent, Fragment } from 'react';
import ExternalLink from '../ExternalLink';
import makeBlockie from 'ethereum-blockies-base64';

interface Props {
    address: string;
}

const Address: FunctionComponent<Props> = ({ address }) => (
    <Fragment>
        <ExternalLink to={`https://etherscan.io/address/${address}`}>
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
