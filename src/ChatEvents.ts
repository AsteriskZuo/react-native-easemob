
export interface ChatConnectionListener {
    /// 网络已连接
    onConnected(): void;

    /// 连接失败，原因是[errorCode]
    onDisconnected(errorCode?: number): void;
}
