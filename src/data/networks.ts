import Mainnet from '../images/mainnet.svg';
import xDai from '../images/xdai.svg';
import Polygon from '../images/polygon.svg';

interface Network {
    icon: any;
    id: string;
    name: string;
    node: string;
    explorer: string;
    interval: number;
}

const networks: Network[] = [
    {
        icon: Mainnet,
        id: 'mainnet',
        name: 'Mainnet',
        node: 'https://mainnet.infura.io/v3/f3b4711ae677488bb3c56de93c6cab1a',
        explorer: 'https://etherscan.io/address/',
        interval: 1000000
    },
    {
        icon: xDai,
        id: 'xdai',
        name: 'xDai',
        node: 'https://rpc.xdaichain.com/',
        explorer: 'https://blockscout.com/xdai/mainnet/address/',
        interval: 10000
    },
    {
        icon: Polygon,
        id: 'polygon',
        name: 'Polygon',
        node: 'https://rpc-mainnet.matic.quiknode.pro',
        explorer: 'https://polygonscan.com/address/',
        interval: 5000000
    }
];

export default networks;
