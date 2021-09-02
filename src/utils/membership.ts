import { ethers, utils } from 'ethers';
import { /*Network, */ memberships } from '../data/contracts';
import networks from '../data/networks';
import { updateMemberships, updateBlock } from '../store/memberships';
//import ABI from '../data/abi.json';
import axios from 'axios';
import Bottleneck from 'bottleneck';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const limiter = new Bottleneck({
    minTime: 500,
    maxConcurrent: 1
});

//const provider = new ethers.providers.JsonRpcProvider('https://api.mycryptoapi.com/eth');
const contracts = memberships; //.map(membershipType => new ethers.Contract(membershipType.contractAddress, ABI, provider));

const getMembershipOwnerAddresses = async (contract, page: number = 0) => {
    const pageSize = 100;
    const owners = await contract.getOwnersByPage(page, pageSize);
    if (owners.length === pageSize) {
        const moreOwners = await getMembershipOwnerAddresses(contract, page + 1);
        return [...owners, ...moreOwners];
    } else {
        return owners;
    }
};

/*const getMembershipOwners = async contract => {
    const ownerAddresses = await getMembershipOwnerAddresses(contract);
    const owners = await Promise.all(
        ownerAddresses.map(async address => {
            const expirationTimestamp = await contract.keyExpirationTimestampFor(address);
            return {
                address,
                expiration: expirationTimestamp.toNumber()
            };
        })
    );
    return owners;
};

export const getOwners = async () => {
    const owners: any[] = [];
    await Promise.all(
        contracts.map(async contract => {
            const numberOfOwners = await contract.numberOfOwners();
            if (numberOfOwners.toNumber() > 0) {
                const membershipOwners = await getMembershipOwners(contract);
                membershipOwners.forEach((membershipOwner: any) => {
                    membershipOwner.membershipContract = contract.address;
                    owners.push(membershipOwner);
                });
            }
        })
    );
    return owners;
};*/

export const getBlocks = async () => {
    const blocks = await Promise.all(
        networks.map(async network => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(network.node);
                const blockNumber = await provider.getBlockNumber();
                return {
                    network: network.name,
                    block: blockNumber
                };
            } catch (e) {
                return {
                    network: network.name,
                    block: 0
                };
            }
        })
    );
    return blocks;
};

export const getMemberships = async (currentBlocks, latestBlocks, updateM: any, updateB: any) => {
    const membershipsResult: any = [];
    const failure: any = {};
    const intervals: any = {};
    networks.forEach(network => {
        intervals[network.name] = network.interval;
    });
    for (let i = currentBlocks.polygon || 0; i < latestBlocks.polygon; i += intervals['polygon']) {
        await Promise.all(
            contracts
                .filter(contract => contract.network === 'polygon')
                .map(async contract => {
                    const url = `https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=${i}&toBlock=${i +
                        intervals[
                            'polygon'
                        ]}&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&apikey=XT96ZVQ4VCMJ8YZNFQHI7SG55TXJG53GIV&address=${
                        contract.contractAddress
                    }`;
                    try {
                        const response: any = await limiter.schedule(() => axios.get(url));
                        if (
                            response.data &&
                            response.data.result &&
                            response.data.result.length > 0
                        ) {
                            response.data.result.forEach(result => {
                                if (
                                    result.topics[1] ===
                                    '0x0000000000000000000000000000000000000000000000000000000000000000'
                                ) {
                                    const contractDetails: any = memberships.find(
                                        membershipType =>
                                            membershipType.contractAddress ===
                                            contract.contractAddress
                                    );
                                    const receiver = utils.getAddress(
                                        `0x${result.topics[2].substr(26, 44)}`
                                    );
                                    const timestamp = utils
                                        .bigNumberify(result.timeStamp)
                                        .toNumber();
                                    const expiration =
                                        timestamp + contractDetails.durationInDays * 24 * 60 * 60;
                                    const membership = {
                                        network: contract.network,
                                        transactionHash: result.transactionHash,
                                        address: receiver,
                                        contractAddress: contract.contractAddress,
                                        timestamp,
                                        expiration
                                    };
                                    membershipsResult.push(membership);
                                    //dispatch(updateMemberships(membershipsResult));
                                    //dispatch(updateBlock(i));
                                }
                            });
                        }
                        if (!('polygon' in failure)) {
                            //updateM(membershipsResult);
                            if (i + intervals['polygon'] >= latestBlocks.polygon) {
                                updateB('polygon', latestBlocks.polygon);
                            } else {
                                updateB('polygon', i);
                            }
                        }
                    } catch (e) {
                        console.error(e);
                        failure['polygon'] = true;
                    }
                })
        );
    }
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
    const result_xdai = await Promise.all(
        contracts
            .filter(contract => contract.network === 'xdai')
            .map(contract => {
                return getMembershipsGraph('xdai', contract.contractAddress);
            })
    );
    //console.log(result);
    result_xdai.forEach(item => {
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
    updateM(membershipsResult);

    return membershipsResult;
};

const client_mainnet = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock',
    cache: new InMemoryCache()
});

const client_xdai = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/xdai',
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
        const data = await client_mainnet.query({
            query: gql(tokensQuery)
        });
        return data.data.locks[0];
    } else if (network === 'xdai') {
        const data = await client_xdai.query({
            query: gql(tokensQuery)
        });
        return data.data.locks[0];
    }
};
