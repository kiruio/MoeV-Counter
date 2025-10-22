import type { Request, Response, NextFunction } from 'express'

function parseError(error: any) {
	const err = JSON.parse(error)[0]
	return { code: 400, message: `The field \`${err.path[0]}\` is invalid. ${err.message}` }
}

function validateInput(parseFn: any, input: any) {
	const result = parseFn(input)
	if (!result.success) return parseError(result.error)
	return null
}

export function ZodValid({ headers, params, query, body }: any) {
	return (req: Request, res: Response, next: NextFunction) => {
		const validations = [
			{ input: req.headers, parseFn: headers?.safeParse },
			{ input: req.params, parseFn: params?.safeParse },
			{ input: req.query, parseFn: query?.safeParse },
			{ input: req.body, parseFn: body?.safeParse },
		]
		for (const { input, parseFn } of validations) {
			if (parseFn) {
				const error = validateInput(parseFn, input)
				if (error) return res.status(400).send(error)
			}
		}
		next()
	}
}

export function cors({ allowOrigins = '*', allowMethods = 'GET, POST, PUT, DELETE' } = {}) {
	function isOriginAllowed(origin?: string) {
		if (!origin) return false
		if (Array.isArray(allowOrigins)) return allowOrigins.includes(origin)
		if (typeof allowOrigins === 'string') return allowOrigins === '*' || allowOrigins === origin
		return false
	}

	return (req: Request, res: Response, next: NextFunction) => {
		const origin = req.headers.origin as string | undefined
		if (origin && isOriginAllowed(origin)) {
			res.header('Access-Control-Allow-Origin', origin)
			res.header('Access-Control-Allow-Credentials', 'true')
		} else {
			return next()
		}

		if (req.method === 'OPTIONS') {
			const requestMethod = req.headers['access-control-request-method'] as string | undefined
			if (requestMethod) res.header('Access-Control-Allow-Methods', requestMethod)
			else res.header('Access-Control-Allow-Methods', allowMethods)
			const requestHeaders = req.headers['access-control-request-headers'] as string | undefined
			if (requestHeaders) res.header('Access-Control-Allow-Headers', requestHeaders)
			return res.sendStatus(204)
		}
		next()
	}
}


