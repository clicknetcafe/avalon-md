import db from '../../lib/database.js'

const {
	proto,
	generateWAMessage,
	areJidsSameUser
} = (await import('baileys')).default

export async function all(m, chatUpdate) {
	if (m.isBaileys) return
	if (!m.message || !m.msg?.fileSha256) return
	if (!(Buffer.from(m.msg.fileSha256).toString('base64') in db.data.sticker)) return

	let hash = db.data.sticker[Buffer.from(m.msg.fileSha256).toString('base64')]
	let { text, mentionedJid } = hash
	let messages = await generateWAMessage(m.chat, { text: text, mentions: mentionedJid }, {
		userJid: this.user.id,
		quoted: m.quoted && m.quoted.fakeObj
	})
	messages.key.fromMe = areJidsSameUser(m.sender, this.user.id || this.user.jid)
	messages.key.id = m.key.id
	messages.pushName = m.pushName
	if (m.isGroup) messages.participant = m.sender
	let msg = {
		...chatUpdate,
		messages: [proto.WebMessageInfo.fromObject(messages)].map(this.serializeM),
		type: 'append'
	}
	this.ev.emit('messages.upsert', msg)
}
