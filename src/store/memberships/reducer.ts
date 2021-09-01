import { Reducer } from 'redux';
import { UPDATE_MEMBERSHIPS, UPDATE_BLOCK, MembershipsActions, MembershipsState } from './types';

const INITIAL_STATE: MembershipsState = {
    memberships: [],
    updated: 0,
    blocks: {}
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
        case UPDATE_BLOCK:
            return {
                ...state,
                blocks: {
                    ...state.blocks,
                    [action.network]: action.block
                }
            };
        default:
            return state;
    }
};
