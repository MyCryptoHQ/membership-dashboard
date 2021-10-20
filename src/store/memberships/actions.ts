import { ActionCreator } from 'redux';
import {
    UPDATE_MEMBERSHIPS,
    UpdateMembershipsAction
} from './types';

export const updateMemberships: ActionCreator<UpdateMembershipsAction> = (memberships: any[]) => ({
    type: UPDATE_MEMBERSHIPS,
    memberships
});