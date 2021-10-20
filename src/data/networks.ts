import Mainnet from '../images/mainnet.svg';
import xDai from '../images/xdai.svg';
import Polygon from '../images/polygon.svg';

interface Network {
    icon: any;
    id: string;
    name: string;
    graph_uri: string;
    explorer: string;
}

const networks: Network[] = [
    {
        icon: Mainnet,
        id: 'mainnet',
        name: 'Mainnet',
        graph_uri: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock',
        explorer: 'https://etherscan.io/address/'
    },
    {
        icon: xDai,
        id: 'xdai',
        name: 'xDai',
        graph_uri: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/xdai',
        explorer: 'https://blockscout.com/xdai/mainnet/address/'
    },
    {
        icon: Polygon,
        id: 'polygon',
        name: 'Polygon',
        graph_uri: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/polygon',
        explorer: 'https://polygonscan.com/address/'
    }
];

export default networks;
