import type { matchers, talkers } from 'wechaty-plugin-contrib';
export interface VoteOutConfig {
    room: matchers.RoomMatcherOptions;
    threshold?: number;
    whitelist?: matchers.ContactMatcherOptions;
    upEmoji?: string[];
    downEmoji?: string[];
    warn?: talkers.RoomTalkerOptions;
    kick?: talkers.MessageTalkerOptions;
    repeat?: talkers.RoomTalkerOptions;
}
declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare const DEFAULT_CONFIG: Omit<Required<VoteOutConfig>, 'room'>;
export {};
//# sourceMappingURL=config.d.ts.map