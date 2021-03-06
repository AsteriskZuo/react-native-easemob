export enum ChatContactGroupEvent {
  CONTACT_REMOVE,
  CONTACT_ACCEPT,
  CONTACT_DECLINE,
  CONTACT_BAN,
  CONTACT_ALLOW,
  GROUP_CREATE,
  GROUP_DESTROY,
  GROUP_JOIN,
  GROUP_LEAVE,
  GROUP_APPLY,
  GROUP_APPLY_ACCEPT,
  GROUP_APPLY_DECLINE,
  GROUP_INVITE,
  GROUP_INVITE_ACCEPT,
  GROUP_INVITE_DECLINE,
  GROUP_KICK,
  GROUP_BAN,
  GROUP_ALLOW,
  GROUP_BLOCK,
  GROUP_UNBLOCK,
  GROUP_ASSIGN_OWNER,
  GROUP_ADD_ADMIN,
  GROUP_REMOVE_ADMIN,
  GROUP_ADD_MUTE,
  GROUP_REMOVE_MUTE,
}

export function ChatContactGroupEventFromNumber(
  params: number
): ChatContactGroupEvent {
  switch (params) {
    case 2:
      return ChatContactGroupEvent.CONTACT_REMOVE;
    case 3:
      return ChatContactGroupEvent.CONTACT_ACCEPT;
    case 4:
      return ChatContactGroupEvent.CONTACT_DECLINE;
    case 5:
      return ChatContactGroupEvent.CONTACT_BAN;
    case 6:
      return ChatContactGroupEvent.CONTACT_ALLOW;
    case 10:
      return ChatContactGroupEvent.GROUP_CREATE;
    case 11:
      return ChatContactGroupEvent.GROUP_DESTROY;
    case 12:
      return ChatContactGroupEvent.GROUP_JOIN;
    case 13:
      return ChatContactGroupEvent.GROUP_LEAVE;
    case 14:
      return ChatContactGroupEvent.GROUP_APPLY;
    case 15:
      return ChatContactGroupEvent.GROUP_APPLY_ACCEPT;
    case 16:
      return ChatContactGroupEvent.GROUP_APPLY_DECLINE;
    case 17:
      return ChatContactGroupEvent.GROUP_INVITE;
    case 18:
      return ChatContactGroupEvent.GROUP_INVITE_ACCEPT;
    case 19:
      return ChatContactGroupEvent.GROUP_INVITE_DECLINE;
    case 20:
      return ChatContactGroupEvent.GROUP_KICK;
    case 21:
      return ChatContactGroupEvent.GROUP_BAN;
    case 22:
      return ChatContactGroupEvent.GROUP_ALLOW;
    case 23:
      return ChatContactGroupEvent.GROUP_BLOCK;
    case 24:
      return ChatContactGroupEvent.GROUP_UNBLOCK;
    case 25:
      return ChatContactGroupEvent.GROUP_ASSIGN_OWNER;
    case 26:
      return ChatContactGroupEvent.GROUP_ADD_ADMIN;
    case 27:
      return ChatContactGroupEvent.GROUP_REMOVE_ADMIN;
    case 28:
      return ChatContactGroupEvent.GROUP_ADD_MUTE;
    case 29:
      return ChatContactGroupEvent.GROUP_REMOVE_MUTE;
    default:
      throw new Error(`not exist this type: ${params}`);
  }
}

/**
 * The chat connection listener.
 *
 * For the occasion of onDisconnected during unstable network condition, you
 * don't need to reconnect manually, the chat SDK will handle it automatically.
 *
 * There are only two states: onConnected, onDisconnected.
 *
 * Note: We recommend not to update UI based on those methods, because this
 * method is called on worker thread. If you update UI in those methods, other
 * UI errors might be invoked. Also do not insert heavy computation work here,
 * which might invoke other listeners to handle this connection event.
 *
 * Register:
 *  ```typescript
 *  let listener = new (class s implements ChatConnectionListener {
 *    onTokenWillExpire(): void {
 *      console.log('ConnectScreen.onTokenWillExpire');
 *    }
 *    onTokenDidExpire(): void {
 *      console.log('ConnectScreen.onTokenDidExpire');
 *    }
 *    onConnected(): void {
 *      console.log('ConnectScreen.onConnected');
 *    }
 *    onDisconnected(errorCode?: number): void {
 *      console.log('ConnectScreen.onDisconnected', errorCode);
 *    }
 *  })();
 *  ChatClient.getInstance().addConnectionListener(listener);
 *  ```
 * Unregister:
 *  ```typescript
 *  ChatClient.getInstance().removeConnectionListener(listener);
 *  ```
 */
export interface ChatConnectionListener {
  /**
   * Occurs when the SDK connects to the chat server successfully.
   */
  onConnected(): void;

  /**
   * Occurs when the SDK disconnect from the chat server.
   *
   * Note that the logout may not be performed at the bottom level when the SDK is disconnected.
   *
   * @param errorCode The Error code, see {@link ChatError}
   */
  onDisconnected(errorCode?: number): void;

  /**
   * Occurs when the token has expired.
   */
  onTokenWillExpire(): void;

  /**
   * Occurs when the token is about to expire.
   */
  onTokenDidExpire(): void;
}

export interface ChatMultiDeviceListener {
  onContactEvent(
    event?: ChatContactGroupEvent,
    target?: string,
    ext?: string
  ): void;

  onGroupEvent(
    event?: ChatContactGroupEvent,
    target?: string,
    usernames?: Array<string>
  ): void;
}

export interface ChatCustomListener {
  onDataReceived(map: Map<string, any>): void;
}

export interface ChatContactEventListener {
  /// ???[userName]???????????????
  onContactAdded(userName?: string): void;

  /// ???[userName]??????????????????
  onContactDeleted(userName?: string): void;

  /// ??????[userName]???????????????????????????[reason]
  onContactInvited(userName?: string, reason?: string): void;

  /// ????????????????????????[userName]??????
  onFriendRequestAccepted(userName?: string): void;

  /// ????????????????????????[userName]??????
  onFriendRequestDeclined(userName?: string): void;
}

export interface ChatConversationListener {
  onConversationUpdate(): void;
}

export interface ChatRoomEventListener {
  /// id???[roomId],?????????[roomName]?????????????????????
  onChatRoomDestroyed(roomId: string, roomName?: string): void;

  /// ?????????[participant]??????id???[roomId]????????????
  onMemberJoinedFromChatRoom(roomId: string, participant: string): void;

  /// ?????????[participant]??????id???[roomId]????????????[roomName]????????????
  onMemberExitedFromChatRoom(
    roomId: string,
    roomName?: string,
    participant?: string
  ): void;

  /// ??????[participant]???id???[roomId],??????[roomName]??????????????????
  onRemovedFromChatRoom(
    roomId: string,
    roomName?: string,
    participant?: string
  ): void;

  /// @nodoc id???[roomId]????????????????????????[mutes]?????????
  onMuteListAddedFromChatRoom(
    roomId: string,
    mutes: Array<string>,
    expireTime?: string
  ): void;

  /// @nodoc id???[roomId]????????????????????????[mutes]?????????
  onMuteListRemovedFromChatRoom(roomId: string, mutes: Array<string>): void;

  /// @nodoc id???[roomId]??????????????????id???[admin]?????????
  onAdminAddedFromChatRoom(roomId: string, admin: string): void;

  /// @nodoc id???[roomId]??????????????????id???[admin]?????????
  onAdminRemovedFromChatRoom(roomId: string, admin: string): void;

  /// @nodoc id???[roomId]????????????????????????[oldOwner]?????????[newOwner]
  onOwnerChangedFromChatRoom(
    roomId: string,
    newOwner: string,
    oldOwner: string
  ): void;

  /// @nodoc id???[roomId]????????????????????????[announcement]
  onAnnouncementChangedFromChatRoom(roomId: string, announcement: string): void;

  /// ???????????????????????????????????????
  onWhiteListAddedFromChatRoom(roomId: string, members: Array<string>): void;

  /// ???????????????????????????????????????
  onWhiteListRemovedFromChatRoom(roomId: string, members: Array<string>): void;

  /// ?????????????????????????????????
  onAllChatRoomMemberMuteStateChanged(
    roomId: string,
    isAllMuted: boolean
  ): void;
}
