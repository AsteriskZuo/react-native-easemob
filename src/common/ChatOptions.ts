import type { JsonCodec } from '../_internal/Defines';

export class ChatOptions implements JsonCodec {
  appKey: string;
  autoLogin: boolean;
  debugModel: boolean;
  acceptInvitationAlways: boolean;
  autoAcceptGroupInvitation: boolean;
  requireAck: boolean;
  requireDeliveryAck: boolean;
  deleteMessagesAsExitGroup: boolean;
  deleteMessagesAsExitChatRoom: boolean;
  isChatRoomOwnerLeaveAllowed: boolean;
  sortMessageByServerTime: boolean;
  usingHttpsOnly: boolean;
  serverTransfer: boolean;
  isAutoDownload: boolean;
  // pushConfig?: //todo: not implement
  enableDNSConfig: boolean;
  dnsUrl: string;
  restServer: string;
  imServer: string;
  imPort: number;
  constructor(params: {
    appKey: string;
    autoLogin?: boolean;
    debugModel?: boolean;
    acceptInvitationAlways?: boolean;
    autoAcceptGroupInvitation?: boolean;
    requireAck?: boolean;
    requireDeliveryAck?: boolean;
    deleteMessagesAsExitGroup?: boolean;
    deleteMessagesAsExitChatRoom?: boolean;
    isChatRoomOwnerLeaveAllowed?: boolean;
    sortMessageByServerTime?: boolean;
    usingHttpsOnly?: boolean;
    serverTransfer?: boolean;
    isAutoDownload?: boolean;
    // pushConfig??: //todo?: not implement
    enableDNSConfig?: boolean;
    dnsUrl?: string;
    restServer?: string;
    imServer?: string;
    imPort?: number;
  }) {
    this.appKey = params.appKey;
    this.autoLogin = params.autoLogin ?? true;
    this.debugModel = params.debugModel ?? false;
    this.acceptInvitationAlways = params.acceptInvitationAlways ?? false;
    this.autoAcceptGroupInvitation = params.autoAcceptGroupInvitation ?? false;
    this.requireAck = params.requireAck ?? true;
    this.requireDeliveryAck = params.requireDeliveryAck ?? false;
    this.deleteMessagesAsExitGroup = params.deleteMessagesAsExitGroup ?? true;
    this.deleteMessagesAsExitChatRoom =
      params.deleteMessagesAsExitChatRoom ?? true;
    this.isChatRoomOwnerLeaveAllowed =
      params.isChatRoomOwnerLeaveAllowed ?? true;
    this.sortMessageByServerTime = params.sortMessageByServerTime ?? true;
    this.usingHttpsOnly = params.usingHttpsOnly ?? false;
    this.serverTransfer = params.serverTransfer ?? true;
    this.isAutoDownload = params.isAutoDownload ?? true;
    //todo: not implement
    this.enableDNSConfig = params.enableDNSConfig ?? true;
    this.dnsUrl = params.dnsUrl ?? '';
    this.restServer = params.restServer ?? '';
    this.imServer = params.imServer ?? '';
    this.imPort = params.imPort ?? 0;
  }
  static fromJson(json: Map<string, any>): JsonCodec {
    let appKey = json.get('appKey');
    let autoLogin = json.get('autoLogin') as boolean;
    let debugModel = json.get('debugModel') as boolean;
    let requireAck = json.get('requireAck') as boolean;
    let requireDeliveryAck = json.get('requireDeliveryAck') as boolean;
    let sortMessageByServerTime = json.get(
      'sortMessageByServerTime'
    ) as boolean;
    let acceptInvitationAlways = json.get('acceptInvitationAlways') as boolean;
    let autoAcceptGroupInvitation = json.get(
      'autoAcceptGroupInvitation'
    ) as boolean;
    let deleteMessagesAsExitGroup = json.get(
      'deleteMessagesAsExitGroup'
    ) as boolean;
    let deleteMessagesAsExitChatRoom = json.get(
      'deleteMessagesAsExitChatRoom'
    ) as boolean;
    let isAutoDownload = json.get('isAutoDownload') as boolean;
    let isChatRoomOwnerLeaveAllowed = json.get(
      'isChatRoomOwnerLeaveAllowed'
    ) as boolean;
    let serverTransfer = json.get('serverTransfer') as boolean;
    let usingHttpsOnly = json.get('usingHttpsOnly') as boolean;
    //todo: not implement
    let enableDNSConfig = json.get('enableDNSConfig') as boolean;
    let imServer = json.get('imServer');
    let restServer = json.get('restServer');
    let dnsUrl = json.get('dnsUrl');
    let imPort = json.get('imPort') as number;
    return new ChatOptions({
      appKey,
      autoLogin,
      debugModel,
      acceptInvitationAlways,
      autoAcceptGroupInvitation,
      requireAck,
      requireDeliveryAck,
      deleteMessagesAsExitGroup,
      deleteMessagesAsExitChatRoom,
      isChatRoomOwnerLeaveAllowed,
      sortMessageByServerTime,
      usingHttpsOnly,
      serverTransfer,
      isAutoDownload,
      // pushConfig?: //todo: not implement
      enableDNSConfig,
      dnsUrl,
      restServer,
      imServer,
      imPort,
    });
  }
  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('appKey', this.appKey);
    r.set('autoLogin', this.autoLogin);
    r.set('debugModel', this.debugModel);
    r.set('acceptInvitationAlways', this.acceptInvitationAlways);
    r.set('autoAcceptGroupInvitation', this.autoAcceptGroupInvitation);
    r.set('requireAck', this.requireAck);
    r.set('requireDeliveryAck', this.requireDeliveryAck);
    r.set('deleteMessagesAsExitGroup', this.deleteMessagesAsExitGroup);
    r.set('deleteMessagesAsExitChatRoom', this.deleteMessagesAsExitChatRoom);
    r.set('isChatRoomOwnerLeaveAllowed', this.isChatRoomOwnerLeaveAllowed);
    r.set('sortMessageByServerTime', this.sortMessageByServerTime);
    r.set('usingHttpsOnly', this.usingHttpsOnly);
    r.set('serverTransfer', this.serverTransfer);
    r.set('isAutoDownload', this.isAutoDownload);
    // pushConfig?: //todo: not implement
    r.set('enableDNSConfig', this.enableDNSConfig);
    r.set('dnsUrl', this.dnsUrl);
    r.set('restServer', this.restServer);
    r.set('imServer', this.imServer);
    r.set('imPort', this.imPort);
    return r;
  }
}
