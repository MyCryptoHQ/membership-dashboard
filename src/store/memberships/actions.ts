import { ActionCreator } from 'redux';
import {
    UPDATE_MEMBERSHIPS,
    UPDATE_CURRENT_BLOCK,
    UPDATE_LATEST_BLOCK,
    UpdateMembershipsAction,
    UpdateCurrentBlockAction,
    UpdateLatestBlockAction
} from './types';
import { Network } from '../../data/contracts';

export const updateMemberships: ActionCreator<UpdateMembershipsAction> = (memberships: any[]) => ({
    type: UPDATE_MEMBERSHIPS,
    memberships
});

export const updateCurrentBlock: ActionCreator<UpdateCurrentBlockAction> = (
    network: Network,
    block: number
) => ({
    type: UPDATE_CURRENT_BLOCK,
    network,
    block
});

export const updateLatestBlock: ActionCreator<UpdateLatestBlockAction> = (
    network: Network,
    block: number
) => ({
    type: UPDATE_LATEST_BLOCK,
    network,
    block
});
