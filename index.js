import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chiama AppRegistry.registerComponent('main', () => App)
// e assicura il corretto setup dell'ambiente sia in Expo Go che in build native.
registerRootComponent(App);
