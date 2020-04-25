import { MembershipsState } from './memberships';
import { configureStore } from './configureStore';

const { store, persistor } = configureStore();

export interface ApplicationState {
    memberships: MembershipsState;
}

export * from './configureStore';

export { store, persistor };
