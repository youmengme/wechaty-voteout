import { Room, Contact } from 'wechaty';
export interface VotePayload {
    downIdList: string[];
    downNum: number;
    upIdList: string[];
    upNum: number;
}
declare const init: () => void;
declare const get: (room: Room, votee: Contact) => Readonly<VotePayload>;
declare const set: (room: Room, votee: Contact, payload: VotePayload) => void;
declare const del: (room: Room, votee: Contact) => void;
declare const prune: () => void;
export { init, get, set, del, prune, };
//# sourceMappingURL=store.d.ts.map