import {State} from './state';

export function doRouterNavigation(state: State, newRouteName: string, newRouteParams: any = {}) {
    const newState = {...state};
    newState.router = {...state.router};
    newState.router.newRoute = {
        name: newRouteName,
        params: newRouteParams,
    };
    return newState;
}

export function isOffline(state: State) {
    const newState = {...state};
    newState.isOnline = false;
    return newState;
}

export function isOnline(state: State) {
    const newState = {...state};
    newState.isOnline = true;
    return newState;
}
