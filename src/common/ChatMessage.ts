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

export function ChatMessageBodyTypeFromNumber(
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
  onProgress(progress: number) :void

  /// 消息发送失败
  onError( error: ChatError) :void

  /// 消息发送成功
  onSuccess() :void

  /// 消息已读
  onReadAck() :void

  /// 消息已送达
  onDeliveryAck() :void

  /// 消息状态发生改变
  onStatusChanged() :void
}

class MessageCallBackManager {
  constructor() {
    this.cacheMessageMap = new Map<number, ChatMessage>();
  }

  cacheMessageMap: Map<number, ChatMessage>;

  setHandler() {
    //todo: 接收native消息
  }

  addMessage(message: ChatMessage) {
    this.cacheMessageMap.set(message.localTime, message);
  }
  delMessage(key: number) {
    this.cacheMessageMap.delete(key);
  }

}


class ChatMessage implements JsonCodec {
  msgId:string;
  convId: string;
  from:string;
  to:string;
  localTime: number;
  serverTime: number;
  hasDeliverAck: boolean;
  hasReadAck: boolean;
  needGroupAck: boolean;
  groupAckCount: number;
  hasRead: boolean;
  chatType: ChatMessageChatType;
  direction: ChatMessageDirection;
  status: ChatMessageStatus;
  attributes: Map<string,any>;
  body: ChatMessageBody;


  constructor(msgId:string,
    convId: string,
    from:string,
    to:string,
    localTime: number,
    serverTime: number,
    hasDeliverAck: boolean,
    hasReadAck: boolean,
    needGroupAck: boolean,
    groupAckCount: number,
    hasRead: boolean,
    chatType: ChatMessageChatType,
    direction: ChatMessageDirection,
    status: ChatMessageStatus,
    attributes: Map<string,any>,
    body: ChatMessageBody,) {
      this.msgId =msgId;
      this.convId = convId;
      this.from = from;
      this.to = to;
      this.localTime = localTime;
      this.serverTime = serverTime;
      this.hasDeliverAck = hasDeliverAck;
      this.hasReadAck = hasReadAck;
      this.needGroupAck = needGroupAck;
      this.groupAckCount = groupAckCount;
      this.hasRead = hasRead;
      this.chatType = chatType;
      this.direction = direction;
      this.status = status;
      this.attributes = attributes;
      this.body = body;
  }

  static fromJson(json: Map<string, any>): ChatMessage {
    throw new Error('You need a subclass implementation.');
  }

  toJson(): Map<string, any> {
    throw new Error('Method not implemented.');
  }
}

class ChatMessageBody {
  constructor() {

  }
}
