import yts from 'yt-search'
import { isUrl } from '../../lib/func.js'
import { ytdl, ytdl2, youtubeSearch } from '../../lib/scrape.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) throw `Example: ${usedPrefix + command} Sia Unstopable`
	let url = ''
	await conn.sendMsg(m.chat, { react: { text: '⌛', key: m.key } })
	if (!isUrl(text)) {
		try {
			let anu = await youtubeSearch(text)
			let f = anu.video.filter(v => !v.url.includes('@'))
			url = f[0].url
			if (!url) throw Error()
		} catch (e) {
			console.log(e)
			try {
				let anu = await yts(text)
				let f = anu.all.filter(v => !v.url.includes('@'))
				url = f[0].url
				if (!url) throw Error()
			} catch (e) {
				console.log(e)
				return m.reply(`Tidak ditemukan hasil.`)
			}
		}
	} else url = text
	if (!url) return
	try {
		let anu = await (await fetch(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${url}&quality=128kbps&server=auto`)).json()
		if (anu.status == 200) {
			anu = anu.result
			let txt = `*${anu.title}*\n\n⭔ Author : ${anu.author.name}\n⭔ Duration : ${anu.metadata.duration}\n⭔ Quality : ${anu.quality}`
			let msg = await conn.sendFile(m.chat, anu.media, anu.title+'.mp3', '', m, false, { mimetype: 'audio/mpeg' })
			await conn.reply(m.chat, txt, msg)
		} else throw Error(anu.error)
	} catch (e) {
		console.log(e)
		try {
			let anu = await (await fetch(`https://fastrestapis.fasturl.cloud/downup/ytdown-v1?url=${url}&format=mp3&quality=128&server=auto`)).json()
			if (anu.status == 200) {
				anu = anu.result
				let txt = `*${anu.title}*\n\n⭔ Author : ${anu.author.name}\n⭔ Duration : ${anu.metadata.duration}\n⭔ Quality : ${anu.quality}`
				let msg = await conn.sendFile(m.chat, anu.media, anu.title+'.mp3', '', m, false, { mimetype: 'audio/mpeg' })
				await conn.reply(m.chat, txt, msg)
			} else throw Error(anu.error)
		} catch (e) {
			console.log(e)
			m.reply(e.message)
		}
	}
}

handler.menudownload = ['ytplay <teks> / <url>']
handler.tagsdownload = ['search']
handler.command = /^(play|(play)?yt(play|dl)?)$/i

export default handler