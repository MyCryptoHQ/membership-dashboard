import { utils } from 'ethers';
import { memberships as contracts } from '../data/contracts';
import networks from '../data/networks';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const graphs = networks.map((network: any) => {
    network.graph = new ApolloClient({
        uri: network.graph_uri,
        cache: new InMemoryCache()
    });
    return network;
});


export const getMembershipsGraph = async (client: any, contractAddress: string) => {
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

    const data = await client.query({
        query: gql(tokensQuery)
    });
    return data.data.locks[0];
};


export const getMemberships = async (updateM: any) => {
    const membershipsResult: any = [];

    await Promise.all(graphs.map(async network => {
        const result = await Promise.all(
            contracts
                .filter(contract => contract.network === network.id)
                .map(contract => {
                    return getMembershipsGraph(network.graph, contract.contractAddress);
                })
        );
        
        result.forEach(item => {
            item.keys.forEach(key => {
                const timestamp = utils.bigNumberify(key.createdAt).toNumber() * 1000;
                const membership = {
                    network: network.id,
                    transactionHash: '0x',
                    address: key.owner.address,
                    contractAddress: item.address,
                    timestamp,
                    expiration: utils.bigNumberify(key.expiration).toNumber() * 1000
                };
                membershipsResult.push(membership);
            });
        });
    }));

    updateM(membershipsResult);
};