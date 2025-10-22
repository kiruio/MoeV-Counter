import { getNum, setNumMulti } from './db.js'
import { logger } from './utils.js'

let cacheCounter: Record<string, number> = {}
const enablePushDelay = Number(process.env.DB_INTERVAL || 30)
let needPush = false
if (enablePushDelay) setInterval(() => { needPush = true }, 1000 * enablePushDelay)

async function pushDB() {
	if (Object.keys(cacheCounter).length === 0) return
	if (enablePushDelay && !needPush) return
	try {
		needPush = false
		logger.info('pushDB', cacheCounter)
		const counters: Array<{ name: string; num: number }> = Object.keys(cacheCounter).map((key) => ({ name: key, num: cacheCounter[key]! }))
		await setNumMulti(counters)
		cacheCounter = {}
	} catch (error) {
		logger.error('pushDB error:', error)
	}
}

export async function getCountByName(name: string, num?: number) {
	const defaultCount = { name, num: 0 }
	if (name === 'demo') return { name, num: '0123456789' as any }
	if ((num ?? 0) > 0) return { name, num: num as any }
	try {
		if (!(name in cacheCounter)) {
			const counter = (await getNum(name)) as any
			cacheCounter[name] = Number(counter?.num ?? 0) + 1
		} else {
			cacheCounter[name] = (cacheCounter[name] ?? 0) + 1
		}
		pushDB()
		return { name, num: cacheCounter[name] }
	} catch (error) {
		logger.error('get count by name error:', error)
		return defaultCount
	}
}


