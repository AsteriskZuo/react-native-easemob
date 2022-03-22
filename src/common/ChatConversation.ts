import type { JsonCodec } from '../_internal/Defines';

export enum ChatConversationType {
  PeerChat = 0,
  GroupChat = 1,
  RoomChat = 2,
}

export function ChatConversationTypeFromNumber(
  params: number
): ChatConversationType {
  switch (params) {
    case 0:
      return ChatConversationType.PeerChat;
    case 1:
      return ChatConversationType.GroupChat;
    case 2:
      return ChatConversationType.RoomChat;
    default:
      throw new Error(`not exist this type: ${params}`);
  }
}
export function ChatConversationTypeToString(
  params: ChatConversationType
): string {
  return ChatConversationType[params];
}

export class ChatConversation implements JsonCodec {
  id: string;
  type: ChatConversationType;
  unreadCount: number;
  name?: string;
  lastMessage: any; // todo:
  lastReceivedMessage: any; //todo:

  constructor(
    id: string,
    type: ChatConversationType,
    unreadCount: number,
    lastMessage: any,
    lastReceivedMessage: any,
    opt?: {
      name: string;
    }
  ) {
    this.id = id;
    this.type = type;
    this.unreadCount = unreadCount;
    // this.lastMessage ;
    // this.lastReceivedMessage;
    if (opt) {
      this.name = opt.name;
    }
  }
  static fromJson(json: Map<string, any>): ChatConversation {
    let name: string = '';
    let ext = json.get('ext');
    if (ext != null && ext != undefined) {
      let name = ext['con_name'];
    }
    let type = ChatConversationTypeFromNumber(json.get('type') as number);
    let id = json.get('con_id');
    let unreadCount = json.get('unreadCount') as number;
    let lastMessage;
    let lastReceivedMessage;
    return new ChatConversation(
      id,
      type,
      unreadCount,
      lastMessage,
      lastReceivedMessage,
      { name: name }
    );
  }
  toJson(): Map<string, any> {
    // todo: 少了可以吗？
    let r = new Map<string, any>();
    r.set('con_id', this.id);
    r.set('type', this.type as number);
    return r;
  }
}

