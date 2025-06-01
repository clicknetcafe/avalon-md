import db from '../../lib/database.js'
import { delay } from '../../lib/func.js'

export async function before(m, { text, isBotAdmin }) {
	if (!m.isGroup || !isBotAdmin) return !1
	if (!db.data.chats[m.chat]?.antitagsw) return !1
	let tagcount = db.data.chats[m.chat].tagcount
	if (m.message?.groupStatusMentionMessage ||
		m.message?.protocolMessage?.type === 25 ||
		m.message?.protocolMessage?.type === 'STATUS_MENTION_MESSAGE' ||
		m.mtype === 'groupStatusMentionMessage') {
		if (!tagcount[m.sender]) tagcount[m.sender] = 1
		else tagcount[m.sender] += 1
		await this.sendMsg(m.chat, { delete: { remoteJid: m.key.remoteJid, fromMe: false, id: m.key.id, participant: m.sender } })
		if (tagcount[m.sender] >= 3) {
			delete tagcount[m.sender]
			await this.reply(m.chat, `@${(m.sender || '')
				.replace(/@s\.whatsapp\.net/g, '')} 3x mentions = kick`, fkontak, { mentions: [m.sender] })
			await delay(3500)
			await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
		} else await this.reply(m.chat, `@${(m.sender || '')
			.replace(/@s\.whatsapp\.net/g, '')} *warn (${tagcount[m.sender]}/3)*\njangan tag grup kalau gk mau di kick!`, fkontak, { mentions: [m.sender] })
	}
	return !0
}