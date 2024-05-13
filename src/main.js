import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import config from 'config'
import { chatGPT } from './chatgpt.js'
import { create } from './notion.js'
import { Loader } from './loader.js'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
	handlerTimeout: Infinity,
})

bot.command('start', ctx => {
	ctx.reply('Добро пожаловать! 👋')

	setTimeout(() => {
		ctx.reply(
			'Я - 🤖 Бот, который поможет тебе придумать креативный пет-проект или бизнес идею'
		)
	}, 1500)

	setTimeout(() => {
		ctx.reply('Отправьте текстовое сообщение с тезисами про идею или проект')
	}, 2500)
})

bot.on(message('text'), async ctx => {
	try {
		const text = ctx.message.text
		if (!text.trim()) ctx.reply('Текст не может быть пустым')

		const loader = new Loader(ctx)
		loader.show()

		const response = await chatGPT(text)

		if (!response) return ctx.reply('Ошибка с API', response)

		const notionResponse = await create(text, response.content)

		loader.hide()

		ctx.reply(`Вот что я придумал:

${response.content}`)

		setTimeout(() => {
			ctx.reply(`💾 Сохранил идею в твой Notion: ${notionResponse.url}`)
		}, 2000)
	} catch (e) {
		console.log('Произошла ошибка с ', e.message)
	}
})

bot.launch()
