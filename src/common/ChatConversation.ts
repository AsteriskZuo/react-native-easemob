
export enum ChatConversationType {
  PEER_CHAT = 0,
  GROUP_CHAT = 1,
  ROOM_CHAT = 2,
}

export class EMConversation {

  id: string;
  type: ChatConversationType;
  unreadCount?: number;
  name?: string;



  constructor(id: string, type: ChatConversationType, opt?: {unreadCount?: number}) {
    this.id = id;
    this.type = type;
    if (opt) {
      this.unreadCount = opt.unreadCount;
    }
  }
}



// String id = '';
// EMConversationType? type;

// int? _unreadCount;
// Map<String, String>? _ext;
// String? _name;
// EMMessage? _latestMessage;
// EMMessage? _lastReceivedMessage;
