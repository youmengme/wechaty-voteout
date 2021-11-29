"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = exports.del = exports.set = exports.get = exports.init = void 0;
/* eslint-disable brace-style */
const wechaty_1 = require("wechaty");
const lru_cache_1 = __importDefault(require("lru-cache"));
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
            wechaty_1.log.silly('WechatyPluginContrib', 'VoteOut() lruOptions.dispose(%s, %s)', key, JSON.stringify(val));
        },
        max: 1000,
        maxAge: 60 * 60 * 1000,
    };
    lruCache = new lru_cache_1.default(lruOptions);
};
exports.init = init;
const buildKey = (room, votee) => `${room.id}-${votee.id}-vote`;
const get = (room, votee) => {
    const key = buildKey(room, votee);
    return lruCache.get(key) || DEFAULT_PAYLOAD;
};
exports.get = get;
const set = (room, votee, payload) => {
    const key = buildKey(room, votee);
    lruCache.set(key, payload);
};
exports.set = set;
const del = (room, votee) => {
    const key = buildKey(room, votee);
    lruCache.del(key);
};
exports.del = del;
const prune = () => lruCache.prune();
exports.prune = prune;
//# sourceMappingURL=store.js.map