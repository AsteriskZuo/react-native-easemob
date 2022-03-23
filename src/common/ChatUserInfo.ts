import type { JsonCodec } from '../_internal/Defines';

export enum ChatUserInfoType {
  NickName,
  AvatarURL,
  Phone,
  Mail,
  Gender,
  Sign,
  Birth,
  Ext,
}

export class ChatUserInfo implements JsonCodec {
  userId: string;
  nickName?: string;
  avatarUrl?: string;
  mail?: string;
  phone?: string;
  gender?: number;
  sign?: string;
  birth?: string;
  ext?: string;
  expireTime: number;
  constructor(params: {
    userId: string;
    nickName?: string;
    avatarUrl?: string;
    mail?: string;
    phone?: string;
    gender?: number;
    sign?: string;
    birth?: string;
    ext?: string;
    expireTime: number;
  }) {
    this.userId = params.userId;
    this.nickName = params.nickName;
    this.avatarUrl = params.avatarUrl;
    this.mail = params.mail;
    this.phone = params.phone;
    this.gender = params.gender;
    this.sign = params.sign;
    this.birth = params.birth;
    this.ext = params.ext;
    this.expireTime = params.expireTime;
  }
  static fromJson(json: Map<string, any>): ChatUserInfo {
    let userId = json.get('userId');
    let nickName = json.get('nickName');
    let avatarUrl = json.get('avatarUrl');
    let mail = json.get('mail');
    let phone = json.get('phone');
    let gender = json.get('gender') as number;
    let sign = json.get('sign');
    let birth = json.get('birth');
    let ext = json.get('ext');
    let expireTime = json.get('expireTime') as number;
    return new ChatUserInfo({
      userId,
      nickName,
      avatarUrl,
      mail,
      phone,
      gender,
      sign,
      birth,
      ext,
      expireTime,
    });
  }
  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('userId', this.userId);
    r.set('nickName', this.nickName);
    r.set('avatarUrl', this.avatarUrl);
    r.set('mail', this.mail);
    r.set('phone', this.phone);
    r.set('gender', this.gender);
    r.set('sign', this.sign);
    r.set('birth', this.birth);
    r.set('ext', this.ext);
    r.set('expireTime', this.expireTime);
    return r;
  }
}
