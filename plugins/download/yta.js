import { ytdl, ytdl2 } from '../../lib/scrape.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!args[0]) throw `Example: ${usedPrefix + command} https://youtu.be/zcRGPmEawmk`
	if (!args[0].match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))) return m.reply(`Invalid Youtube URL.`)
	await conn.sendMsg(m.chat, { react: { text: '⌛', key: m.key } })
	try {
		let anu = await (await fetch('https://api.siputzx.my.id/api/d/ytmp3?url='+args[0])).json()
		if (anu.error) {
			let anu = await (await fetch('https://api.siputzx.my.id/api/dl/youtube/mp3?url='+args[0])).json()
			if (!anu.error) await conn.sendFile(m.chat, anu.data, 'unnamed.mp3', '', m, false, { mimetype: 'audio/mpeg' })
			else m.reply(anu.error)
		} else await conn.sendFile(m.chat, anu.data.dl, anu.data.title+'.mp3', '', m, false, { mimetype: 'audio/mpeg' })
	} catch (e) {
		console.log(e)
		m.reply(e.message)
	}
}

handler.menudownload = ['ytaudio <url>']
handler.tagsdownload = ['search']
handler.command = /^(yt(a(udio)?|mp3))$/i

handler.premium = true
handler.limit = true

export default handler