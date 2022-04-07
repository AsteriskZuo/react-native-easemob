import type { JsonCodec } from '../_internal/Defines';

/**
 * The settings of the chat SDK.
 *
 * You can set parameters and options of the SDK.
 *
 * For example, whether to encrypt the messages before sending, whether to automatically accept the friend invitations.
 */
export class ChatOptions implements JsonCodec {
  /**
   * The app key you got from the console when create an app.
   */
  appKey: string;
  /**
   * Enables/Disables automatic login.
   *
   * `true`: (default) Enables automatic login;
   * `false`: Disables automatic login.
   */
  autoLogin: boolean;
  /**
   * Debug mode or not.
   */
  debugModel: boolean;
  /**
   * Whether to accept friend invitations from other users automatically.
   *
   * `true`: (default) Accepts friend invitations automatically;
   * `false`: Do not accept friend invitations automatically.
   */
  acceptInvitationAlways: boolean;
  /**
   * Whether to accept group invitations automatically.
   *
   * `true`: (default) Accepts group invitations automatically;
   * `false`: Do not accept group invitations automatically.
   */
  autoAcceptGroupInvitation: boolean;
  /**
   * Whether the read receipt is required.
   *
   * `true`: (default) The read receipt is required;
   * `false`: The read receipt is not required.
   */
  requireAck: boolean;
  /**
   * Whether the delivery receipt is required.
   *
   * `true`: (default) The read receipt is required;
   * `false`: The read receipt is not required.
   */
  requireDeliveryAck: boolean;
  /**
   * Whether to delete the group message when leaving a group.
   *
   * `true`: (default) Delete the messages when leaving the group.
   * `false`: Do not delete the messages when leaving a group.
   */
  deleteMessagesAsExitGroup: boolean;
  /**
   * Whether to delete the chat room message when leaving the chat room.
   *
   * `true`: (default) Delete the chat room related message record when leaving the chat room.
   * `false`: Do not delete the chat room related message record when leaving the chat room.
   */
  deleteMessagesAsExitChatRoom: boolean;
  /**
   * Whether to allow the chat room owner to leave the chat room.
   *
   * `true`: (default) Allow the chat room owner to leave the chat room.
   * `false`: Do not allow the chat room owner to leave the chat room.
   */
  isChatRoomOwnerLeaveAllowed: boolean;
  /**
   * Whether to sort messages by the server received time.
   *
   * `true`: (default) Sort messages by the server received time;
   * `false`: Do not sort messages by the server received time.
   */
  sortMessageByServerTime: boolean;
  /**
   * Sets whether only HTTPS is used for REST operations.
   *
   * `true`: (default) Only HTTPS is used.
   * `false`: Allow to use both HTTP and HTTPS.
   */
  usingHttpsOnly: boolean;
  /**
   * Whether to upload the message attachments automatically to the chat server.
   *
   * `true`: (default) Use the default way to upload and download the message attachments by chat server;
   * `false`: Do not use the default way to upload and download the message attachments by chat server, using a customized path instead.
   */
  serverTransfer: boolean;
  /**
   * Whether to auto download the thumbnail.
   *
   * `true`: (default) Download the thumbnail automatically;
   * `false`: Do not download the thumbnail automatically.
   */
  isAutoDownload: boolean;
  // pushConfig?: //todo: not implement
  /**
   * Sets whether to disable DNS.
   *
   * `true`: (default) Enable DNS;
   * `false`: Do not enable DNS.
   */
  enableDNSConfig: boolean;
  /**
   * The DNS url.
   */
  dnsUrl: string;
  /**
   * The custom REST server.
   */
  restServer: string;
  /**
   * The custom im message server url.
   */
  imServer: string;
  /**
   * The custom im server port.
   */
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
