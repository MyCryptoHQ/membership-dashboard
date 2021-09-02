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
    currentBlocks: {
        Network?: number;
    };
    latestBlocks: {
        Network?: number;
    };
}

export const UPDATE_MEMBERSHIPS = 'UPDATE_MEMBERSHIPS';
export interface UpdateMembershipsAction extends Action {
    type: typeof UPDATE_MEMBERSHIPS;
    memberships: Membership[];
}

export const UPDATE_CURRENT_BLOCK = 'UPDATE_CURRENT_BLOCK';
export interface UpdateCurrentBlockAction extends Action {
    type: typeof UPDATE_CURRENT_BLOCK;
    network: Network;
    block: number;
}

export const UPDATE_LATEST_BLOCK = 'UPDATE_LATEST_BLOCK';
export interface UpdateLatestBlockAction extends Action {
    type: typeof UPDATE_LATEST_BLOCK;
    network: Network;
    block: number;
}

export type MembershipsActions =
    | UpdateMembershipsAction
    | UpdateCurrentBlockAction
    | UpdateLatestBlockAction;
