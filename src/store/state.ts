export interface Route {
  name: string;
  params: object;
}

export interface Router {
  currentRoute: Route;
  newRoute: Route | null;
}

export interface State {
  isOnline: boolean;
  router: Router;
}
