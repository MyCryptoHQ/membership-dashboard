import React, { FunctionComponent, Fragment } from 'react';
import ExternalLink from '../ExternalLink';
import makeBlockie from 'ethereum-blockies-base64';
import networks from '../../data/networks';
import { Network } from '../../data/contracts';

interface Props {
    address: string;
    network?: Network;
}

const Address: FunctionComponent<Props> = ({ network, address }) => {
    const networkData: any = networks.find(item => item.id === network);
    if (network) {
        return (
            <ExternalLink to={`${networkData.explorer}${address}`}>
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
        );
    } else {
        return (
            <Fragment>
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
            </Fragment>
        );
    }
};

export default Address;
