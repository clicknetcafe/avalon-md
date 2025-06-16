import { cSize } from '../../lib/func.js'
import { ytdl, ytdl2 } from '../../lib/scrape.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!(args[0] || '').match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))) return m.reply(`Invalid Youtube URL.`)
	await conn.sendMsg(m.chat, { react: { text: '⌛', key: m.key } })
	try {
		let anu = await (await fetch('https://fastrestapis.fasturl.cloud/downup/ytmp4?url='+args[0]+'&quality=360&server=auto')).json()
		if (anu.status == 200) {
			anu = anu.result
			let txt = `*${anu.title}*\n\n`
			txt += `⭔ Watch : ${args[0]}\n`
			txt += `⭔ Quality (${anu.quality})`
			await conn.sendFile(m.chat, anu.media, anu.title+'.mp4', txt, m)
		} else throw Error(anu.error)
	} catch (e) {
		console.log(e)
		try {
			let anu = await (await fetch(`https://fastrestapis.fasturl.cloud/downup/ytdown-v1?url=${args[0]}&format=mp4&quality=360&server=auto`)).json()
			if (anu.status == 200) {
				anu = anu.result
				let txt = `*${anu.title}*\n\n⭔ Views : ${anu.metadata.views}\n⭔ Duration : ${anu.metadata.duration}\n⭔ Quality : ${anu.quality}`
				await conn.sendFile(m.chat, anu.media, anu.title+'.mp4', txt, m)
			} else throw Error(anu.error)
		} catch (e) {
			console.log(e)
			m.reply(e.message)
		}
	}
}

handler.menudownload = ['ytvideo <url>']
handler.tagsdownload = ['search']
handler.command = /^(yt(v(ideo)?|mp4))$/i

handler.premium = true
handler.limit = true

export default handler