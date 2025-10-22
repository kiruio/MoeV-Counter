export function randomArray<T>(arr: readonly [T, ...T[]]): T {
	const idx = Math.floor(Math.random() * arr.length)
	return arr[idx]!
}

export function toFixed(num: number, digits = 2): number {
	return parseFloat(Number(num).toFixed(digits))
}

type LogLevel = 'none' | 'error' | 'warn' | 'info' | 'debug'
const levels: LogLevel[] = ['none', 'error', 'warn', 'info', 'debug']
const current: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'debug'
const curIdx = levels.indexOf(current)

function build(level: Exclude<LogLevel, 'none'>) {
	return (...args: unknown[]) => {
		const idx = levels.indexOf(level)
		if (idx <= curIdx) (console as any)[level](...args)
	}
}

export const logger = {
	debug: build('debug'),
	info: build('info'),
	warn: build('warn'),
	error: build('error'),
}


