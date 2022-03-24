import type { NativeEventEmitter } from 'react-native';
import {
  ChatMessage,
  ChatMessageStatus,
  ChatMessageStatusListener,
} from './common/ChatMessage';
import {
  MethodTypeonCmdMessagesReceived,
  MethodTypeonConversationHasRead,
  MethodTypeonConversationUpdate,
  MethodTypeonGroupMessageRead,
  MethodTypeonMessagesDelivered,
  MethodTypeonMessagesRead,
  MethodTypeonMessagesRecalled,
  MethodTypeonMessagesReceived,
  MethodTypesendMessage,
} from './_internal/Consts';
import { Native } from './_internal/Native';

export class ChatManager extends Native {
  static TAG = 'ChatManager';
  constructor() {
    super();
  }

  public setMethodCallHandler(eventEmitter: NativeEventEmitter) {
    eventEmitter.addListener(
      MethodTypeonMessagesReceived,
      this.onMessagesReceived
    );
    eventEmitter.addListener(
      MethodTypeonCmdMessagesReceived,
      this.onCmdMessagesReceived
    );
    eventEmitter.addListener(MethodTypeonMessagesRead, this.onMessagesRead);
    eventEmitter.addListener(
      MethodTypeonGroupMessageRead,
      this.onGroupMessageRead
    );
    eventEmitter.addListener(
      MethodTypeonMessagesDelivered,
      this.onMessagesDelivered
    );
    eventEmitter.addListener(
      MethodTypeonMessagesRecalled,
      this.onMessagesRecalled
    );
    eventEmitter.addListener(
      MethodTypeonConversationUpdate,
      this.onConversationsUpdate
    );
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

  public async sendMessage(
    message: ChatMessage,
    callback: ChatMessageStatusListener
  ): Promise<ChatMessage> {
    message.status = ChatMessageStatus.PROGRESS;
    message.setMessageCallback(callback);
    let p = message.toJson();
    let r: Map<string, any> = await Native._callMethod(MethodTypesendMessage, {
      p,
    });
    Native.hasErrorFromResult(r);
    let msg: ChatMessage = ChatMessage.fromJson(r.get(MethodTypesendMessage));
    message.from = msg.from;
    message.to = msg.to;
    message.status = msg.status;
    return message;
  }
}
