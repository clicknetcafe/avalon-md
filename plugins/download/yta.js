import { ytdl, ytdl2 } from '../../lib/scrape.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!args[0]) throw `Example: ${usedPrefix + command} https://youtu.be/zcRGPmEawmk`
	if (!args[0].match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))) return m.reply(`Invalid Youtube URL.`)
	await conn.sendMsg(m.chat, { react: { text: '⌛', key: m.key } })
	try {
		let anu = await (await fetch(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${args[0]}&quality=128kbps&server=auto`)).json()
		if (anu.status == 200) {
			anu = anu.result
			let txt = `*${anu.title}*\n\n⭔ Author : ${anu.author.name}\n⭔ Duration : ${anu.metadata.duration}\n⭔ Quality : ${anu.quality}`
			let msg = await conn.sendFile(m.chat, anu.media, anu.title+'.mp3', '', m, false, { asDocument: /mp3/.test(command) ? true : false, mimetype: 'audio/mpeg' })
			await conn.reply(m.chat, txt, msg)
		} else throw Error(anu.error)
	} catch (e) {
		console.log(e)
		try {
			let anu = await (await fetch(`https://fastrestapis.fasturl.cloud/downup/ytdown-v1?url=${args[0]}&format=mp3&quality=128&server=auto`)).json()
			if (anu.status == 200) {
				anu = anu.result
				let txt = `*${anu.title}*\n\n⭔ Author : ${anu.author.name}\n⭔ Duration : ${anu.metadata.duration}\n⭔ Quality : ${anu.quality}`
				let msg = await conn.sendFile(m.chat, anu.media, anu.title+'.mp3', '', m, false, { asDocument: /mp3/.test(command) ? true : false, mimetype: 'audio/mpeg' })
				await conn.reply(m.chat, txt, msg)
			} else throw Error(anu.error)
		} catch (e) {
			console.log(e)
			m.reply(e.message)
		}
	}
}

handler.menudownload = ['ytaudio <url>']
handler.tagsdownload = ['search']
handler.command = /^(yt(a(udio)?|mp3))$/i

handler.premium = true
handler.limit = true

export default handler