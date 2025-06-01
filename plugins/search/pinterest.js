import { pinterest } from '../../lib/scrape.js'
			
let handler = async (m, { conn, text, usedPrefix, command, isPrems }) => {
	if (!text) throw `Example : ${usedPrefix + command} spongebob`
	try {
		let anu = await (await fetch(`https://fastrestapis.fasturl.cloud/search/pinterest/simple?name=${text}`)).json()
		await conn.sendMsg(m.chat, { react: { text: '🔍', key: m.key } })
		if (anu.status != 200) return m.reply('not found')
		anu = anu.result.getRandom()
		await conn.sendFile(m.chat, anu.directLink, '', anu.title || `*Search : ${text.trim()}*`, m)
	} catch (e) {
		console.log(e)
		m.reply('media tidak ditemukan')
	}
}

handler.help = ['pinterest <teks>']
handler.tags = ['searching']
handler.command = /^(pin(terest2?)?)$/i

export default handler