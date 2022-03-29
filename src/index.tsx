import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-easemob' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const Easemob = NativeModules.Easemob
  ? NativeModules.Easemob
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
// const eventEmitter = new NativeEventEmitter(Easemob);

export function multiply(a: number, b: number): Promise<number> {
  return Easemob.multiply(a, b);
}

import { ChatClient } from './ChatClient';
import {
  ChatSearchDirection,
  ChatManagerListener,
  ChatManager,
} from './ChatManager';

import {
  ChatConversationType,
  ChatConversation,
} from './common/ChatConversation';
import { ChatCursorResult } from './common/ChatCursorResult';
import { ChatDeviceInfo } from './common/ChatDeviceInfo';
import { ChatError } from './common/ChatError';
import {
  ChatGroupStyle,
  ChatGroupPermissionType,
  ChatGroupMessageAck,
  ChatGroupOptions,
  ChatGroup,
} from './common/ChatGroup';
import {
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatDownloadStatus,
  ChatMessageBodyType,
  ChatMessageStatusCallback,
  ChatMessage,
} from './common/ChatMessage';
import { ChatOptions } from './common/ChatOptions';
import { ChatPageResult } from './common/ChatPageResult';
import { ChatRoomPermissionType, ChatRoom } from './common/ChatRoom';
import { ChatUserInfoType, ChatUserInfo } from './common/ChatUserInfo';
import type { ChatConnectionListener } from './ChatEvents';

// export manager
// export default ChatClient;
export { ChatClient, ChatManager };

// export enum
export {
  ChatConversationType,
  ChatGroupStyle,
  ChatGroupPermissionType,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatDownloadStatus,
  ChatMessageBodyType,
  ChatRoomPermissionType,
  ChatUserInfoType,
  ChatSearchDirection,
};

// export class
export {
  ChatConversation,
  ChatCursorResult,
  ChatDeviceInfo,
  ChatError,
  ChatGroupMessageAck,
  ChatGroupOptions,
  ChatGroup,
  ChatMessageStatusCallback,
  ChatMessage,
  ChatOptions,
  ChatPageResult,
  ChatRoom,
  ChatUserInfo,
  ChatManagerListener,
  ChatConnectionListener,
};
