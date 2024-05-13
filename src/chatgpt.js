import OpenAI from 'openai'
import config from 'config'

const CHATGPT_MODEL = 'gpt-3.5-turbo-0125'

const ROLES = {
	ASSISTANT: 'assistant',
	SYSTEM: 'system',
	USER: 'user',
}

const openai = new OpenAI({
	apiKey: config.get('OPENAI_KEY'),
})

const getMessage = m => `
  Напиши на основе этих тезисов последовательную бизнес идею или пет-проект: ${m}

  Эти тезисы с описание ключевых моментов самого проекта или бизнес модели. 
  Необходимо в итоге получить готовую развернутую и доработанную бизнес модель или пет-проект, с которыми я мог бы выступить перед условными спонсорами и разработчиками. То есть в бизнес идеи или пет-проекте должен быть и план реализации и примерный план монетизации разработки.

  Текст не должен быть больше 1000 слов.
  Главное — чтобы была правильная последовательность и учитывался контекст.
`

export async function chatGPT(message = '') {
	const messages = [
		{
			role: ROLES.SYSTEM,
			content:
				'Ты опытный фронтенд разработчик, который придумывает креативные пет-проекты(js) и бизнес идеи.',
		},
		{ role: ROLES.USER, content: getMessage(message) },
	]
	try {
		const completion = await openai.chat.completions.create({
			messages,
			model: CHATGPT_MODEL,
		})

		console.log(completion.choices[0].message)
		return completion.choices[0].message
	} catch (e) {
		console.error('Error while chat completion', e.message)
	}
}
