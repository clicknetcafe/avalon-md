import { cSize } from '../../lib/func.js'
import { ytdl, ytdl2 } from '../../lib/scrape.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!(args[0] || '').match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:post)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))) return m.reply(`Invalid Youtube post URL.`)
	await conn.sendMsg(m.chat, { react: { text: '⌛', key: m.key } })
	if (/post/.test(command)) {
		try {
			let anu = await (await fetch(`https://api.siputzx.my.id/api/d/ytpost?url=${args[0]}`)).json()
			if (!anu.error) {
				anu = anu.data
				for (let x of anu.images) await conn.sendFile(m.chat, x)
				await m.reply(anu.content)
			} else m.reply(anu.error)
		} catch (e) {
			console.log(e)
			m.reply(e.message)
		}
	} else {
		let qua = /480/.test(command) ? '480' : /720/.test(command) ? '720' : '1080'
		try {
			let anu = await (await fetch('https://fastrestapis.fasturl.cloud/downup/ytmp4?url='+args[0]+`&quality=${qua}&server=auto`)).json()
			if (anu.status != 200) return m.reply(anu.error)
			anu = anu.result
			let txt = `*${anu.title}*\n\n`
			txt += `⭔ Watch : ${args[0]}\n`
			txt += `⭔ Quality (${anu.quality})`
			await conn.sendFile(m.chat, anu.media, anu.title+'.mp4', txt, m)
		} catch (e) {
			console.log(e)
			try {
				let anu = await (await fetch(`https://fastrestapis.fasturl.cloud/downup/ytdown-v1?url=${args[0]}&format=mp4&quality=${qua}&server=auto`)).json()
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
}

handler.menudownload = ['ytpost','ytv480','ytv720','ytv1080'].map(v => v+' <url>')
handler.tagsdownload = ['search']
handler.command = /^(ytpost|ytv(ideo)?(480|720|1080)p?)$/i

handler.premium = true
handler.limit = true

export default handler