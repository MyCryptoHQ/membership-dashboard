import { /*ethers,*/ utils } from 'ethers';
import { /*Network, */ memberships } from '../data/contracts';
//import ABI from '../data/abi.json';
import axios from 'axios';
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
    minTime: 100,
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

export const getMemberships = async () => {
    const membershipsResult: any = [];
    await Promise.all(
        contracts
            .filter(contract => contract.network === 'mainnet')
            .map(async contract => {
                const url = `https://etherscan.mycryptoapi.com/${contract.contractAddress}`;
                const response: any = await limiter.schedule(() => axios.get(url));
                if (response.data && response.data.result && response.data.result.length > 0) {
                    response.data.result.forEach(result => {
                        if (
                            result.topics[1] ===
                            '0x0000000000000000000000000000000000000000000000000000000000000000'
                        ) {
                            const contractDetails: any = memberships.find(
                                membershipType =>
                                    membershipType.contractAddress === contract.contractAddress
                            );
                            const receiver = utils.getAddress(
                                `0x${result.topics[2].substr(26, 44)}`
                            );
                            const timestamp = utils.bigNumberify(result.timeStamp).toNumber();
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
                        }
                    });
                }
            })
    );
    await Promise.all(
        contracts
            .filter(contract => contract.network === 'xdai')
            .map(async contract => {
                const url = `https://blockscout.com/xdai/mainnet/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&address=${
                    contract.contractAddress
                }`;
                const response: any = await limiter.schedule(() => axios.get(url));
                if (response.data && response.data.result && response.data.result.length > 0) {
                    response.data.result.forEach(result => {
                        if (
                            result.topics[1] ===
                            '0x0000000000000000000000000000000000000000000000000000000000000000'
                        ) {
                            const contractDetails: any = memberships.find(
                                membershipType =>
                                    membershipType.contractAddress === contract.contractAddress
                            );
                            const receiver = utils.getAddress(
                                `0x${result.topics[2].substr(26, 44)}`
                            );
                            const timestamp = utils.bigNumberify(result.timeStamp).toNumber();
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
                        }
                    });
                }
            })
    );
    return membershipsResult;
};
