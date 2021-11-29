/* eslint-disable brace-style */
import { log, } from 'wechaty';
import LRUCache from 'lru-cache';
const DEFAULT_PAYLOAD = {
    downIdList: [],
    downNum: 0,
    upIdList: [],
    upNum: 0,
};
let lruCache;
const init = () => {
    const lruOptions = {
        // length: function (n) { return n * 2},
        dispose(key, val) {
            log.silly('WechatyPluginContrib', 'VoteOut() lruOptions.dispose(%s, %s)', key, JSON.stringify(val));
        },
        max: 1000,
        maxAge: 60 * 60 * 1000,
    };
    lruCache = new LRUCache(lruOptions);
};
const buildKey = (room, votee) => `${room.id}-${votee.id}-vote`;
const get = (room, votee) => {
    const key = buildKey(room, votee);
    return lruCache.get(key) || DEFAULT_PAYLOAD;
};
const set = (room, votee, payload) => {
    const key = buildKey(room, votee);
    lruCache.set(key, payload);
};
const del = (room, votee) => {
    const key = buildKey(room, votee);
    lruCache.del(key);
};
const prune = () => lruCache.prune();
export { init, get, set, del, prune, };
//# sourceMappingURL=store.js.map