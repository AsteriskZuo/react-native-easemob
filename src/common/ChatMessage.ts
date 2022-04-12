import type { NativeEventEmitter } from 'react-native';
import {
  MethodTypeonMessageDeliveryAck,
  MethodTypeonMessageError,
  MethodTypeonMessageProgressUpdate,
  MethodTypeonMessageReadAck,
  MethodTypeonMessageStatusChanged,
  MethodTypeonMessageSuccess,
} from '../_internal/Consts';
import { generateMessageId, getNowTimestamp } from '../_internal/Utils';
import type { JsonCodec } from '../_internal/Defines';
import { ChatError } from './ChatError';
import { ChatClient } from '../ChatClient';

/**
 * The conversation types.
 */
export enum ChatMessageChatType {
  /**
   * One-to-one chat.
   */
  PeerChat = 0,
  /**
   * Group chat.
   */
  GroupChat = 1,
  /**
   * Chat room.
   */
  ChatRoom = 2,
}

/**
 * The enumeration of the message MessageDirection.
 */
export enum ChatMessageDirection {
  /**
   * This message is sent from the local client.
   */
  SEND,
  /**
   * The message is received by the local client.
   */
  RECEIVE,
}

/**
 * The enumeration of the message sending/reception status.
 *
 * The states include success, failure, being sent/being received, and created to be sent.
 */
export enum ChatMessageStatus {
  /**
   * The message is created to be sent.
   */
  CREATE = 0,
  /**
   * The message is being delivered/receiving.
   */
  PROGRESS = 1,
  /**
   * The message is successfully delivered/received.
   */
  SUCCESS = 2,
  /**
   * The message fails to be delivered/received.
   */
  FAIL = 3,
}

/**
 * The download status of the attachment file .
 */
export enum ChatDownloadStatus {
  /**
   * File message download is pending.
   */
  PENDING = -1,
  /**
   * The SDK is downloading the file message.
   */
  DOWNLOADING = 0,
  /**
   * The SDK successfully downloads the file message.
   */
  SUCCESS = 1,
  /**
   * The SDK fails to download the file message.
   */
  FAILED = 2,
}

/**
 * The enumeration of the message type.
 */
export enum ChatMessageBodyType {
  /**
   * Text message.
   */
  TXT = 'txt',
  /**
   * Image message.
   */
  IMAGE = 'img',
  /**
   * Video message.
   */
  VIDEO = 'video',
  /**
   * Location message.
   */
  LOCATION = 'loc',
  /**
   * Voice message.
   */
  VOICE = 'voice',
  /**
   * File message.
   */
  FILE = 'file',
  /**
   * Command message.
   */
  CMD = 'cmd',
  /**
   * Customized message.
   */
  CUSTOM = 'custom',
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

/**
 * Message status listener.
 */
export interface ChatMessageStatusCallback {
  /**
   * The progress of sending or receiving messages.
   *
   * @param progress Progress of the value.
   */
  onProgress(progress: number): void;

  /**
   * Error message sending or receiving.
   *
   * @param error Error, see {@link ChatError}
   */
  onError(error: ChatError): void;

  /**
   * The message is sent or received.
   */
  onSuccess(): void;

  /**
   * Message read.
   */
  onReadAck(): void;

  /**
   * The message has arrived.
   */
  onDeliveryAck(): void;

  /**
   * The message status changed. Procedure
   *
   * @param status Message status.
   */
  onStatusChanged(status: ChatMessageStatus): void;
}

/**
 * Message listener manager for internal use only.
 */
export class MessageCallBackManager {
  private static TAG = 'MessageCallBackManager';
  private static instance: MessageCallBackManager;
  public static getInstance(): MessageCallBackManager {
    if (
      MessageCallBackManager.instance == null ||
      MessageCallBackManager.instance === undefined
    ) {
      MessageCallBackManager.instance = new MessageCallBackManager();
    }
    return MessageCallBackManager.instance;
  }

  constructor() {
    this.cacheMessageMap = new Map<number, ChatMessage>();
  }

  cacheMessageMap: Map<number, ChatMessage>;

  setNativeListener(eventEmitter: NativeEventEmitter): void {
    eventEmitter.removeAllListeners(MethodTypeonMessageProgressUpdate);
    eventEmitter.addListener(
      MethodTypeonMessageProgressUpdate,
      this.onMessageProgressUpdate.bind(this)
    );
    eventEmitter.removeAllListeners(MethodTypeonMessageError);
    eventEmitter.addListener(
      MethodTypeonMessageError,
      this.onMessageError.bind(this)
    );
    eventEmitter.removeAllListeners(MethodTypeonMessageSuccess);
    eventEmitter.addListener(
      MethodTypeonMessageSuccess,
      this.onMessageSuccess.bind(this)
    );
    eventEmitter.removeAllListeners(MethodTypeonMessageReadAck);
    eventEmitter.addListener(
      MethodTypeonMessageReadAck,
      this.onMessageReadAck.bind(this)
    );
    eventEmitter.removeAllListeners(MethodTypeonMessageDeliveryAck);
    eventEmitter.addListener(
      MethodTypeonMessageDeliveryAck,
      this.onMessageDeliveryAck.bind(this)
    );
    eventEmitter.removeAllListeners(MethodTypeonMessageStatusChanged);
    eventEmitter.addListener(
      MethodTypeonMessageStatusChanged,
      this.onMessageStatusChanged.bind(this)
    );
  }

  private onMessageProgressUpdate(params: any): void {
    this.findMessage(params?.localTime)?.onProgressFromNative(params);
  }
  private onMessageError(params: any): void {
    this.findMessage(params?.localTime)?.onErrorFromNative(params);
  }
  private onMessageSuccess(params: any): void {
    this.findMessage(params?.localTime)?.onSuccessFromNative(params);
  }
  private onMessageReadAck(params: any): void {
    this.findMessage(params?.localTime)?.onReadAckFromNative(params);
  }
  private onMessageDeliveryAck(params: any): void {
    this.findMessage(params?.localTime)?.onDeliveryAckFromNative(params);
  }
  private onMessageStatusChanged(params: any): void {
    this.findMessage(params?.localTime)?.onStatusChangedFromNative(params);
  }

  public addMessage(message: ChatMessage): void {
    this.cacheMessageMap.set(message.localTime, message);
  }
  public delMessage(key: number): void {
    this.cacheMessageMap.delete(key);
  }

  private findMessage(key: number): ChatMessage | undefined {
    return this.cacheMessageMap.get(key);
  }
}

/**
 * The message instance, which represents a sent/received message.
 *
 * For example:
 *
 * Constructs a text message to send:
 *
 * ```typescript
 *   let msg = ChatMessage.createTextMessage(
 *         'asteriskhx2',
 *         Date.now().toString(),
 *         ChatMessageChatType.PeerChat
 *       );
 * ```
 */
export class ChatMessage implements JsonCodec {
  static TAG = 'ChatMessage';
  /**
   * Gets the message ID.
   */
  msgId: string = generateMessageId();
  /**
   * The conversation ID.
   */
  conversationId: string = '';
  /**
   * The user ID of the message sender.
   */
  from: string = '';
  /**
   * The user ID of the message recipient.
   */
  to: string = '';
  /**
   * The local timestamp of the message.
   */
  localTime: number = getNowTimestamp();
  /**
   * The server timestamp of the message.
   */
  serverTime: number = getNowTimestamp();
  /**
   * The delivery receipt, which is to check whether the other party has received the message.
   *
   * Whether the other party has received the message.
   * `true`:the message has been delivered to the other party.
   */
  hasDeliverAck: boolean = false;
  /**
   * Whether the message has been read.
   *
   * Whether the other party has read the message.
   * `true`: The message has been read by the other party.
   */
  hasReadAck: boolean = false;
  /**
   * Sets whether read receipts are required for group messages.
   *
   * `true`: Read receipts are required;
   * `false`: Read receipts are NOT required.
   */
  needGroupAck: boolean = false;
  /**
   * Gets the number of members that have read the group message.
   */
  groupAckCount: number = 0;
  /**
   * Checks whether the message is read.
   *
   * `true`: The message is read.
   * `false`: The message is unread.
   */
  hasRead: boolean = false;
  /**
   * The enumeration of the chat type.
   *
   * There are three chat types: one-to-one chat, group chat, and chat room.
   */
  chatType: ChatMessageChatType = ChatMessageChatType.ChatRoom;
  /**
   * The message direction. see {@link ChatMessageDirection}
   */
  direction: ChatMessageDirection = ChatMessageDirection.SEND;
  /**
   * Gets the message sending/reception status. see {@link ChatMessageStatus}
   */
  status: ChatMessageStatus = ChatMessageStatus.CREATE;
  /**
   * Message's extension attribute.
   */
  attributes: Map<string, any> = new Map<string, any>();
  /**
   * Message body. We recommend you use {@link ChatMessageBody)}.
   */
  body: ChatMessageBody;

  public constructor(params: {
    msgId?: string;
    conversationId?: string;
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
    this.conversationId = params.conversationId ?? '';
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

  public static fromJson(json: Map<string, any>): ChatMessage {
    let msgId = json.get('msgId');
    let conversationId = json.get('conversationId');
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
    let attributes = json.get('attributes') as Map<string, any>;
    let body = ChatMessage.getBody(json.get('body') as Map<string, any>);
    // let s = new ChatMessage({msgId: msgId, body: body});
    return new ChatMessage({
      msgId: msgId,
      conversationId: conversationId,
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

  public toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('from', this.from);
    r.set('to', this.to);
    r.set('body', this.body.toJson());
    r.set('attributes', this.attributes);
    r.set('direction', this.direction);
    r.set('hasRead', this.hasRead);
    r.set('hasReadAck', this.hasReadAck);
    r.set('hasDeliverAck', this.hasDeliverAck);
    r.set('needGroupAck', this.needGroupAck);
    r.set('groupAckCount', this.groupAckCount);
    r.set('msgId', this.msgId);
    r.set('conversationId', this.conversationId);
    r.set('chatType', this.chatType as number);
    r.set('localTime', this.localTime);
    r.set('serverTime', this.serverTime);
    r.set('status', this.status as number);
    return r;
  }

  private static getBody(json: Map<string, any>): ChatMessageBody {
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

  private callback?: ChatMessageStatusCallback;

  /**
   * Set up a message listener to listen for message status changes. If this parameter is not set, message changes cannot be received.
   *
   * @param callback The listener. see {@link ChatMessageStatusCallback}
   */
  public setMessageCallback(callback: ChatMessageStatusCallback): void {
    this.callback = callback;
    if (this.callback) {
      MessageCallBackManager.getInstance().addMessage(this);
    } else {
      MessageCallBackManager.getInstance().delMessage(this.localTime);
    }
  }

  public onProgressFromNative(params: any): void {
    let progress = params?.progress as number;
    console.log(
      `${ChatMessage.TAG}: onProgressFromNative: ${this.msgId}, ${this.localTime}, ${progress}`
    );
    this.callback?.onProgress(progress);
  }

  public onErrorFromNative(params: any): void {
    console.log(
      `${ChatMessage.TAG}: onErrorFromNative: old: ${this.msgId}, ${this.localTime}`
    );
    let error = ChatError.fromJson(params?.error);
    let nmsg = ChatMessage.fromJson(params?.message);
    console.log(
      `${ChatMessage.TAG}: onErrorFromNative: new: ${nmsg.msgId}, ${nmsg.serverTime}, ${nmsg.status}, ${error}`
    );
    this.msgId = nmsg.msgId;
    this.status = nmsg.status;
    this.body = nmsg.body;
    this.callback?.onError(error);
  }

  public onSuccessFromNative(params: any): void {
    console.log(
      `${ChatMessage.TAG}: onSuccessFromNative: old: ${this.msgId}, ${this.localTime}`
    );
    let nmsg: ChatMessage = params?.message;
    console.log(
      `${ChatMessage.TAG}: onSuccessFromNative: new: ${nmsg.msgId}, ${nmsg.serverTime}, ${nmsg.status}`
    );
    // this.msgId = nmsg.msgId;
    // this.status = nmsg.status;
    // this.body = nmsg.body;
    this.callback?.onSuccess();
  }

  public onReadAckFromNative(params: any): void {
    console.log(
      `${ChatMessage.TAG}: onReadAckFromNative: old: ${this.msgId}, ${this.localTime}`
    );
    let nmsg: ChatMessage = params;
    console.log(
      `${ChatMessage.TAG}: onReadAckFromNative: new: ${nmsg.msgId}, ${nmsg.serverTime}, ${nmsg.status}, ${nmsg.hasReadAck}`
    );
    this.hasReadAck = nmsg.hasReadAck;
    this.callback?.onReadAck();
  }

  public onDeliveryAckFromNative(params: any): void {
    console.log(
      `${ChatMessage.TAG}: onDeliveryAckFromNative: old: ${this.msgId}, ${this.localTime}`
    );
    let nmsg: ChatMessage = params;
    console.log(
      `${ChatMessage.TAG}: onDeliveryAckFromNative: new: ${nmsg.msgId}, ${nmsg.serverTime}, ${nmsg.status}, ${nmsg.hasDeliverAck}`
    );
    this.hasDeliverAck = nmsg.hasDeliverAck;
    this.callback?.onDeliveryAck();
  }

  public onStatusChangedFromNative(params: any): void {
    console.log(
      `${ChatMessage.TAG}: onStatusChangedFromNative: old: ${this.msgId}, ${this.localTime}`
    );
    let nmsg: ChatMessage = params;
    console.log(
      `${ChatMessage.TAG}: onStatusChangedFromNative: new: ${nmsg.msgId}, ${nmsg.serverTime}, ${nmsg.status}`
    );
    this.status = nmsg.status;
    this.callback?.onStatusChanged(this.status);
  }

  private static createSendMessage(
    body: ChatMessageBody,
    to: string,
    chatType: ChatMessageChatType
  ): ChatMessage {
    let r = new ChatMessage({
      from: ChatClient.getInstance().currentUserName ?? '',
      body: body,
      direction: ChatMessageDirection.SEND,
      to: to,
      hasRead: true,
      chatType: chatType,
    });
    return r;
  }

  /**
   * Creates a text message for sending.
   *
   * @param username The ID of the message recipient(user or group).
   * @param content The text content.
   * @param chatType The Conversation type.
   * @returns The message instance.
   */
  public static createTextMessage(
    username: string,
    content: string,
    chatType: ChatMessageChatType = ChatMessageChatType.PeerChat
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatTextMessageBody({ content: content }),
      username,
      chatType
    );
  }

  /**
   * Creates a file message for sending.
   *
   * @param username The ID of the message recipient(user or group).
   * @param filePath The file path.
   * @param chatType The Conversation type.
   * @param opt The file name. like 'readme.doc'
   * @returns The message instance.
   */
  public static createFileMessage(
    username: string,
    filePath: string,
    chatType: ChatMessageChatType = ChatMessageChatType.PeerChat,
    opt?: {
      displayName: string;
    }
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatFileMessageBody({
        localPath: filePath,
        displayName: opt?.displayName ?? '',
      }),
      username,
      chatType
    );
  }

  /**
   *  Creates a image message for sending.
   *
   * @param username The ID of the message recipient(user or group).
   * @param filePath The image path.
   * @param chatType The Conversation type.
   * @param opt
   *   @{#displayName} The image name. like 'image.jpeg'
   *   @{#thumbnailLocalPath} The image thumbnail path.
   *   @{#sendOriginalImage} Whether to send the original image.
   *     `true`: Send the original image.
   *     `false`: (default) For an image greater than 100 KB, the SDK will compress it.
   *   @{#width} The image width.
   *   @{#height} The image height.
   * @returns The message instance.
   */
  public static createImageMessage(
    username: string,
    filePath: string,
    chatType: ChatMessageChatType = ChatMessageChatType.PeerChat,
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
      username,
      chatType
    );
  }

  /**
   * Creates a video message for sending.
   *
   * @param username The ID of the message recipient(user or group).
   * @param filePath The path of the video file.
   * @param chatType The Conversation type.
   * @param opt
   *   @{#displayName} The video name. like 'video.mp4'
   *   @{#thumbnailLocalPath} The path of the thumbnail of the first frame of video.
   *   @{#duration} The video duration in seconds.
   *   @{#width} The video thumbnail image width.
   *   @{#height} The video thumbnail image height.
   * @returns The message instance.
   */
  public static createVideoMessage(
    username: string,
    filePath: string,
    chatType: ChatMessageChatType = ChatMessageChatType.PeerChat,
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
      username,
      chatType
    );
  }

  /**
   * Creates a video message for sending.
   *
   * @param username The ID of the message recipient(user or group).
   * @param filePath The path of the voice file.
   * @param chatType The Conversation type.
   * @param opt
   *   @{#displayName} The voice name. like 'voice.mp3'
   *   @{#duration} The voice duration in seconds.
   * @returns The message instance.
   */
  public static createVoiceMessage(
    username: string,
    filePath: string,
    chatType: ChatMessageChatType = ChatMessageChatType.PeerChat,
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
      username,
      chatType
    );
  }

  /**
   * Creates a location message for sending.
   *
   * @param username The ID of the message recipient(user or group).
   * @param latitude The latitude.
   * @param longitude The longitude.
   * @param chatType The Conversation type.
   * @param opt
   *   @{#address} Place names. like `beijing`.
   * @returns The message instance.
   */
  public static createLocationMessage(
    username: string,
    latitude: string,
    longitude: string,
    chatType: ChatMessageChatType = ChatMessageChatType.PeerChat,
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
      username,
      chatType
    );
  }

  /**
   * Creates a cmd message for sending.
   *
   * @param username The ID of the message recipient(user or group).
   * @param action Action behavior.
   * @param chatType The Conversation type.
   * @returns The message instance.
   */
  public static createCmdMessage(
    username: string,
    action: string,
    chatType: ChatMessageChatType = ChatMessageChatType.PeerChat
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatCmdMessageBody({
        action: action,
      }),
      username,
      chatType
    );
  }

  /**
   * Creates a custom message for sending.
   *
   * @param username The ID of the message recipient(user or group).
   * @param event
   * @param chatType The Conversation type.
   * @param opt
   *   @{#params} Custom parameters. Key/value pair. It can be nested.
   * @returns The message instance.
   */
  public static createCustomMessage(
    username: string,
    event: string,
    chatType: ChatMessageChatType = ChatMessageChatType.PeerChat,
    opt?: {
      params: Map<string, any>;
    }
  ): ChatMessage {
    return ChatMessage.createSendMessage(
      new ChatCustomMessageBody({
        event: event,
        params: opt?.params,
      }),
      username,
      chatType
    );
  }
}

/**
 * The content part of the message.
 *
 * The base class for the concrete message type.
 */
export class ChatMessageBody implements JsonCodec {
  /**
   * Message type. see {@link ChatMessageBodyType}
   */
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

/**
 * Text message body.
 */
export class ChatTextMessageBody extends ChatMessageBody implements JsonCodec {
  /**
   * Text message content.
   */
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

/**
 * The location message body.
 */
export class ChatLocationMessageBody
  extends ChatMessageBody
  implements JsonCodec
{
  /**
   * The address.
   */
  address: string;
  /**
   * The latitude.
   */
  latitude: string;
  /**
   * The longitude.
   */
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

/**
 * File message body.
 */
export class ChatFileMessageBody extends ChatMessageBody implements JsonCodec {
  /**
   * The path of the image file.
   */
  localPath: string = '';
  /**
   * The file's token.
   */
  secret: string;
  /**
   * The path of the attachment file in the server.
   */
  remotePath: string;
  /**
   * The download status of the attachment file . see {@link ChatDownloadStatus}
   */
  fileStatus: ChatDownloadStatus;
  /**
   * The size of the file in bytes.
   */
  fileSize: number;
  /**
   * The file name. like "file.doc"
   */
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

/**
 * The image message body class.
 */
export class ChatImageMessageBody
  extends ChatFileMessageBody
  implements JsonCodec
{
  /**
   * Sets whether to send the original image when sending an image.
   *
   * false`: (default) Send the thumbnail(image with size larger than 100k will be compressed);
   * `true`: Send the original image.
   */
  sendOriginalImage: boolean;
  /**
   * The local path or the URI of the thumbnail as a string.
   */
  thumbnailLocalPath: string;
  /**
   * The URL of the thumbnail on the server.
   */
  thumbnailRemotePath: string;
  /**
   * The secret to access the thumbnail. A secret is required for verification for thumbnail download.
   */
  thumbnailSecret: string;
  /**
   * The download status of the thumbnail. see {@link ChatDownloadStatus}
   */
  thumbnailStatus: ChatDownloadStatus;
  /**
   * The image width.
   */
  width: number;
  /**
   * The image height.
   */
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

/**
 * The video message body.
 */
export class ChatVideoMessageBody
  extends ChatFileMessageBody
  implements JsonCodec
{
  /**
   * The video duration in seconds.
   */
  duration: number;
  /**
   * The local path of the video thumbnail.
   */
  thumbnailLocalPath: string;
  /**
   * The URL of the thumbnail on the server.
   */
  thumbnailRemotePath: string;
  /**
   * The secret key of the video thumbnail.
   */
  thumbnailSecret: string;
  /**
   * The download status of the video thumbnail. see {@link ChatDownloadStatus}
   */
  thumbnailStatus: ChatDownloadStatus;
  /**
   * The video width.
   */
  width: number;
  /**
   * The video height.
   */
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

/**
 * The voice message body.
 */
export class ChatVoiceMessageBody
  extends ChatFileMessageBody
  implements JsonCodec
{
  /**
   * The voice duration in seconds.
   */
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

/**
 * The command message body.
 */
export class ChatCmdMessageBody extends ChatMessageBody implements JsonCodec {
  /**
   * The command action content.
   */
  action: string;
  /**
   * Checks whether this cmd message is only delivered to online users.
   *
   * `true`: Only delivers to online users.
   * `false`: Delivers to all users.
   */
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

/**
 * The custom message body.
 */
export class ChatCustomMessageBody
  extends ChatMessageBody
  implements JsonCodec
{
  /**
   * The event.
   */
  event: string;
  /**
   * The params map.
   */
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
