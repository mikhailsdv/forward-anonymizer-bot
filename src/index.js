const { Telegraf, Telegram } = require("telegraf")
const config = require("./config")
const {
	arrEnd,
	log,
	shouldByAnonymized,
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

//bot.use(require("./middlewares/forwardWithText")())
//bot.use(require("./middlewares/mediaGroup")())
//bot.use(require("./middlewares/gif"))


/*bot.on("channel_post", (ctx, next) => {
	const message = ctx.message
	console.log(message)
	//const message = ctx.message
	//if (message?.via_bot?.id !== config.BOT_ID) next();
	//next()
})*/

bot.on("channel_post", (ctx, next) => {
	const chatId = ctx.chat.id
	const message = ctx.update.channel_post
	const types = Object.keys(typeParamsMap)

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

bot.catch((err, ctx) => {
	log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

bot.start(async ctx => {
	//ctx.reply("works")
})

bot.command("donate", ctx => {
	log("Command /donate")
	//return ctx.replyWithMarkdown(phrases.donate)
})

bot.command("hints", ctx => {
	log("Command /hints")
	//return ctx.replyWithMarkdown(phrases.hints)
})

/*bot.on("forward_with_text", ctx => {
	const chatId = ctx.chat.id
	const {text, media, media_group_id, tags_message_id} = ctx.forwardWithText

	if (media_group_id) {
		media.forEach(mediaItem => {
			saveFile({
				chat_id: chatId,
				type: mediaItem.type,
				file_size: mediaItem.file_size,
				file_id: mediaItem.file_id,
				file_unique_id: mediaItem.file_unique_id,
				height: mediaItem.height,
				width: mediaItem.width,
				tags: text,
				file_message_id: mediaItem.message_id,
				tags_message_id: tags_message_id,
				media_group_id: media_group_id,
			})
		})

		ctx.replyWithMarkdown(
			phrases.saved_plural_own_caption, {
				"reply_to_message_id": media[0].message_id,
				"reply_markup": {
					"inline_keyboard": [
						[{
							"text": phrases.button_delete_plural,
							"callback_data": ["delete_media_group", media_group_id].join(",")
						}],
						inlineShareButton,
					]
				},
			}
		)
	}
	else {
		const mediaItem = media[0]
		saveFile({
			chat_id: chatId,
			type: mediaItem.type,
			file_size: mediaItem.file_size,
			file_id: mediaItem.file_id,
			file_unique_id: mediaItem.file_unique_id,
			height: mediaItem.height,
			width: mediaItem.width,
			tags: text,
			file_message_id: mediaItem.message_id,
			tags_message_id: tags_message_id,
		})

		ctx.replyWithMarkdown(
			phrases.saved_single_own_caption, {
				"reply_to_message_id": mediaItem.message_id,
				"reply_markup": {
					"inline_keyboard": [
						[{
							"text": phrases.button_delete_single,
							"callback_data": ["delete", mediaItem.message_id].join(",")
						}],
						inlineShareButton,
					]
				},
			}
		)
	}
})

bot.on("media_group", ctx => {
	const chatId = ctx.chat.id
	const {text, media, media_group_id} = ctx.mediaGroup
	
	media.forEach(mediaItem => {
		saveFile({
			chat_id: chatId,
			type: mediaItem.type,
			file_size: mediaItem.file_size,
			file_id: mediaItem.file_id,
			file_unique_id: mediaItem.file_unique_id,
			height: mediaItem.height,
			width: mediaItem.width,
			tags: text,
			file_message_id: mediaItem.message_id,
			tags_message_id: mediaItem.message_id,
			media_group_id: media_group_id,
		})
	})

	ctx.replyWithMarkdown(
		text ? phrases.saved_plural_own_caption : phrases.saved_plural_no_caption, {
			"reply_to_message_id": media[0].message_id,
			"reply_markup": {
				"inline_keyboard": [
					[{
						"text": phrases.button_delete_plural,
						"callback_data": ["delete_media_group", media_group_id].join(",")
					}],
					inlineShareButton,
				]
			},
		}
	)
})*/

/*bot.on(["photo", "video", "gif"], async ctx => {
	const types = [
		{
			name: "photo",
			extractMediaItem: message => arrEnd(message.photo),
		},
		{
			name: "video",
			extractMediaItem: message => message.video,
		},
		{
			name: "gif",
			extractMediaItem: message => message.animation || message.document,
		},
	]
	const message = ctx.message
	const chatId = ctx.chat.id
	const messageId = message.message_id
	const caption = message.caption
	const type = types.find(item => ctx.updateSubTypes.includes(item.name))
	const mediaItem = type.extractMediaItem(message)
	log(`New saved ${type.name}`)
	
	saveFile({
		chat_id: chatId,
		type: type.name,
		file_size: mediaItem.file_size,
		file_id: mediaItem.file_id,
		file_unique_id: mediaItem.file_unique_id,
		height: mediaItem.height,
		width: mediaItem.width,
		tags: caption,
		file_message_id: messageId,
		tags_message_id: messageId,
	})

	ctx.replyWithMarkdown(
		caption ? phrases.saved_single_own_caption : phrases.saved_single_no_caption, {
			"reply_to_message_id": messageId,
			"reply_markup": {
				"inline_keyboard": [
					[{
						"text": phrases.button_delete_single,
						"callback_data": ["delete", messageId].join(",")
					}],
					inlineShareButton,
				]
			},
		}
	)
})*/

bot.launch()

/*start - 😎 Начать
hints - 💡 Советы
donate - 💸 Задонатить*/