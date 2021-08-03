const { Telegraf, Telegram } = require("telegraf")
const config = require("./config")
const {
	arrEnd,
	log,
	shouldByAnonymized,
	trimMessage,
} = require("./utils")
const telegram = new Telegram(config.BOT_TOKEN)
const bot = new Telegraf(config.BOT_TOKEN)

const typeParamsMap = {
	animation: "sendAnimation",
	audio: "sendAudio",
	photo: "sendPhoto",
	video: "sendVideo",
	video_note: "sendVideoNote",
	document: "sendDocument",
}

bot.catch((err, ctx) => {
	log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

bot.on("channel_post", (ctx, next) => {
	const chatId = ctx.chat.id
	const message = ctx.update.channel_post
	const types = Object.keys(typeParamsMap)
	log("New channel post. chat_id:", chatId)


	if (
		shouldByAnonymized(message) &&
		Object.keys(message).some(key => types.includes(key))
	) {
		telegram.deleteMessage(chatId, message.message_id)
		for (const type of types) {
			if (message[type]) {
				telegram[typeParamsMap[type]](chatId, type === "photo" ? arrEnd(message[type]).file_id : message[type].file_id)
				break
			}
		}
	}
})

bot.start(async ctx => {
	ctx.reply(trimMessage(`
		👋 Hi

		🕵️‍♂️ I will anonymize your channel forwards. Add me to your channel as an administrator and give me permission to delete and publish posts. Then you can simply forward posts from other channels to your channel.

		⚠ The bot does not save the text of the original post, but only extracts a photo, video, gif, audio or document and publishes on behalf of the channel.

		👨‍💻 Github: https://github.com/mikhailsdv/forward-anonymizer-bot
	`))
})

bot.launch()

/*
commands
start - 😎 Start
*/