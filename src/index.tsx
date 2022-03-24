// import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

// const LINKING_ERROR =
//   `The package 'react-native-easemob' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo managed workflow\n';

// const Easemob = NativeModules.Easemob
//   ? NativeModules.Easemob
//   : new Proxy(
//       {},
//       {
//         get() {
//           throw new Error(LINKING_ERROR);
//         },
//       }
//     );
// const eventEmitter = new NativeEventEmitter(Easemob);

// export function multiply(a: number, b: number): Promise<number> {
//   return Easemob.multiply(a, b);
// }


import { ChatClient } from './ChatClient';
import { ChatManager } from './ChatManager';

export default ChatClient;
export { ChatManager };
