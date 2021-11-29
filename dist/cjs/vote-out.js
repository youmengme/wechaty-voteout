"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteOut = void 0;
/* eslint-disable brace-style */
const wechaty_1 = require("wechaty");
const wechaty_puppet_1 = require("wechaty-puppet");
const wechaty_plugin_contrib_1 = require("wechaty-plugin-contrib");
const mustache_view_js_1 = require("./mustache-view.js");
const config_js_1 = require("./config.js");
const store = __importStar(require("./store.js"));
function VoteOut(config) {
    wechaty_1.log.verbose('WechatyPluginContrib', 'VoteOut(%s)', JSON.stringify(config));
    config = {
        ...config_js_1.DEFAULT_CONFIG,
        ...config,
    };
    store.init();
    const isVoteDown = (text) => !!(config.downEmoji?.includes(text));
    const isVoteUp = (text) => !!(config.upEmoji?.includes(text));
    const isVoteManagedRoom = wechaty_plugin_contrib_1.matchers.roomMatcher(config.room);
    const isWhitelistContact = wechaty_plugin_contrib_1.matchers.contactMatcher(config.whitelist);
    const talkRepeat = wechaty_plugin_contrib_1.talkers.roomTalker(config.repeat);
    const talkWarn = wechaty_plugin_contrib_1.talkers.roomTalker(config.warn);
    const talkKick = wechaty_plugin_contrib_1.talkers.messageTalker(config.kick);
    return function VoteOutPlugin(wechaty) {
        wechaty_1.log.verbose('WechatyPluginContrib', 'VoteOut() VoteOutPlugin(%s)', wechaty);
        let lastPrune = 0;
        const oneDay = 24 * 3600 * 1000; // 1 day
        wechaty.on('heartbeat', () => {
            if (Date.now() - lastPrune > oneDay) {
                // Prune the expired cache. other wise it can only be removed from get
                store.prune();
                lastPrune = Date.now();
            }
        });
        wechaty.on('message', async (message) => {
            wechaty_1.log.silly('WechatyPluginContrib', 'VoteOut() on(message) %s', message);
            /**
             * Validate Vote Message
             */
            const room = message.room();
            const voter = message.talker();
            if (!room) {
                return;
            }
            // if (!voter)                               { return  }
            if (message.type() !== wechaty_puppet_1.MessageType.Text) {
                return;
            }
            const mentionList = await message.mentionList();
            if (mentionList.length <= 0) {
                return;
            }
            const text = await message.mentionText();
            if (!isVoteUp(text)
                && !isVoteDown(text)) {
                return;
            }
            if (!await isVoteManagedRoom(room)) {
                return;
            }
            wechaty_1.log.verbose('WechatyPluginContrib', 'VoteOut() on(message) %s in %s is voting %s', voter, room, mentionList.join(','));
            // We only support vote one contact now. others more than one will be ignored.
            const votee = mentionList[0];
            if (!votee) {
                return;
            }
            /**
             * Skip bot & whitelist-ed Votee
             */
            if (votee.id === message.wechaty.currentUser().id) {
                return;
            }
            if (await isWhitelistContact(votee)) {
                return;
            }
            /**
             * Check & set vote payload
             */
            let payload = store.get(room, votee);
            wechaty_1.log.verbose('WechatyPluginContrib', 'VoteOut() on(message) payload for votee %s is %s', votee, JSON.stringify(payload));
            /**
             * The voter has already voted the votee before
             */
            if (payload.downIdList.includes(voter.id)
                || payload.upIdList.includes(voter.id)) {
                const view = await (0, mustache_view_js_1.getMustacheView)(config, payload, room, votee);
                return talkRepeat(room, voter, view);
            }
            /**
             * Update payload
             */
            if (isVoteUp(text)) {
                payload = {
                    ...payload,
                    upIdList: [...new Set([
                            ...payload.upIdList,
                            voter.id,
                        ])],
                    upNum: payload.upNum + 1,
                };
                store.set(room, votee, payload);
            }
            else if (isVoteDown(text)) {
                payload = {
                    ...payload,
                    downIdList: [...new Set([
                            ...payload.downIdList,
                            voter.id,
                        ])],
                    downNum: payload.downNum + 1,
                };
                store.set(room, votee, payload);
            }
            /**
             * Kick or Warn!
             */
            const view = await (0, mustache_view_js_1.getMustacheView)(config, payload, room, votee);
            if (payload.downNum - payload.upNum >= config.threshold) {
                await talkKick(message, view);
                if (await room.has(votee)) {
                    await room.del(votee);
                }
                store.del(room, votee);
            }
            else {
                await talkWarn(room, votee, view);
            }
        });
    };
}
exports.VoteOut = VoteOut;
//# sourceMappingURL=vote-out.js.map