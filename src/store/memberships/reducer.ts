import { Reducer } from 'redux';
import {
    UPDATE_MEMBERSHIPS,
    UPDATE_CURRENT_BLOCK,
    UPDATE_LATEST_BLOCK,
    MembershipsActions,
    MembershipsState
} from './types';

const INITIAL_STATE: MembershipsState = {
    memberships: [],
    updated: 0,
    currentBlocks: {},
    latestBlocks: {}
};

export const reducer: Reducer<MembershipsState, MembershipsActions> = (
    state = INITIAL_STATE,
    action
): MembershipsState => {
    switch (action.type) {
        case UPDATE_MEMBERSHIPS:
            return {
                ...state,
                memberships: action.memberships,
                updated: Date.now()
            };
        case UPDATE_CURRENT_BLOCK:
            return {
                ...state,
                currentBlocks: {
                    ...state.currentBlocks,
                    [action.network]: action.block
                }
            };
        case UPDATE_LATEST_BLOCK:
            return {
                ...state,
                latestBlocks: {
                    ...state.latestBlocks,
                    [action.network]: action.block
                }
            };
        default:
            return state;
    }
};
