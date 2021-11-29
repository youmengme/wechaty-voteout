"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
const warn = [
    '{{ downEmoji }}-{{ downNum }}{{#upNum}} | +{{ upNum }}{{ upEmoji }}{{/upNum}}',
    '———————————',
    'The one who has been voted {{ downEmoji }} by {{ threshold }} people will be removed from the room as an unwelcome guest.',
    '{{#upNum}}{{ upEmoji }} By {{ upVoters }}{{/upNum}}',
    '{{#downNum}}{{ downEmoji }} By {{ downVoters }}{{/downNum}}',
].join('\n');
const kick = [
    'UNWELCOME GUEST CONFIRMED:\n[Dagger] {{ votee }} [Cleaver]\n\nThank you [Rose] {{ downVoters }} [Rose] for voting for the community, we appreciate it.\n\nThanks everyone in this room for respecting our CODE OF CONDUCT.\n',
    'Removing {{ votee }} out of this room ...',
    // @ts-ignore
    async (message) => {
        const room = message.room();
        if (room) {
            const mentionList = await message.mentionList();
            const votee = mentionList[0];
            if (votee) {
                return room.del(votee).then(_ => 'Done.');
            }
        }
    },
];
const repeat = [
    'You can only vote {{ votee }} for once.',
];
exports.DEFAULT_CONFIG = {
    downEmoji: [
        '[ThumbsDown]',
        '[弱]',
        '/:MMWeak',
        '<img class="qqemoji qqemoji80" text="[弱]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
    ],
    kick,
    repeat,
    threshold: 3,
    upEmoji: [
        '[ThumbsUp]',
        '[强]',
        '/:MMStrong',
        '< img class="qqemoji qqemoji79" text="[强]_web" src="/zh_CN/htmledition/v2/images/spacer.gif”>',
    ],
    warn,
    whitelist: (_) => false,
};
//# sourceMappingURL=config.js.map