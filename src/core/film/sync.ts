/**
 * Film real-time sync (Phase 5 bridge)
 *
 * Broadcasts local FilmEntityService changes as Phase 5 `entity:*` messages and
 * applies changes received from other clients. The transport is pluggable:
 *  - BroadcastChannelTransport: syncs tabs/windows of the same browser (works today)
 *  - InMemorySyncHub: links services in one process (tests, demos)
 *  - a WebSocket transport can implement FilmSyncTransport once a server exists
 */

import { WebSocketMessageFactory, type WebSocketMessage } from '@/collaboration/phase5-websocket-server';
import { decodeFilmData, encodeFilmData } from './codec';
import type { FilmChange, FilmEntityService } from './FilmEntityService';
import { FILM_KINDS, type FilmKind, type FilmRecord } from './types';

export const FILM_SYNC_MESSAGE_TYPES = ['entity:create', 'entity:update', 'entity:delete'] as const;

export interface FilmSyncTransport {
  send(message: WebSocketMessage): void;
  subscribe(handler: (message: WebSocketMessage) => void): () => void;
  close?(): void;
}

interface FilmSyncPayload {
  kind: FilmKind;
  /** Encoded with encodeFilmData */
  record?: unknown;
}

export interface FilmSyncOptions {
  clientId: string;
  userId: string;
  /** Called after a remote change is applied */
  onRemoteChange?: (change: FilmChange, message: WebSocketMessage) => void;
}

function isFilmKind(value: unknown): value is FilmKind {
  return typeof value === 'string' && (FILM_KINDS as readonly string[]).includes(value);
}

/** Connect a service to a transport. Returns a function that disconnects it. */
export function attachFilmSync(
  service: FilmEntityService,
  transport: FilmSyncTransport,
  options: FilmSyncOptions
): () => void {
  const { clientId, userId } = options;

  const unsubscribeLocal = service.subscribe((_kind, change) => {
    if (change.origin !== 'local' || change.op === 'seed' || !change.id) return;
    const payload: FilmSyncPayload = { kind: change.kind };
    if (change.record) payload.record = encodeFilmData(change.record);
    transport.send(WebSocketMessageFactory.createEntityMessage(change.op, clientId, userId, change.id, payload));
  });

  const unsubscribeRemote = transport.subscribe((message) => {
    if (message.clientId === clientId) return;
    if (!(FILM_SYNC_MESSAGE_TYPES as readonly string[]).includes(message.type)) return;
    const payload = message.payload as FilmSyncPayload | undefined;
    if (!payload || !isFilmKind(payload.kind)) return;

    const op = message.type.slice('entity:'.length) as 'create' | 'update' | 'delete';
    const record = payload.record ? decodeFilmData<FilmRecord<FilmKind>>(payload.record) : undefined;
    const change = { kind: payload.kind, op, id: message.entityId, record, origin: 'remote' } as FilmChange;
    service.applyRemoteChange(change);
    options.onRemoteChange?.(change, message);
  });

  return () => {
    unsubscribeLocal();
    unsubscribeRemote();
  };
}

/** Sync between tabs/windows of the same origin */
export class BroadcastChannelTransport implements FilmSyncTransport {
  private readonly channel: BroadcastChannel;

  constructor(channelName = 'maataa:film-sync') {
    this.channel = new BroadcastChannel(channelName);
  }

  static isSupported(): boolean {
    return typeof BroadcastChannel !== 'undefined';
  }

  send(message: WebSocketMessage): void {
    this.channel.postMessage(message);
  }

  subscribe(handler: (message: WebSocketMessage) => void): () => void {
    const listener = (event: MessageEvent<WebSocketMessage>) => handler(event.data);
    this.channel.addEventListener('message', listener);
    return () => this.channel.removeEventListener('message', listener);
  }

  close(): void {
    this.channel.close();
  }
}

/** Synchronous in-process hub: every transport receives every other transport's messages */
export class InMemorySyncHub {
  private readonly handlers = new Set<(message: WebSocketMessage) => void>();
  readonly log: WebSocketMessage[] = [];

  createTransport(): FilmSyncTransport {
    const own = new Set<(message: WebSocketMessage) => void>();
    return {
      send: (message) => {
        this.log.push(message);
        this.handlers.forEach((handler) => {
          if (!own.has(handler)) handler(message);
        });
      },
      subscribe: (handler) => {
        own.add(handler);
        this.handlers.add(handler);
        return () => {
          own.delete(handler);
          this.handlers.delete(handler);
        };
      },
    };
  }
}
