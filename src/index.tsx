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
  ChatMessageBodyTypeFromString,
  ChatMessageChatTypeFromNumber,
} from './common/ChatMessage';
import { ChatOptions } from './common/ChatOptions';
import { ChatPageResult } from './common/ChatPageResult';
import { ChatRoomPermissionType, ChatRoom } from './common/ChatRoom';
import { ChatUserInfoType, ChatUserInfo } from './common/ChatUserInfo';
import type { ChatConnectionListener } from './ChatEvents';

/**
 * export Objects
 */
export { ChatClient, ChatManager };

/**
 * export enum
 */
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

/**
 * export class
 */
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

export { ChatMessageBodyTypeFromString, ChatMessageChatTypeFromNumber };
