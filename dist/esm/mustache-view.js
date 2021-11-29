import { DEFAULT_CONFIG, } from './config.js';
/**
 * Build Mustache View
 */
async function getMustacheView(config, payload, room, votee) {
    return {
        downEmoji: (config.downEmoji && config.downEmoji[0]) || DEFAULT_CONFIG.downEmoji[0],
        downNum: payload.downNum,
        downVoters: await getAtNameText([...payload.downIdList], room),
        threshold: config.threshold || DEFAULT_CONFIG.threshold,
        upEmoji: config.upEmoji && config.upEmoji[0],
        upNum: payload.upNum,
        upVoters: await getAtNameText([...payload.upIdList], room),
        votee: await room.alias(votee) || votee.name(),
    };
}
export async function getAtNameText(contactIdList, room) {
    if (contactIdList.length <= 0) {
        return '';
    }
    const uniqIdList = [...new Set([...contactIdList])];
    const contactList = uniqIdList.map(id => room.wechaty.Contact.load(id));
    await Promise.all(contactList.map(c => c.ready()));
    const contactNameList = contactList.map(c => c.name());
    const roomAliasListFuture = contactList.map(c => room.alias(c));
    const roomAliasList = await Promise.all(roomAliasListFuture);
    const mentionList = contactNameList.map((name, i) => roomAliasList[i] ? roomAliasList[i] : name);
    const mentionText = '@' + mentionList.join(' @');
    return mentionText;
}
export { getMustacheView, };
//# sourceMappingURL=mustache-view.js.map