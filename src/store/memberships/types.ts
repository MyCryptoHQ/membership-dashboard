import { Action } from 'redux';
import { Network } from '../../data/contracts';

interface Membership {
    network: Network;
    transactionHash: string;
    address: string;
    contractAddress: string;
    timestamp: number;
    expiration: number;
}

export interface MembershipsState {
    memberships: Membership[];
    updated: number;
}

export const UPDATE_MEMBERSHIPS = 'UPDATE_MEMBERSHIPS';
export interface UpdateMembershipsAction extends Action {
    type: typeof UPDATE_MEMBERSHIPS;
    memberships: Membership[];
}



export type MembershipsActions =
    | UpdateMembershipsAction;
