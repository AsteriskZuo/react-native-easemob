/**
 * Call native api
 */

import { NativeModules } from 'react-native';

const { ExtSdkApiRN } = NativeModules;
console.log('ExtSdkApiRN: ', ExtSdkApiRN);

export class Native {
  protected static hasErrorFromResult(result: any): void {
    if (result?.error) {
      throw new Error(`${result?.error}`);
    }
  }
  protected static _callMethod<T>(method: string, args?: {}): Promise<T> {
    return ExtSdkApiRN.callMethod(method, args);
  }
}
