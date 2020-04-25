import { Reducer } from 'redux';
import { UPDATE_MEMBERSHIPS, MembershipsActions, MembershipsState } from './types';

const INITIAL_STATE: MembershipsState = {
    memberships: [],
    updated: 0
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
        default:
            return state;
    }
};
