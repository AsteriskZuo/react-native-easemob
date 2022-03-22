import type { JsonCodec } from '../_internal/Defines';

export enum ChatGroupStyle {
  PrivateOnlyOwnerInvite = 0, // 私有群，只有群主能邀请他人进群，被邀请人会收到邀请信息，同意后可入群；
  PrivateMemberCanInvite = 1, // 私有群，所有人都可以邀请他人进群，被邀请人会收到邀请信息，同意后可入群；
  PublicJoinNeedApproval = 2, // 公开群，可以通过获取公开群列表api取的，申请加入时需要管理员以上权限用户同意；
  PublicOpenJoin = 3, // 公开群，可以通过获取公开群列表api取的，可以直接进入；
}

export enum ChatGroupPermissionType {
  None = -1,
  Member = 0,
  Admin = 1,
  Owner = 2,
}

export class ChatGroupMessageAck implements JsonCodec {
  messageId: string;
  from: string;
  readCount: number;
  timestamp: number;
  content?: string;
  constructor(
    messageId: string,
    from: string,
    readCount: number,
    timestamp: number,
    ext?: { content: string }
  ) {
    this.messageId = messageId;
    this.from = from;
    this.readCount = readCount;
    this.timestamp = timestamp;
    if (ext) {
      this.content = ext.content;
    }
  }
  static fromJson(json: Map<string, any>): ChatGroupMessageAck {
    let messageId = json.get('msg_id');
    let from = json.get('from');
    let content = json.get('content') as string;
    let readCount = json.get('count') as number;
    let timestamp = json.get('timestamp') as number;
    return new ChatGroupMessageAck(messageId, from, readCount, timestamp, {
      content: content,
    });
  }
  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('msg_id', this.messageId);
    r.set('from', this.from);
    r.set('content', this.content);
    r.set('readCount', this.readCount);
    r.set('timestamp', this.timestamp);
    return r;
  }
}

export function ChatGroupStyleFromNumber(params: number): ChatGroupStyle {
  switch (params) {
    case 0:
      return ChatGroupStyle.PrivateOnlyOwnerInvite;
    case 1:
      return ChatGroupStyle.PrivateMemberCanInvite;
    case 2:
      return ChatGroupStyle.PublicJoinNeedApproval;
    case 3:
      return ChatGroupStyle.PublicOpenJoin;
    default:
      throw new Error(`not exist this type: ${params}`);
  }
}
export function ChatConversationTypeToString(params: ChatGroupStyle): string {
  return ChatGroupStyle[params];
}

export function ChatGroupPermissionTypeFromNumber(
  params: number
): ChatGroupPermissionType {
  switch (params) {
    case -1:
      return ChatGroupPermissionType.None;
    case 0:
      return ChatGroupPermissionType.Member;
    case 1:
      return ChatGroupPermissionType.Admin;
    case 2:
      return ChatGroupPermissionType.Owner;
    default:
      throw new Error(`not exist this type: ${params}`);
  }
}
export function ChatGroupPermissionTypeToString(
  params: ChatGroupPermissionType
): string {
  return ChatGroupPermissionType[params];
}

export class ChatGroup implements JsonCodec {
  groupId: string;
  name: string;
  description: string;
  owner: string;
  announcement: string;
  memberCount: number;
  memberList: Array<string>;
  adminList: Array<string>;
  blockList: Array<string>;
  muteList: Array<string>;
  sharedFileList: Array<string>;
  noticeEnable: boolean;
  messageBlocked: boolean;
  isAllMemberMuted: boolean;
  options: ChatGroupOptions;
  permissionType: ChatGroupPermissionType;
  constructor(
    groupId: string,
    name: string,
    description: string,
    owner: string,
    announcement: string,
    memberCount: number,
    memberList: Array<string>,
    adminList: Array<string>,
    blockList: Array<string>,
    muteList: Array<string>,
    sharedFileList: Array<string>,
    noticeEnable: boolean,
    messageBlocked: boolean,
    isAllMemberMuted: boolean,
    options: ChatGroupOptions,
    permissionType: ChatGroupPermissionType
  ) {
    this.groupId = groupId;
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.announcement = announcement;
    this.memberCount = memberCount;
    this.memberList = memberList;
    this.adminList = adminList;
    this.blockList = blockList;
    this.muteList = muteList;
    this.sharedFileList = sharedFileList;
    this.noticeEnable = noticeEnable;
    this.messageBlocked = messageBlocked;
    this.isAllMemberMuted = isAllMemberMuted;
    this.options = options;
    this.permissionType = permissionType;
  }
  static fromJson(json: Map<string, any>): ChatGroup {
    let groupId = json.get('groupId');
    let name = json.get('name');
    let description = json.get('desc');
    let owner = json.get('owner');
    let announcement = json.get('announcement');
    let memberCount = json.get('memberCount');
    let memberList = json.get('memberList');
    let adminList = json.get('adminList');
    let blockList = json.get('blockList');
    let muteList = json.get('muteList');
    let sharedFileList = json.get('sharedFileList');
    let noticeEnable = json.get('noticeEnable') as boolean;
    let messageBlocked = json.get('messageBlocked') as boolean;
    let isAllMemberMuted = json.get('isAllMemberMuted') as boolean;
    let options = ChatGroupOptions.fromJson(json.get('options'));
    let permissionType = ChatGroupPermissionTypeFromNumber(
      json.get('permissionType')
    );
    return new ChatGroup(
      groupId,
      name,
      description,
      owner,
      announcement,
      memberCount,
      memberList,
      adminList,
      blockList,
      muteList,
      sharedFileList,
      noticeEnable,
      messageBlocked,
      isAllMemberMuted,
      options,
      permissionType
    );
  }
  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('groupId', this.groupId);
    r.set('name', this.name);
    r.set('desc', this.description);
    r.set('owner', this.owner);
    r.set('announcement', this.announcement);
    r.set('memberCount', this.memberCount);
    r.set('memberList', this.memberList);
    r.set('adminList', this.adminList);
    r.set('blockList', this.blockList);
    r.set('muteList', this.muteList);
    r.set('sharedFileList', this.sharedFileList);
    r.set('noticeEnable', this.noticeEnable);
    r.set('messageBlocked', this.messageBlocked);
    r.set('isAllMemberMuted', this.isAllMemberMuted);
    r.set('options', this.options.toJson()); // todo:
    r.set('permissionType', this.permissionType as number);
    return r;
  }
}

export class ChatGroupOptions implements JsonCodec {
  style: ChatGroupStyle;
  maxCount: number;
  inviteNeedConfirm: boolean;
  ext: string;
  constructor(
    style: ChatGroupStyle,
    maxCount: number,
    inviteNeedConfirm: boolean,
    ext: string
  ) {
    this.style = style;
    this.maxCount = maxCount;
    this.inviteNeedConfirm = inviteNeedConfirm;
    this.ext = ext;
  }
  static fromJson(json: Map<string, any>): ChatGroupOptions {
    let style = ChatGroupStyleFromNumber(json.get('style'));
    let maxCount = json.get('maxCount');
    let ext = json.get('ext');
    let inviteNeedConfirm = json.get('inviteNeedConfirm') as boolean;
    return new ChatGroupOptions(style, maxCount, inviteNeedConfirm, ext);
  }
  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('style', this.style as number);
    r.set('maxCount', this.maxCount);
    r.set('inviteNeedConfirm', this.inviteNeedConfirm);
    r.set('ext', this.ext);
    return r;
  }
}

export class ChatGroupSharedFile implements JsonCodec {
  fileId: string;
  fileName: string;
  fileOwner: string;
  createTime: number;
  fileSize: number;
  constructor(
    fileId: string,
    fileName: string,
    fileOwner: string,
    createTime: number,
    fileSize: number
  ) {
    this.fileId = fileId;
    this.fileName = fileName;
    this.fileOwner = fileOwner;
    this.createTime = createTime;
    this.fileSize = fileSize;
  }

  static fromJson(json: Map<string, any>): ChatGroupSharedFile {
    let fileId = json.get('fileId');
    let fileName = json.get('name');
    let fileOwner = json.get('owner');
    let createTime = json.get('createTime') as number;
    let fileSize = json.get('fileSize') as number;
    return new ChatGroupSharedFile(
      fileId,
      fileName,
      fileOwner,
      createTime,
      fileSize
    );
  }

  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('fileId', this.fileId);
    r.set('name', this.fileName);
    r.set('owner', this.fileOwner);
    r.set('createTime', this.createTime as number);
    r.set('fileSize', this.fileSize as number);
    return r;
  }
}
