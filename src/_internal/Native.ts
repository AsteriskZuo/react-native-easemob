/**
 * Call native api
 */

import { NativeModules } from 'react-native';

const { ExtSdkApiRN } = NativeModules;

export class Native {
  protected static _callMethod<T>(method: string, args?: {}): Promise<T> {
    return ExtSdkApiRN.callMethod(method, args);
  }
}
