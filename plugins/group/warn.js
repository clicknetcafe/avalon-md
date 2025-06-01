import db from '../../lib/database.js'
import { delay } from '../../lib/func.js'

function remM(text) {
	const regex = /@\d+(@g\.us)?/g
	return text.replace(regex, '')
}

let handler = async (m, { conn, command, text, isOwner, isAdmin, isBotAdmin, participants }) => {
	let warn = db.data.chats[m.chat].warn
	let user = m.quoted?.sender ? m.quoted.sender : m.mentionedJid?.[0] ? m.mentionedJid[0] : /cek/.test(command) ? m.sender : ''
	if (!user) return m.reply('siapa yang mau diwarn ?')
	if (m.sender == user && !/cek/.test(command)) return m.reply('siapa yang mau diwarn ?')
	let ow = db.data.datas
	let data = [conn.user.jid.split('@')[0], ...global.mods, ...ow.rowner.map(v => v[0]), ...ow.owner.map(v => v[0])].map(v => v + '@s.whatsapp.net')
	if (data.includes(user) && !/cek/.test(command)) return m.reply(isOwner ? 'owner kekebalan tubuh' : '🥴 gaboleh gitu ama owner.')
	let split = user.split('@')[0]
	if (!warn[user]) warn[user] = {
		count: 0,
		alasan: remM(text || '')
	}
	let usr = db.data.chats[m.chat].warn[user]
	let txt = `*user:* @${split}\n*warn:* (${usr.count}/3)${usr.alasan ? `\n*alasan:* ${usr.alasan}` : ''}`
	if (!/cek/.test(command)) {
		if (!isAdmin) return m.reply(`*「ADMIN GROUP ONLY」*`)
		let count = usr.count
		if (/del|un/.test(command)) {
			if (usr.count > 0) usr.count -= count
		} else {
			if (usr.count < 3) usr.count += 1
			usr.alasan = remM(text || '')
		}
		let par = participants.find(v => v.id == user)
		par = par?.admin || ''
		txt = `${/del|un/.test(command) ? `*warn berkurang -${count}*` : /admin/.test(par) ? '*bisa-bisanya atmin kena warn* 🥴' : '*warn bertambah +1*'}\n\n*user:* @${split}\n*warn:* (${usr.count}/3)${usr.alasan ? `\n*alasan:* ${usr.alasan}` : ''}${usr.count >= 3 ? `\n\n⛔ user mencapai batas peringatan, ${isBotAdmin ? `akan segera dieksekusi.` : `tidak dapat meng-kick karena bot bukan atmin.`}` : ''}`
	}
	await conn.sendMsg(m.chat, { text: txt, mentions: conn.parseMention(txt) }, { quoted: m })
	if (isBotAdmin && usr.count >= 3) {
		delete db.data.chats[m.chat].warn[user]
		await delay(3500)
		await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
		await conn.reply(m.chat, `@${m.sender.split`@`[0]} telah mengeluarkan @${split} dari grup.`, fkontak, { mentions: [m.sender, user] })
	}
}

handler.menugroup = ['warn', 'cekwarn', 'unwarn']
handler.tagsgroup = ['group']
handler.command = /^((cek|del|un)?warn)$/i

handler.group = true

export default handler