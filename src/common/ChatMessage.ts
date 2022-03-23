import type { NativeEventEmitter } from 'react-native';
import { generateMessageId, getNowTimestamp } from 'src/_internal/Utils';
import type { JsonCodec } from '../_internal/Defines';
import type { ChatError } from './ChatError';

// 消息类型
export enum ChatMessageChatType {
  PeerChat = 0, // 单聊消息
  GroupChat = 1, // 群聊消息
  ChatRoom = 2, // 聊天室消息
}

// 消息方向
export enum ChatMessageDirection {
  SEND, // 发送的消息
  RECEIVE, // 接收的消息
}

// 消息状态
export enum ChatMessageStatus {
  CREATE = 0, // 创建
  PROGRESS = 1, // 发送中
  SUCCESS = 2, // 发送成功
  FAIL = 3, // 发送失败
}

// 附件状态
export enum ChatDownloadStatus {
  PENDING = -1, // 下载未开始
  DOWNLOADING = 0, // 下载中
  SUCCESS = 1, // 下载成功
  FAILED = 2, // 下载失败
}

/// body类型
export enum ChatMessageBodyType {
  TXT = 'txt', // 文字消息
  IMAGE = 'img', // 图片消息
  VIDEO = 'video', // 视频消息
  LOCATION = 'loc', // 位置消息
  VOICE = 'voice', // 音频消息
  FILE = 'file', // 文件消息
  CMD = 'cmd', // CMD消息
  CUSTOM = 'custom', // CUSTOM消息
}

export function ChatMessageChatTypeFromNumber(
  params: number
): ChatMessageChatType {
  switch (params) {
    case 2:
      return ChatMessageChatType.ChatRoom;
    case 1:
      return ChatMessageChatType.GroupChat;
    default:
      return ChatMessageChatType.PeerChat;
  }
}
export function ChatGroupPermissionTypeToString(
  params: ChatMessageChatType
): string {
  return ChatMessageChatType[params];
}

export function ChatMessageDirectionFromString(
  params: string
): ChatMessageDirection {
  switch (params) {
    case 'send':
      return ChatMessageDirection.SEND;
    default:
      return ChatMessageDirection.RECEIVE;
  }
}

export function ChatMessageStatusFromNumber(params: number): ChatMessageStatus {
  switch (params) {
    case 3:
      return ChatMessageStatus.FAIL;
    case 2:
      return ChatMessageStatus.SUCCESS;
    case 1:
      return ChatMessageStatus.PROGRESS;
    default:
      return ChatMessageStatus.CREATE;
  }
}
export function ChatMessageStatusToString(params: ChatMessageStatus): string {
  return ChatMessageStatus[params];
}

export function ChatDownloadStatusFromNumber(
  params: number
): ChatDownloadStatus {
  switch (params) {
    case 0:
      return ChatDownloadStatus.DOWNLOADING;
    case 1:
      return ChatDownloadStatus.SUCCESS;
    case 2:
      return ChatDownloadStatus.FAILED;
    default:
      return ChatDownloadStatus.PENDING;
  }
}
export function ChatDownloadStatusToString(params: ChatDownloadStatus): string {
  return ChatDownloadStatus[params];
}

export function ChatMessageBodyTypeFromString(
  params: string
): ChatMessageBodyType {
  switch (params) {
    case 'txt':
      return ChatMessageBodyType.TXT;
    case 'loc':
      return ChatMessageBodyType.LOCATION;
    case 'cmd':
      return ChatMessageBodyType.CMD;
    case 'custom':
      return ChatMessageBodyType.CUSTOM;
    case 'file':
      return ChatMessageBodyType.FILE;
    case 'img':
      return ChatMessageBodyType.IMAGE;
    case 'video':
      return ChatMessageBodyType.VIDEO;
    case 'voice':
      return ChatMessageBodyType.VOICE;
    default:
      throw new Error(`not exist this type: ${params}`);
  }
}

export interface ChatMessageStatusListener {
  /// 消息进度
  onProgress(progress: number): void;

  /// 消息发送失败
  onError(error: ChatError): void;

  /// 消息发送成功
  onSuccess(): void;

  /// 消息已读
  onReadAck(): void;

  /// 消息已送达
  onDeliveryAck(): void;

  /// 消息状态发生改变
  onStatusChanged(): void;
}

class MessageCallBackManager {
  private static instance: MessageCallBackManager;
  public static getInstance(): MessageCallBackManager {
    if (
      MessageCallBackManager.instance == null ||
      MessageCallBackManager.instance == undefined
    ) {
      MessageCallBackManager.instance = new MessageCallBackManager();
    }
    return MessageCallBackManager.instance;
  }

  constructor() {
    this.cacheMessageMap = new Map<number, ChatMessage>();
  }

  cacheMessageMap: Map<number, ChatMessage>;

  setHandler(event: NativeEventEmitter): void {
    //todo: 接收native消息
    // event.addListener(Prefix + event, callback);
  }

  addMessage(message: ChatMessage): void {
    this.cacheMessageMap.set(message.localTime, message);
  }
  delMessage(key: number): void {
    this.cacheMessageMap.delete(key);
  }
}

export class ChatMessage implements JsonCodec {
  msgId: string = generateMessageId();
  convId: string = '';
  from: string = '';
  to: string = '';
  localTime: number = getNowTimestamp();
  serverTime: number = getNowTimestamp();
  hasDeliverAck: boolean = false;
  hasReadAck: boolean = false;
  needGroupAck: boolean = false;
  groupAckCount: number = 0;
  hasRead: boolean = false;
  chatType: ChatMessageChatType = ChatMessageChatType.ChatRoom;
  direction: ChatMessageDirection = ChatMessageDirection.SEND;
  status: ChatMessageStatus = ChatMessageStatus.CREATE;
  attributes: Map<string, any> = new Map<string, any>();
  body: ChatMessageBody;

  constructor(params: {
    msgId?: string;
    convId?: string;
    from?: string;
    to?: string;
    localTime?: number;
    serverTime?: number;
    hasDeliverAck?: boolean;
    hasReadAck?: boolean;
    needGroupAck?: boolean;
    groupAckCount?: number;
    hasRead?: boolean;
    chatType?: ChatMessageChatType;
    direction?: ChatMessageDirection;
    status?: ChatMessageStatus;
    attributes?: Map<string, any>;
    body: ChatMessageBody;
  }) {
    this.msgId = params.msgId ?? generateMessageId();
    this.convId = params.convId ?? '';
    this.from = params.from ?? '';
    this.to = params.to ?? '';
    this.localTime = params.localTime ?? getNowTimestamp();
    this.serverTime = params.serverTime ?? getNowTimestamp();
    this.hasDeliverAck = params.hasDeliverAck ?? false;
    this.hasReadAck = params.hasReadAck ?? false;
    this.needGroupAck = params.needGroupAck ?? false;
    this.groupAckCount = params.groupAckCount ?? 0;
    this.hasRead = params.hasRead ?? false;
    this.chatType = params.chatType ?? ChatMessageChatType.ChatRoom;
    this.direction = params.direction ?? ChatMessageDirection.SEND;
    this.status = params.status ?? ChatMessageStatus.CREATE;
    this.attributes = params.attributes ?? new Map<string, any>();
    this.body = params.body;
  }

  static fromJson(json: Map<string, any>): ChatMessage {
    let msgId = json.get('msgId');
    let convId = json.get('conversationId');
    let from = json.get('from');
    let to = json.get('to');
    let localTime = json.get('localTime') as number;
    let serverTime = json.get('serverTime') as number;
    let hasDeliverAck = json.get('hasDeliverAck') as boolean;
    let hasReadAck = json.get('hasReadAck') as boolean;
    let needGroupAck = json.get('needGroupAck') as boolean;
    let groupAckCount = json.get('groupAckCount') as number;
    let hasRead = json.get('hasRead') as boolean;
    let chatType = ChatMessageChatTypeFromNumber(
      json.get('chatType') as number
    );
    let direction = ChatMessageDirectionFromString(json.get('direction'));
    let status = ChatMessageStatusFromNumber(json.get('status') as number);
    let attributes = json.get('groupAckCount') as Map<string, any>;
    let body = ChatMessage.getBody(json.get('body') as Map<string, any>);
    // let s = new ChatMessage({msgId: msgId, body: body});
    return new ChatMessage({
      msgId: msgId,
      convId: convId,
      from: from,
      to: to,
      localTime: localTime,
      serverTime: serverTime,
      hasDeliverAck: hasDeliverAck,
      hasReadAck: hasReadAck,
      needGroupAck: needGroupAck,
      groupAckCount: groupAckCount,
      hasRead: hasRead,
      chatType: chatType,
      direction: direction,
      status: status,
      attributes: attributes,
      body: body,
    });
  }

  toJson(): Map<string, any> {
    throw new Error('Method not implemented.');
  }

  static getBody(json: Map<string, any>): ChatMessageBody {
    let type = ChatMessageBodyTypeFromString(json.get('type') as string);
    switch (type) {
      case ChatMessageBodyType.TXT:
        return ChatTextMessageBody.fromJson(json);

      case ChatMessageBodyType.LOCATION:
        return ChatLocationMessageBody.fromJson(json);

      case ChatMessageBodyType.CMD:
        return ChatCmdMessageBody.fromJson(json);

      case ChatMessageBodyType.CUSTOM:
        return ChatCustomMessageBody.fromJson(json);

      case ChatMessageBodyType.FILE:
        return ChatFileMessageBody.fromJson(json);

      case ChatMessageBodyType.IMAGE:
        return ChatImageMessageBody.fromJson(json);

      case ChatMessageBodyType.VIDEO:
        return ChatVideoMessageBody.fromJson(json);

      case ChatMessageBodyType.VOICE:
        return ChatVoiceMessageBody.fromJson(json);

      default:
        throw new Error(`not exist this type: ${type}`);
    }
  }

  callback?: ChatMessageStatusListener;

  setMessageCallback(callback: ChatMessageStatusListener): void {
    this.callback = callback;
    if (this.callback) {
      MessageCallBackManager.getInstance().addMessage(this);
    } else {
      MessageCallBackManager.getInstance().delMessage(this.localTime);
    }
  }

  static createSendMessage(body: ChatMessageBody, to: string): ChatMessage {
    let r = new ChatMessage({
      body: body,
      direction: ChatMessageDirection.SEND,
      to: to,
      hasRead: true,
    });
    return r;
  }

  public static createTextMessage(
    username: string,
    content: string
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatTextMessageBody({ content: content }),
      username
    );
  }

  public static createFileMessage(
    username: string,
    filePath: string,
    opt?: {
      displayName: string;
    }
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatFileMessageBody({
        localPath: filePath,
        displayName: opt?.displayName ?? '',
      }),
      username
    );
  }

  public static createImageMessage(
    username: string,
    filePath: string,
    opt?: {
      displayName: string;
      thumbnailLocalPath: string;
      sendOriginalImage: boolean;
      width: number;
      height: number;
    }
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatImageMessageBody({
        localPath: filePath,
        displayName: opt?.displayName ?? '',
        thumbnailLocalPath: opt?.thumbnailLocalPath,
        sendOriginalImage: opt?.sendOriginalImage,
        width: opt?.width,
        height: opt?.height,
      }),
      username
    );
  }

  public static createVideoMessage(
    username: string,
    filePath: string,
    opt?: {
      displayName: string;
      thumbnailLocalPath: string;
      duration: number;
      width: number;
      height: number;
    }
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatVideoMessageBody({
        localPath: filePath,
        displayName: opt?.displayName ?? '',
        thumbnailLocalPath: opt?.thumbnailLocalPath,
        duration: opt?.duration,
        width: opt?.width,
        height: opt?.height,
      }),
      username
    );
  }

  public static createVoiceMessage(
    username: string,
    filePath: string,
    opt?: {
      displayName: string;
      duration: number;
    }
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatVoiceMessageBody({
        localPath: filePath,
        displayName: opt?.displayName ?? '',
        duration: opt?.duration,
      }),
      username
    );
  }

  public static createLocationMessage(
    username: string,
    latitude: string,
    longitude: string,
    opt?: {
      address: string;
    }
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatLocationMessageBody({
        latitude: latitude,
        longitude: longitude,
        address: opt?.address ?? '',
      }),
      username
    );
  }

  public static createCmdMessage(
    username: string,
    action: string
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatCmdMessageBody({
        action: action,
      }),
      username
    );
  }

  public static createCustomMessage(
    username: string,
    event: string,
    opt?: {
      params: Map<string, any>;
    }
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatCustomMessageBody({
        event: event,
        params: opt?.params,
      }),
      username
    );
  }
}

export class ChatMessageBody implements JsonCodec {
  type: ChatMessageBodyType;

  constructor(type: ChatMessageBodyType) {
    this.type = type;
  }

  // static fromJson(json: Map<string, any>): ChatMessageBody {
  //   let type = ChatMessageBodyTypeFromString(json.get('type') as string);
  //   return new ChatMessageBody(type);
  // }
  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('type', this.type);
    return r;
  }
}

export class ChatTextMessageBody extends ChatMessageBody implements JsonCodec {
  content: string;
  constructor(params: { content: string }) {
    super(ChatMessageBodyType.TXT);
    this.content = params.content;
  }
  static fromJson(json: Map<string, any>): ChatTextMessageBody {
    let content = json.get('content');
    return new ChatTextMessageBody({ content: content });
  }
  toJson(): Map<string, any> {
    let r = super.toJson();
    r.set('content', this.content);
    return r;
  }
}

export class ChatLocationMessageBody
  extends ChatMessageBody
  implements JsonCodec
{
  address: string;
  latitude: string;
  longitude: string;
  constructor(params: {
    address: string;
    latitude: string;
    longitude: string;
  }) {
    super(ChatMessageBodyType.LOCATION);
    this.address = params.address;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
  }
  static fromJson(json: Map<string, any>): ChatLocationMessageBody {
    let address = json.get('address');
    let latitude = json.get('latitude');
    let longitude = json.get('longitude');
    return new ChatLocationMessageBody({ address, latitude, longitude });
  }
  toJson(): Map<string, any> {
    let r = super.toJson();
    r.set('address', this.address);
    r.set('latitude', this.latitude);
    r.set('longitude', this.longitude);
    return r;
  }
}

export class ChatFileMessageBody extends ChatMessageBody implements JsonCodec {
  localPath: string = '';
  secret: string;
  remotePath: string;
  fileStatus: ChatDownloadStatus;
  fileSize: number;
  displayName: string;
  constructor(params: {
    type?: ChatMessageBodyType;
    localPath: string;
    secret?: string;
    remotePath?: string;
    fileStatus?: ChatDownloadStatus;
    fileSize?: number;
    displayName: string;
  }) {
    params.type ? super(params.type) : super(ChatMessageBodyType.FILE);
    this.localPath = params.localPath;
    this.secret = params.secret ?? '';
    this.remotePath = params.remotePath ?? '';
    this.fileStatus = params.fileStatus ?? ChatDownloadStatus.PENDING;
    this.fileSize = params.fileSize ?? 0;
    this.displayName = params.displayName;
  }
  static fromJson(json: Map<string, any>): ChatFileMessageBody {
    let localPath = json.get('localPath');
    let secret = json.get('secret');
    let remotePath = json.get('remotePath');
    let fileStatus = ChatDownloadStatusFromNumber(json.get('fileStatus'));
    let fileSize = json.get('fileSize');
    let displayName = json.get('displayName');
    return new ChatFileMessageBody({
      localPath,
      secret,
      remotePath,
      fileStatus,
      fileSize,
      displayName,
    });
  }
  toJson(): Map<string, any> {
    let r = super.toJson();
    r.set('localPath', this.localPath);
    r.set('secret', this.secret);
    r.set('remotePath', this.remotePath);
    r.set('fileStatus', this.fileStatus as number);
    r.set('fileSize', this.fileSize);
    r.set('displayName', this.displayName);
    return r;
  }
}

export class ChatImageMessageBody
  extends ChatFileMessageBody
  implements JsonCodec
{
  sendOriginalImage: boolean;
  thumbnailLocalPath: string;
  thumbnailRemotePath: string;
  thumbnailSecret: string;
  thumbnailStatus: ChatDownloadStatus;
  width: number;
  height: number;
  constructor(params: {
    localPath: string;
    secret?: string;
    remotePath?: string;
    fileStatus?: ChatDownloadStatus;
    fileSize?: number;
    displayName: string;
    sendOriginalImage?: boolean;
    thumbnailLocalPath?: string;
    thumbnailRemotePath?: string;
    thumbnailSecret?: string;
    thumbnailStatus?: ChatDownloadStatus;
    width?: number;
    height?: number;
  }) {
    super({
      type: ChatMessageBodyType.IMAGE,
      localPath: params.localPath,
      secret: params.secret,
      remotePath: params.remotePath,
      fileStatus: params.fileStatus,
      fileSize: params.fileSize,
      displayName: params.displayName,
    });
    this.sendOriginalImage = params.sendOriginalImage ?? false;
    this.thumbnailLocalPath = params.thumbnailLocalPath ?? '';
    this.thumbnailRemotePath = params.thumbnailRemotePath ?? '';
    this.thumbnailSecret = params.thumbnailSecret ?? '';
    this.thumbnailStatus = params.thumbnailStatus ?? ChatDownloadStatus.PENDING;
    this.width = params.width ?? 0;
    this.height = params.height ?? 0;
  }
  static fromJson(json: Map<string, any>): ChatImageMessageBody {
    let localPath = json.get('localPath');
    let secret = json.get('secret');
    let remotePath = json.get('remotePath');
    let fileStatus = ChatDownloadStatusFromNumber(json.get('fileStatus'));
    let fileSize = json.get('fileSize');
    let displayName = json.get('displayName');
    let sendOriginalImage = json.get('sendOriginalImage');
    let thumbnailLocalPath = json.get('thumbnailLocalPath');
    let thumbnailRemotePath = json.get('thumbnailRemotePath');
    let thumbnailSecret = json.get('thumbnailSecret');
    let thumbnailStatus = json.get('thumbnailStatus');
    let width = json.get('width') as number;
    let height = json.get('height') as number;
    return new ChatImageMessageBody({
      localPath,
      secret,
      remotePath,
      fileStatus,
      fileSize,
      displayName,
      sendOriginalImage,
      thumbnailLocalPath,
      thumbnailRemotePath,
      thumbnailSecret,
      thumbnailStatus,
      width,
      height,
    });
  }
  toJson(): Map<string, any> {
    let r = super.toJson();
    r.set('sendOriginalImage', this.sendOriginalImage);
    r.set('thumbnailLocalPath', this.thumbnailLocalPath);
    r.set('thumbnailRemotePath', this.thumbnailRemotePath);
    r.set('thumbnailSecret', this.thumbnailSecret);
    r.set('thumbnailStatus', this.thumbnailStatus);
    r.set('width', this.width as number);
    r.set('height', this.height as number);
    return r;
  }
}

export class ChatVideoMessageBody
  extends ChatFileMessageBody
  implements JsonCodec
{
  duration: number;
  thumbnailLocalPath: string;
  thumbnailRemotePath: string;
  thumbnailSecret: string;
  thumbnailStatus: ChatDownloadStatus;
  width: number;
  height: number;
  constructor(params: {
    localPath: string;
    secret?: string;
    remotePath?: string;
    fileStatus?: ChatDownloadStatus;
    fileSize?: number;
    displayName: string;
    duration?: number;
    thumbnailLocalPath?: string;
    thumbnailRemotePath?: string;
    thumbnailSecret?: string;
    thumbnailStatus?: ChatDownloadStatus;
    width?: number;
    height?: number;
  }) {
    super({
      type: ChatMessageBodyType.VIDEO,
      localPath: params.localPath,
      secret: params.secret,
      remotePath: params.remotePath,
      fileStatus: params.fileStatus,
      fileSize: params.fileSize,
      displayName: params.displayName,
    });
    this.duration = params.duration ?? 0;
    this.thumbnailLocalPath = params.thumbnailLocalPath ?? '';
    this.thumbnailRemotePath = params.thumbnailRemotePath ?? '';
    this.thumbnailSecret = params.thumbnailSecret ?? '';
    this.thumbnailStatus = params.thumbnailStatus ?? ChatDownloadStatus.PENDING;
    this.width = params.width ?? 0;
    this.height = params.height ?? 0;
  }
  static fromJson(json: Map<string, any>): ChatVideoMessageBody {
    let localPath = json.get('localPath');
    let secret = json.get('secret');
    let remotePath = json.get('remotePath');
    let fileStatus = ChatDownloadStatusFromNumber(json.get('fileStatus'));
    let fileSize = json.get('fileSize');
    let displayName = json.get('displayName');
    let duration = json.get('duration') as number;
    let thumbnailLocalPath = json.get('thumbnailLocalPath');
    let thumbnailRemotePath = json.get('thumbnailRemotePath');
    let thumbnailSecret = json.get('thumbnailSecret');
    let thumbnailStatus = json.get('thumbnailStatus');
    let width = json.get('width') as number;
    let height = json.get('height') as number;
    return new ChatVideoMessageBody({
      localPath,
      secret,
      remotePath,
      fileStatus,
      fileSize,
      displayName,
      duration,
      thumbnailLocalPath,
      thumbnailRemotePath,
      thumbnailSecret,
      thumbnailStatus,
      width,
      height,
    });
  }
  toJson(): Map<string, any> {
    let r = super.toJson();
    r.set('duration', this.duration);
    r.set('thumbnailLocalPath', this.thumbnailLocalPath);
    r.set('thumbnailRemotePath', this.thumbnailRemotePath);
    r.set('thumbnailSecret', this.thumbnailSecret);
    r.set('thumbnailStatus', this.thumbnailStatus);
    r.set('width', this.width as number);
    r.set('height', this.height as number);
    return r;
  }
}

export class ChatVoiceMessageBody
  extends ChatFileMessageBody
  implements JsonCodec
{
  duration: number;
  constructor(params: {
    localPath: string;
    secret?: string;
    remotePath?: string;
    fileStatus?: ChatDownloadStatus;
    fileSize?: number;
    displayName: string;
    duration?: number;
  }) {
    super({
      type: ChatMessageBodyType.VOICE,
      localPath: params.localPath,
      secret: params.secret,
      remotePath: params.remotePath,
      fileStatus: params.fileStatus,
      fileSize: params.fileSize,
      displayName: params.displayName,
    });
    this.duration = params.duration ?? 0;
  }
  static fromJson(json: Map<string, any>): ChatVoiceMessageBody {
    let localPath = json.get('localPath');
    let secret = json.get('secret');
    let remotePath = json.get('remotePath');
    let fileStatus = ChatDownloadStatusFromNumber(json.get('fileStatus'));
    let fileSize = json.get('fileSize');
    let displayName = json.get('displayName');
    let duration = json.get('duration') as number;
    return new ChatVoiceMessageBody({
      localPath,
      secret,
      remotePath,
      fileStatus,
      fileSize,
      displayName,
      duration,
    });
  }
  toJson(): Map<string, any> {
    let r = super.toJson();
    r.set('duration', this.duration);
    return r;
  }
}

export class ChatCmdMessageBody extends ChatMessageBody implements JsonCodec {
  action: string;
  deliverOnlineOnly: boolean;
  constructor(params: { action: string; deliverOnlineOnly?: boolean }) {
    super(ChatMessageBodyType.CMD);
    this.action = params.action;
    this.deliverOnlineOnly = params.deliverOnlineOnly ?? false;
  }
  static fromJson(json: Map<string, any>): ChatCmdMessageBody {
    let action = json.get('action');
    let deliverOnlineOnly = json.get('deliverOnlineOnly') as boolean;
    return new ChatCmdMessageBody({ action, deliverOnlineOnly });
  }
  toJson(): Map<string, any> {
    let r = super.toJson();
    r.set('action', this.action);
    r.set('deliverOnlineOnly', this.deliverOnlineOnly as boolean);
    return r;
  }
}

export class ChatCustomMessageBody
  extends ChatMessageBody
  implements JsonCodec
{
  event: string;
  params: Map<string, any>;
  constructor(params: { event: string; params?: Map<string, any> }) {
    super(ChatMessageBodyType.CUSTOM);
    this.event = params.event;
    this.params = params.params ?? new Map<string, any>();
  }
  static fromJson(json: Map<string, any>): ChatCustomMessageBody {
    let event = json.get('event');
    let params = json.get('params') as Map<string, any>;
    return new ChatCustomMessageBody({ event, params });
  }
  toJson(): Map<string, any> {
    let r = super.toJson();
    r.set('event', this.event);
    // https://www.cloudhadoop.com/2018/09/typescript-how-to-convert-map-tofrom.html
    r.set('params', Object.fromEntries(this.params));
    return r;
  }
}
