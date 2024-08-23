/* eslint @typescript-eslint/no-empty-interface:0 */
// @types/sockets.d.ts
import type { IChatMessage } from './chat';

export interface IServerToClientEvents {
  message: (config: ISocketData) => void;
}

export interface IClientToServerEvents {
  message: (config: ISocketData) => void;
  join: (config: ISocketData, callback: (err: string | {}) => void) => void;
}

export interface IInterServerEvents {
  ping: () => void;
}

export interface ISocketData extends IChatMessage {}
