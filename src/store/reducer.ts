import { combineReducers } from 'redux';
import { ApplicationState } from './index';
import { membershipsReducer, MembershipsActions } from './memberships';

export type ApplicationActions = MembershipsActions;

const rootReducer = combineReducers<ApplicationState>({
    memberships: membershipsReducer
});

export default rootReducer;
