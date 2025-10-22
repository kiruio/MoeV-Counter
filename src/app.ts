import express from 'express'
import compression from 'compression'
import { z } from 'zod'
import { initDB } from './db.js'
import { themeList, getCountImage } from './themify.js'
import { cors, ZodValid } from './middleware.js'
import { randomArray, logger } from './utils.js'
import { getCountByName } from './counter.js'
import path from 'path'

await initDB()

const app = express()
app.use(express.static(path.resolve(process.cwd(), 'assets')))
app.use(compression())
app.use(cors())
app.set('view engine', 'pug')
app.set('views', path.resolve(process.cwd(), 'views'))

app.get('/', (req, res) => {
	const site = process.env.APP_SITE || `${req.protocol}://${req.get('host')}`
	const ga_id = process.env.GA_ID || null
	res.render('index', { site, ga_id, themeList })
})

app.get(['/@:name', '/get/@:name'],
	ZodValid({
		params: z.object({ name: z.string().max(32) }),
		query: z.object({
			theme: z.string().default('moebooru'),
			padding: z.coerce.number().int().min(0).max(16).default(7),
			offset: z.coerce.number().min(-500).max(500).default(0),
			align: z.enum(['top', 'center', 'bottom']).default('top'),
			scale: z.coerce.number().min(0.1).max(2).default(1),
			pixelated: z.enum(['0', '1']).default('1'),
			darkmode: z.enum(['0', '1', 'auto']).default('auto'),
			num: z.coerce.number().int().min(0).max(1e15).default(0),
			prefix: z.coerce.number().int().min(-1).max(999999).default(-1),
		})
	}),
	async (req, res) => {
		const { name } = req.params as { name: string }
		let { theme = 'moebooru', num = 0, ...rest } = req.query as any
		res.set({ 'content-type': 'image/svg+xml', 'cache-control': 'max-age=0, no-cache, no-store, must-revalidate' })
		const data = await getCountByName(String(name), Number(num))
		if (name === 'demo') res.set('cache-control', 'max-age=31536000')
		if (theme === 'random') theme = randomArray(Object.keys(themeList) as unknown as [string, ...string[]])
		const renderSvg = getCountImage({ count: data.num, theme, ...(rest as any) })
		res.send(renderSvg)
		logger.debug(
			data,
			{ theme, ...(req.query as any) },
			`ip: ${String(req.headers['x-forwarded-for'] ?? (req.socket as any)?.remoteAddress ?? '')}`,
			`ref: ${req.get('Referrer') || null}`,
			`ua: ${req.get('User-Agent') || null}`
		)
	}
)

app.get('/record/@:name', async (req, res) => {
	const { name } = req.params as { name: string }
	const data = await getCountByName(name)
	res.json(data)
})

app.get('/heart-beat', (req, res) => {
	res.set('cache-control', 'max-age=0, no-cache, no-store, must-revalidate')
	res.send('alive')
	logger.debug('heart-beat')
})

const port = Number(process.env.PORT || 80)
app.listen(port, () => logger.info('Listening on', port))
