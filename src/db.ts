import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const mongodbURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
let isConnected = false

export async function initDB() {
	if (isConnected) return
	await mongoose.connect(mongodbURL)
	isConnected = true
}

const countSchema = new Schema({
	name: { type: String, required: true },
	num: { type: Number, required: true }
}, { collection: 'tb_count', versionKey: false })

type Count = InferSchemaType<typeof countSchema>

const CountModel = mongoose.connection.model<Count>('Count', countSchema)

export function getNum(name: string) {
	return CountModel.findOne({ name }, '-_id').lean().exec()
}

export function getAll() {
	return CountModel.find({}, '-_id').lean().exec()
}

export function setNum(name: string, num: number) {
	return CountModel.findOneAndUpdate(
		{ name },
		{ name, num },
		{ upsert: true }
	).exec()
}

export function setNumMulti(counters: Array<{ name: string; num: number }>) {
	const bulkOps = counters.map(({ name, num }) => ({
		updateOne: { filter: { name }, update: { name, num }, upsert: true }
	}))
	return CountModel.bulkWrite(bulkOps, { ordered: false })
}


