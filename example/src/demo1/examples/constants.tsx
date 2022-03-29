import {
  ChatConversationType,
  ChatMessageBodyType,
  ChatMessageStatus,
} from '../../../../src/index';

// ChatConversationType and ChatMessageChatType is same ???
export const conversations = {
  [ChatConversationType.PeerChat]: '个人',
  [ChatConversationType.GroupChat]: '群组',
  [ChatConversationType.RoomChat]: '聊天室',
};

export const messageTypes = {
  [ChatMessageBodyType.TXT]: '文本消息',
  [ChatMessageBodyType.IMAGE]: '图片消息',
  [ChatMessageBodyType.VIDEO]: '视频消息',
  [ChatMessageBodyType.VOICE]: '声音消息',
  [ChatMessageBodyType.LOCATION]: '位置消息',
  [ChatMessageBodyType.CMD]: '命令消息',
  [ChatMessageBodyType.CUSTOM]: '自定义消息',
  [ChatMessageBodyType.FILE]: '文件消息',
};

export const sentStatus = {
  [ChatMessageStatus.CREATE]: '创建',
  [ChatMessageStatus.PROGRESS]: '发送中',
  [ChatMessageStatus.SUCCESS]: '发送成功',
  [ChatMessageStatus.FAIL]: '发送失败',
};

export const conversationNotificationStatus = {
  true: '免打扰',
  false: '消息提醒',
};
