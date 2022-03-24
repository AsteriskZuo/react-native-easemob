import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { ChatConnectionListener } from './ChatEvents';
import { ChatManager } from './ChatManager';
import { ChatDeviceInfo } from './common/ChatDeviceInfo';
import type { ChatOptions } from './common/ChatOptions';
import {
  MethodTypechangeAppKey,
  MethodTypecompressLogs,
  MethodTypecreateAccount,
  MethodTypegetLoggedInDevicesFromServer,
  MethodTypeinit,
  MethodTypekickAllDevices,
  MethodTypekickDevice,
  MethodTypelogin,
  MethodTypelogout,
  MethodTypeonConnected,
  MethodTypeonDisconnected,
} from './_internal/Consts';
import { Native } from './_internal/Native';

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
const eventEmitter = new NativeEventEmitter(Easemob);

export class ChatClient extends Native {
  private static TAG = 'ChatClient';
  private static _instance: ChatClient;
  public static getInstance(): ChatClient {
    if (ChatClient._instance == null || ChatClient._instance == undefined) {
      ChatClient._instance = new ChatClient();
    }
    return ChatClient._instance;
  }

  private _eventEmitter: NativeEventEmitter;

  private _chatManager: ChatManager;
  // private _contactManager: ChatContactManager;
  // private _chatRoomManager: ChatChatRoomManager;
  // private _groupManager: ChatGroupManager;
  // private _pushManager: ChatPushManager;
  // private _userInfoManager: ChatUserInfoManager;
  // private _conversationManager: ChatConversationManager;

  private _connectionListeners: Set<ChatConnectionListener>;
  // private _multiDeviceListeners: Array<ChatMultiDeviceListener>;
  // private _customListeners: Array<ChatCustomListener>;

  private _connected: boolean = false;
  private _options?: ChatOptions;
  private _accessToken: string = '';
  private _sdkVersion: string = '1.0.0';
  private _currentUsername: string = '';
  private _isLoginBefore: boolean = false;

  private constructor() {
    super();
    this._chatManager = new ChatManager();
    // this._contactManager = new ChatContactManager();
    // this._chatRoomManager = new ChatChatRoomManager();
    // this._groupManager = new ChatGroupManager();
    // this._pushManager = new ChatPushManager();
    // this._userInfoManager = new ChatUserInfoManager();
    // this._conversationManager = new ChatConversationManager();

    this._connectionListeners = new Set<ChatConnectionListener>();
    this._eventEmitter = eventEmitter;
    this.setMethodCallHandler();
    this._chatManager.setMethodCallHandler(this._eventEmitter);
  }

  private setMethodCallHandler() {
    this._eventEmitter.addListener(MethodTypeonConnected, this.onConnected);
    this._eventEmitter.addListener(MethodTypeonDisconnected, this.onDisconnected);
  }

  private onConnected(): void {
    console.log(`${ChatClient.TAG}: onConnected:`);
    this._connectionListeners.forEach(element => {
      element.onConnected();
    });
  }
  private onDisconnected(params?: Map<string, any>): void {
    console.log(`${ChatClient.TAG}: onDisconnected: ${params}`);
    this._connectionListeners.forEach(element => {
      let ec = params?.get('errorCode') as number;
      element.onDisconnected(ec);
    });
  }

  private reset(): void {
    this._isLoginBefore = false;
    this._connected = false;
    this._accessToken = '';
    this._currentUsername = '';
  }

  public connected(): boolean {
    return this._connected;
  }
  public options(): ChatOptions | undefined {
    return this._options;
  }
  public accessToken(): string {
    return this._accessToken;
  }
  public sdkVersion(): string {
    return this._sdkVersion;
  }
  public currentUserName(): string {
    return this._currentUsername;
  }
  public isLoginBefore(): boolean {
    return this._isLoginBefore;
  }


  public async init(options: ChatOptions): Promise<void> {
    console.log(`${ChatClient.TAG}: init: ${options}`);
    this._options = options;
    let p = options.toJson(); // 可能本地变量的名字和实际key不一致。
    let result: Map<string, any> = await Native._callMethod(MethodTypeinit, {
      p,
    });
    result = result.get(MethodTypeinit);
    this._currentUsername = result.get('currentUsername');
    this._isLoginBefore = (result.get('isLoginBefore') as boolean) ?? false;
  }

  public async createAccount(
    username: string,
    password: string
  ): Promise<string> {
    console.log(`${ChatClient.TAG}: createAccount: ${username}, ${password}`);
    let result: Map<string, any> = await Native._callMethod(
      MethodTypecreateAccount,
      { username: username, password: password }
    );
    ChatClient.hasErrorFromResult(result);
    return result.get(MethodTypecreateAccount);
  }

  public async login(
    username: string,
    pwdOrToken: string,
    isPassword: boolean = true
  ): Promise<string | undefined> {
    console.log(
      `${ChatClient.TAG}: login: ${pwdOrToken}, ${isPassword}, ${isPassword}`
    );
    let result: Map<string, any> = await Native._callMethod('', {
      username: username,
      pwdOrToken: pwdOrToken,
      isPassword: isPassword,
    });
    ChatClient.hasErrorFromResult(result);
    result = result.get(MethodTypelogin);
    this._currentUsername = result.get('username');
    this._accessToken = result.get('token');
    this._isLoginBefore = true;
    return this._currentUsername;
  }

  public async logout(unbindDeviceToken: boolean = true): Promise<boolean> {
    console.log(`${ChatClient.TAG}: logout: ${unbindDeviceToken}`);
    let result: Map<string, any> = await Native._callMethod(MethodTypelogout, {
      unbindToken: unbindDeviceToken,
    });
    ChatClient.hasErrorFromResult(result);
    this.reset();
    return result.get(MethodTypelogout) as boolean;
  }

  public async changeAppKey(newAppKey: string): Promise<boolean> {
    console.log(`${ChatClient.TAG}: changeAppKey: ${newAppKey}`);
    let r: Map<string, any> = await Native._callMethod(MethodTypechangeAppKey, {
      appKey: newAppKey,
    });
    ChatClient.hasErrorFromResult(r);
    return r.get(MethodTypechangeAppKey) as boolean;
  }

  public async compressLogs(): Promise<string | undefined> {
    console.log(`${ChatClient.TAG}: compressLogs:`);
    let r: Map<string, any> = await Native._callMethod(MethodTypecompressLogs);
    ChatClient.hasErrorFromResult(r);
    return r.get(MethodTypecompressLogs);
  }

  public async getLoggedInDevicesFromServer(
    username: string,
    password: string
  ): Promise<Array<ChatDeviceInfo>> {
    console.log(
      `${ChatClient.TAG}: getLoggedInDevicesFromServer: ${username}, ${password}`
    );
    let result: Map<string, any> = await Native._callMethod(
      MethodTypegetLoggedInDevicesFromServer,
      { username: username, password: password }
    );
    ChatClient.hasErrorFromResult(result);
    let r = new Array<ChatDeviceInfo>();
    let list: Array<any> = result.get(MethodTypegetLoggedInDevicesFromServer);
    list.forEach((element) => {
      r.push(ChatDeviceInfo.fromJson(element));
    });
    return r;
  }

  public async kickDevice(
    username: string,
    password: string,
    resource: string
  ): Promise<boolean> {
    console.log(
      `${ChatClient.TAG}: getLoggedInDevicesFromServer: ${username}, ${password}, ${resource}`
    );
    let r: Map<string, any> = await Native._callMethod(MethodTypekickDevice, {
      username: username,
      password: password,
      resource: resource,
    });
    ChatClient.hasErrorFromResult(r);
    return r.get(MethodTypekickDevice) as boolean;
  }

  public async kickAllDevices(
    username: string,
    password: string
  ): Promise<boolean> {
    console.log(
      `${ChatClient.TAG}: getLoggedInDevicesFromServer: ${username}, ${password}`
    );
    let r: Map<string, any> = await Native._callMethod(
      MethodTypekickAllDevices,
      { username: username, password: password }
    );
    ChatClient.hasErrorFromResult(r);
    return r.get(MethodTypekickAllDevices) as boolean;
  }

  public addConnectionListener(listener: ChatConnectionListener): void {
    this._connectionListeners.add(listener);
  }

  public removeConnectionListener(listener: ChatConnectionListener): void {
    this._connectionListeners.delete(listener);
  }

  public get chatManager() {
    return this._chatManager;
  }

  public get rnSdkVersion() {
    return this._sdkVersion;
  }
}
