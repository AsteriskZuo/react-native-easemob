import type { JsonCodec } from '../_internal/Defines';

export class ChatDeviceInfo implements JsonCodec {
  resource: string;
  deviceUUID: string;
  deviceName: string;

  constructor(resource: string, deviceUUID: string, deviceName: string) {
    this.resource = resource;
    this.deviceName = deviceName;
    this.deviceUUID = deviceUUID;
  }
  static fromJson(json: Map<string, any>): ChatDeviceInfo {
    let resource = json.get('resource');
    let deviceUUID = json.get('deviceUUID');
    let deviceName = json.get('deviceName');
    return new ChatDeviceInfo(resource, deviceUUID, deviceName);
  }
  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('resource', this.resource);
    r.set('deviceUUID', this.deviceUUID);
    r.set('deviceName', this.deviceName);
    return r;
  }
}
