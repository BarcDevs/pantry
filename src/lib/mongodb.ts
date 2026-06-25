import mongoose from 'mongoose'

import env from '@/config/env'

type MongooseGlobal = typeof globalThis & {
    mongooseConnection?: Promise<typeof mongoose>
}

const globalWithMongoose = globalThis as MongooseGlobal

const connectToDatabase = () => {
    if (!globalWithMongoose.mongooseConnection) {
        globalWithMongoose.mongooseConnection = mongoose.connect(env.mongodbUri).catch((err) => {
            globalWithMongoose.mongooseConnection = undefined
            return Promise.reject(err)
        })
    }
    return globalWithMongoose.mongooseConnection
}

export default connectToDatabase
