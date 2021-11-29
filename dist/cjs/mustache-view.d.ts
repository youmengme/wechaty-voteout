import type { Room, Contact } from 'wechaty';
import { VoteOutConfig } from './config.js';
import type { VotePayload } from './store.js';
export interface MustacheView {
    threshold: number;
    downEmoji: string;
    downNum?: number;
    downVoters?: string;
    upEmoji?: string;
    upNum?: number;
    upVoters?: string;
    votee: string;
}
/**
 * Build Mustache View
 */
declare function getMustacheView(config: VoteOutConfig, payload: VotePayload, room: Room, votee: Contact): Promise<MustacheView>;
export declare function getAtNameText(contactIdList: string[], room: Room): Promise<string>;
export { getMustacheView, };
//# sourceMappingURL=mustache-view.d.ts.map