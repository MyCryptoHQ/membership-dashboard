import oneMonthIcon from '../images/membership-onemonth.svg';
import threeMonthsIcon from '../images/membership-threemonths.svg';
import sixMonthsIcon from '../images/membership-sixmonths.svg';
import twelveMonthsIcon from '../images/membership-twelvemonths.svg';
import lifetimeIcon from '../images/membership-lifetime.svg';

export interface Membership {
    title: string;
    name: string;
    icon: any;
    contractAddress: string;
    durationInDays: number;
}

export const memberships: Membership[] = [
    {
        title: '1 month',
        name: 'One Month Membership',
        icon: oneMonthIcon,
        contractAddress: '0x6cA105D2AF7095B1BCEeb6A2113D168ddDCD57cf',
        durationInDays: 30
    },
    {
        title: '3 months',
        name: 'Three Month Membership',
        icon: threeMonthsIcon,
        contractAddress: '0xfe58C642A3F703e7Dc1060B3eE02ED4619046125',
        durationInDays: 90
    },
    {
        title: '6 months',
        name: 'Six Month Membership',
        icon: sixMonthsIcon,
        contractAddress: '0x7a84f1074B5929cBB7bd08Fb450CF9Fb22bf5329',
        durationInDays: 180
    },
    {
        title: '12 months',
        name: 'Twelve Month Membership',
        icon: twelveMonthsIcon,
        contractAddress: '0xee2B7864d8bc731389562F820148e372F57571D8',
        durationInDays: 366
    },
    {
        title: 'I 💖 MyCrypto',
        name: 'Lifetime Membership',
        icon: lifetimeIcon,
        contractAddress: '0x098D8b363933D742476DDd594c4A5a5F1a62326a',
        durationInDays: 36500
    }
];
