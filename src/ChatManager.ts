import type { SupportOptionRange } from 'prettier';
import type { NativeEventEmitter } from 'react-native';
import {
  ChatConversation,
  ChatConversationType,
} from './common/ChatConversation';
import { ChatCursorResult } from './common/ChatCursorResult';
import { ChatGroupMessageAck } from './common/ChatGroup';
import {
  ChatMessage,
  ChatMessageStatus,
  ChatMessageStatusCallback,
} from './common/ChatMessage';
import {
  MethodTypeackConversationRead,
  MethodTypeackGroupMessageRead,
  MethodTypeackMessageRead,
  MethodTypeasyncFetchGroupAcks,
  MethodTypedeleteConversation,
  MethodTypedownloadAttachment,
  MethodTypedownloadThumbnail,
  MethodTypefetchHistoryMessages,
  MethodTypegetConversation,
  MethodTypegetConversationsFromServer,
  MethodTypegetMessage,
  MethodTypegetUnreadMessageCount,
  MethodTypeimportMessages,
  MethodTypeloadAllConversations,
  MethodTypemarkAllChatMsgAsRead,
  MethodTypeonCmdMessagesReceived,
  MethodTypeonConversationHasRead,
  MethodTypeonConversationUpdate,
  MethodTypeonGroupMessageRead,
  MethodTypeonMessagesDelivered,
  MethodTypeonMessagesRead,
  MethodTypeonMessagesRecalled,
  MethodTypeonMessagesReceived,
  MethodTyperecallMessage,
  MethodTyperesendMessage,
  MethodTypesearchChatMsgFromDB,
  MethodTypesendMessage,
  MethodTypeupdateChatMessage,
} from './_internal/Consts';
import { Native } from './_internal/Native';

// 搜索方向
export enum ChatSearchDirection {
  UP,
  DOWN,
}

export interface ChatManagerListener {
  /// 收到消息[messages]
  onMessagesReceived(messages: Array<ChatMessage>): void;

  /// 收到cmd消息[messages]
  onCmdMessagesReceived(messages: Array<ChatMessage>): void;

  /// 收到[messages]消息已读
  onMessagesRead(messages: Array<ChatMessage>): void;

  /// 收到[groupMessageAcks]群消息已读回调
  onGroupMessageRead(groupMessageAcks: Array<ChatGroupMessageAck>): void;

  /// 收到[messages]消息已送达
  onMessagesDelivered(messages: Array<ChatMessage>): void;

  /// 收到[messages]消息被撤回
  onMessagesRecalled(messages: Array<ChatMessage>): void;

  /// 会话列表变化
  onConversationsUpdate(): void;

  /// 会话已读`from`是已读的发送方, `to`是已读的接收方
  onConversationRead(from: string, to?: string): void;
}

export class ChatManager extends Native {
  static TAG = 'ChatManager';

  _messageListeners: Set<ChatManagerListener>;

  constructor() {
    super();
    this._messageListeners = new Set<ChatManagerListener>();
  }

  public setMethodCallHandler(eventEmitter: NativeEventEmitter) {
    eventEmitter.removeAllListeners(MethodTypeonMessagesReceived);
    eventEmitter.addListener(
      MethodTypeonMessagesReceived,
      this.onMessagesReceived
    );
    eventEmitter.removeAllListeners(MethodTypeonCmdMessagesReceived);
    eventEmitter.addListener(
      MethodTypeonCmdMessagesReceived,
      this.onCmdMessagesReceived
    );
    eventEmitter.removeAllListeners(MethodTypeonMessagesRead);
    eventEmitter.addListener(MethodTypeonMessagesRead, this.onMessagesRead);
    eventEmitter.removeAllListeners(MethodTypeonGroupMessageRead);
    eventEmitter.addListener(
      MethodTypeonGroupMessageRead,
      this.onGroupMessageRead
    );
    eventEmitter.removeAllListeners(MethodTypeonMessagesDelivered);
    eventEmitter.addListener(
      MethodTypeonMessagesDelivered,
      this.onMessagesDelivered
    );
    eventEmitter.removeAllListeners(MethodTypeonMessagesRecalled);
    eventEmitter.addListener(
      MethodTypeonMessagesRecalled,
      this.onMessagesRecalled
    );
    eventEmitter.removeAllListeners(MethodTypeonConversationUpdate);
    eventEmitter.addListener(
      MethodTypeonConversationUpdate,
      this.onConversationsUpdate
    );
    eventEmitter.removeAllListeners(MethodTypeonConversationHasRead);
    eventEmitter.addListener(
      MethodTypeonConversationHasRead,
      this.onConversationHasRead
    );
  }

  private onMessagesReceived(messages: Array<ChatMessage>): void {
    console.log(`${ChatManager.TAG}: onMessagesReceived: ${messages}`);
  }
  private onCmdMessagesReceived(messages: Array<ChatMessage>): void {
    console.log(`${ChatManager.TAG}: onCmdMessagesReceived: ${messages}`);
  }
  private onMessagesRead(messages: Array<ChatMessage>): void {
    console.log(`${ChatManager.TAG}: onMessagesRead: ${messages}`);
  }
  private onGroupMessageRead(messages: Array<ChatMessage>): void {
    console.log(`${ChatManager.TAG}: onGroupMessageRead: ${messages}`);
  }
  private onMessagesDelivered(messages: Array<ChatMessage>): void {
    console.log(`${ChatManager.TAG}: onMessagesDelivered: ${messages}`);
  }
  private onMessagesRecalled(messages: Array<ChatMessage>): void {
    console.log(`${ChatManager.TAG}: onMessagesRecalled: ${messages}`);
  }
  private onConversationsUpdate(params: any): void {
    console.log(`${ChatManager.TAG}: onConversationsUpdate: ${params}`);
  }
  private onConversationHasRead(params: any): void {
    console.log(`${ChatManager.TAG}: onConversationHasRead: ${params}`);
  }

  public addListener(listener: ChatManagerListener): void {
    this._messageListeners.add(listener);
  }
  public delListener(listener: ChatManagerListener): void {
    this._messageListeners.delete(listener);
  }

  public async sendMessage(
    message: ChatMessage,
    callback: ChatMessageStatusCallback
  ): Promise<ChatMessage> {
    console.log(
      `${ChatManager.TAG}: sendMessage: ${message.msgId}, ${message.localTime}`
    );
    message.status = ChatMessageStatus.PROGRESS;
    message.setMessageCallback(callback);
    let r: Map<string, any> = await Native._callMethod(
      MethodTypesendMessage,
      message.toJson()
    );
    Native.hasErrorFromResult(r);
    let msg: ChatMessage = ChatMessage.fromJson(r.get(MethodTypesendMessage));
    message.from = msg.from;
    message.to = msg.to;
    message.status = msg.status;
    return message;
  }

  public async resendMessage(
    message: ChatMessage,
    callback: ChatMessageStatusCallback
  ): Promise<ChatMessage> {
    console.log(
      `${ChatManager.TAG}: resendMessage: ${message.msgId}, ${message.localTime}`
    );
    message.status = ChatMessageStatus.PROGRESS;
    message.setMessageCallback(callback);
    let r: Map<string, any> = await Native._callMethod(
      MethodTyperesendMessage,
      message.toJson()
    );
    Native.hasErrorFromResult(r);
    let msg: ChatMessage = ChatMessage.fromJson(r.get(MethodTypesendMessage));
    message.from = msg.from;
    message.to = msg.to;
    message.status = msg.status;
    return message;
  }

  public async sendMessageReadAck(message: ChatMessage): Promise<boolean> {
    console.log(
      `${ChatManager.TAG}: sendMessageReadAck: ${message.msgId}, ${message.localTime}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypeackMessageRead,
      {
        to: message.from,
        msg_id: message.msgId,
      }
    );
    Native.hasErrorFromResult(r);
    return r.get(MethodTypeackMessageRead) as boolean;
  }

  public async sendGroupMessageReadAck(
    msgId: string,
    groupId: string,
    opt?: { content: string }
  ): Promise<boolean> {
    console.log(
      `${ChatManager.TAG}: sendGroupMessageReadAck: ${msgId}, ${groupId}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypeackGroupMessageRead,
      opt?.content
        ? {
            msg_id: msgId,
            group_id: groupId,
            content: opt?.content,
          }
        : {
            msg_id: msgId,
            group_id: groupId,
          }
    );
    Native.hasErrorFromResult(r);
    return r.get(MethodTypeackGroupMessageRead) as boolean;
  }

  public async sendConversationReadAck(convId: string): Promise<boolean> {
    console.log(`${ChatManager.TAG}: sendConversationReadAck: ${convId}`);
    let r: Map<string, any> = await Native._callMethod(
      MethodTypeackConversationRead,
      { convId: convId }
    );
    Native.hasErrorFromResult(r);
    return r.get(MethodTypeackConversationRead) as boolean;
  }

  public async recallMessage(msgId: string): Promise<boolean> {
    console.log(`${ChatManager.TAG}: recallMessage: ${msgId}`);
    let r: Map<string, any> = await Native._callMethod(
      MethodTyperecallMessage,
      { msg_id: msgId }
    );
    Native.hasErrorFromResult(r);
    return r.get(MethodTyperecallMessage) as boolean;
  }

  public async getMessage(msgId: string): Promise<ChatMessage> {
    console.log(`${ChatManager.TAG}: getMessage: ${msgId}`);
    let r: Map<string, any> = await Native._callMethod(MethodTypegetMessage, {
      msg_id: msgId,
    });
    Native.hasErrorFromResult(r);
    return ChatMessage.fromJson(r.get(MethodTypegetMessage));
  }

  public async getConversation(
    convId: string,
    convType: ChatConversationType,
    createIfNeed: boolean = true
  ): Promise<ChatConversation> {
    console.log(
      `${ChatManager.TAG}: getConversation: ${convId}, ${convType}, ${createIfNeed}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypegetConversation,
      { con_id: convId, type: convType as number, createIfNeed: createIfNeed }
    );
    Native.hasErrorFromResult(r);
    return ChatConversation.fromJson(r.get(MethodTypegetConversation));
  }

  public async markAllConversationsAsRead(): Promise<boolean> {
    console.log(`${ChatManager.TAG}: markAllConversationsAsRead: `);
    let r: Map<string, any> = await Native._callMethod(
      MethodTypemarkAllChatMsgAsRead
    );
    Native.hasErrorFromResult(r);
    return r.get(MethodTypemarkAllChatMsgAsRead) as boolean;
  }

  public async getUnreadMessageCount(): Promise<number> {
    console.log(`${ChatManager.TAG}: getUnreadMessageCount: `);
    let r: Map<string, any> = await Native._callMethod(
      MethodTypegetUnreadMessageCount
    );
    Native.hasErrorFromResult(r);
    return r.get(MethodTypegetUnreadMessageCount) as number;
  }

  public async updateMessage(message: ChatMessage): Promise<ChatMessage> {
    console.log(
      `${ChatManager.TAG}: updateMessage: ${message.msgId}, ${message.localTime}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypeupdateChatMessage
    );
    Native.hasErrorFromResult(r);
    return ChatMessage.fromJson(r.get(MethodTypeupdateChatMessage));
  }

  public async importMessages(messages: Array<ChatMessage>): Promise<boolean> {
    console.log(`${ChatManager.TAG}: importMessages: ${messages.length}`);
    let params = new Array<any>();
    messages.forEach((element) => {
      params.push(element.toJson());
    });
    let r: Map<string, any> = await Native._callMethod(
      MethodTypeimportMessages,
      { messages: params }
    );
    Native.hasErrorFromResult(r);
    return r.get(MethodTypeimportMessages) as boolean;
  }

  public async downloadAttachment(message: ChatMessage): Promise<ChatMessage> {
    console.log(
      `${ChatManager.TAG}: downloadAttachment: ${message.msgId}, ${message.localTime}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypedownloadAttachment,
      {
        message: message.toJson(),
      }
    );
    Native.hasErrorFromResult(r);
    return ChatMessage.fromJson(r.get(MethodTypedownloadAttachment));
  }

  public async downloadThumbnail(message: ChatMessage): Promise<ChatMessage> {
    console.log(
      `${ChatManager.TAG}: downloadThumbnail: ${message.msgId}, ${message.localTime}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypedownloadThumbnail,
      {
        message: message.toJson(),
      }
    );
    Native.hasErrorFromResult(r);
    return ChatMessage.fromJson(r.get(MethodTypedownloadThumbnail));
  }

  public async loadAllConversations(): Promise<Array<ChatConversation>> {
    console.log(`${ChatManager.TAG}: loadAllConversations:`);
    let r: Map<string, any> = await Native._callMethod(
      MethodTypeloadAllConversations
    );
    Native.hasErrorFromResult(r);
    let ret = new Array<ChatConversation>();
    (r.get(MethodTypeloadAllConversations) as Array<Map<string, any>>).forEach(
      (element) => {
        ret.push(ChatConversation.fromJson(element));
      }
    );
    return ret;
  }

  public async getConversationsFromServer(): Promise<Array<ChatConversation>> {
    console.log(`${ChatManager.TAG}: getConversationsFromServer:`);
    let r: Map<string, any> = await Native._callMethod(
      MethodTypegetConversationsFromServer
    );
    Native.hasErrorFromResult(r);
    let ret = new Array<ChatConversation>();
    (r.get(MethodTypeloadAllConversations) as Array<Map<string, any>>).forEach(
      (element) => {
        ret.push(ChatConversation.fromJson(element));
      }
    );
    return ret;
  }

  public async deleteConversation(
    convId: string,
    withMessage: boolean = true
  ): Promise<boolean> {
    console.log(
      `${ChatManager.TAG}: deleteConversation: ${convId}, ${withMessage}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypedeleteConversation,
      { con_id: convId, deleteMessages: withMessage }
    );
    Native.hasErrorFromResult(r);
    return r.get(MethodTypedeleteConversation) as boolean;
  }

  public async fetchHistoryMessages(
    convId: string,
    chatType: ChatConversationType,
    pageSize: number = 20,
    startMsgId: string = ''
  ): Promise<ChatCursorResult<ChatMessage>> {
    console.log(
      `${ChatManager.TAG}: fetchHistoryMessages: ${convId}, ${chatType}, ${pageSize}, ${startMsgId}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypefetchHistoryMessages,
      {
        con_id: convId,
        type: chatType as number,
        pageSize: pageSize,
        startMsgId: startMsgId,
      }
    );
    Native.hasErrorFromResult(r);
    let ret = ChatCursorResult.fromJson(r.get(MethodTypefetchHistoryMessages), {
      map: (json: Map<string, any>) => {
        return ChatMessage.fromJson(json);
      },
    });
    return ret;
  }

  public async searchMsgFromDB(
    keywords: string,
    timestamp: number = -1,
    maxCount: number = 20,
    from: string = '',
    direction: ChatSearchDirection = ChatSearchDirection.UP
  ): Promise<Array<ChatMessage>> {
    console.log(
      `${ChatManager.TAG}: searchMsgFromDB: ${keywords}, ${timestamp}, ${maxCount}, ${from}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypesearchChatMsgFromDB,
      {
        keywords: keywords,
        timestamp: timestamp,
        maxCount: maxCount,
        from: from,
        direction: direction == ChatSearchDirection.UP ? 'up' : 'down',
      }
    );
    Native.hasErrorFromResult(r);
    let ret = new Array<ChatMessage>();
    (r.get(MethodTypesearchChatMsgFromDB) as Array<any>).forEach((element) => {
      ret.push(ChatMessage.fromJson(element));
    });
    return ret;
  }

  public async asyncFetchGroupAcks(
    msgId: string,
    startAckId?: string,
    pageSize: number = 0
  ): Promise<ChatCursorResult<ChatGroupMessageAck>> {
    console.log(
      `${ChatManager.TAG}: asyncFetchGroupAcks: ${msgId}, ${startAckId}, ${pageSize}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypeasyncFetchGroupAcks,
      {
        msg_id: msgId,
        ack_id: startAckId,
        pageSize: pageSize,
      }
    );
    Native.hasErrorFromResult(r);
    let ret = ChatCursorResult.fromJson(r.get(MethodTypeasyncFetchGroupAcks), {
      map: (json: Map<string, any>) => {
        return ChatGroupMessageAck.fromJson(json);
      },
    });
    return ret;
  }
}
