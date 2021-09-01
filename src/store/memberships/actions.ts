import { ActionCreator } from 'redux';
import {
    UPDATE_MEMBERSHIPS,
    UPDATE_BLOCK,
    UpdateMembershipsAction,
    UpdateBlockAction
} from './types';
import { Network } from '../../data/contracts';

export const updateMemberships: ActionCreator<UpdateMembershipsAction> = (memberships: any[]) => ({
    type: UPDATE_MEMBERSHIPS,
    memberships
});

export const updateBlock: ActionCreator<UpdateBlockAction> = (network: Network, block: number) => ({
    type: UPDATE_BLOCK,
    network,
    block
});
