import { utils } from 'ethers';
import { memberships } from '../data/contracts';
//import networks from '../data/networks';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const contracts = memberships; 

export const getMemberships = async (updateM: any) => {
    const membershipsResult: any = [];
    
    const result = await Promise.all(
        contracts
            .filter(contract => contract.network === 'mainnet')
            .map(contract => {
                return getMembershipsGraph('mainnet', contract.contractAddress);
            })
    );
    //console.log(result);
    result.forEach(item => {
        item.keys.forEach(key => {
            const timestamp = utils.bigNumberify(key.createdAt).toNumber() * 1000;
            const membership = {
                network: 'mainnet',
                transactionHash: '0x',
                address: key.owner.address,
                contractAddress: item.address,
                timestamp,
                expiration: utils.bigNumberify(key.expiration).toNumber() * 1000
            };
            //console.log(membership);
            membershipsResult.push(membership);
        });
    });
    const resultXDdai = await Promise.all(
        contracts
            .filter(contract => contract.network === 'xdai')
            .map(contract => {
                return getMembershipsGraph('xdai', contract.contractAddress);
            })
    );
    //console.log(result);
    resultXDdai.forEach(item => {
        item.keys.forEach(key => {
            const timestamp = utils.bigNumberify(key.createdAt).toNumber() * 1000;
            const membership = {
                network: 'xdai',
                transactionHash: '0x',
                address: key.owner.address,
                contractAddress: item.address,
                timestamp,
                expiration: utils.bigNumberify(key.expiration).toNumber() * 1000
            };
            //console.log(membership);
            membershipsResult.push(membership);
        });
    });

    const resultPolygon = await Promise.all(
        contracts
            .filter(contract => contract.network === 'polygon')
            .map(contract => {
                return getMembershipsGraph('polygon', contract.contractAddress);
            })
    );
    //console.log(result);
    resultPolygon.forEach(item => {
        item.keys.forEach(key => {
            const timestamp = utils.bigNumberify(key.createdAt).toNumber() * 1000;
            const membership = {
                network: 'polygon',
                transactionHash: '0x',
                address: key.owner.address,
                contractAddress: item.address,
                timestamp,
                expiration: utils.bigNumberify(key.expiration).toNumber() * 1000
            };
            //console.log(membership);
            membershipsResult.push(membership);
        });
    });

    updateM(membershipsResult);

    //return membershipsResult;
};

const clientMainnet = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock',
    cache: new InMemoryCache()
});

const clientXDai = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/xdai',
    cache: new InMemoryCache()
});

const clientPolygon = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/polygon',
    cache: new InMemoryCache()
});


export const getMembershipsGraph = async (network: string, contractAddress: string) => {
    const tokensQuery = `
  query {
    locks(where: {address: "${contractAddress}"}){
        name
        address
        keys {
          expiration
          createdAt
          owner {
            address
          }
        }
    }
  }
`;
    if (network === 'mainnet') {
        const data = await clientMainnet.query({
            query: gql(tokensQuery)
        });
        return data.data.locks[0];
    } else if (network === 'xdai') {
        const data = await clientXDai.query({
            query: gql(tokensQuery)
        });
        return data.data.locks[0];
    } else if (network === 'polygon') {
        const data = await clientPolygon.query({
            query: gql(tokensQuery)
        });
        return data.data.locks[0];
    }
};
