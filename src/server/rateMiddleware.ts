import type { NextApiRequest, NextApiResponse } from "next";
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const getIP = (request: any) =>
  request.ip ||
  request.headers['x-forwarded-for'] ||
  request.headers['x-real-ip'] ||
  request.connection.remoteAddress

const limit = 5
const windowMs = 60 * 1_000
const delayAfter = Math.round(limit / 2)
const delayMs = 500

const rateLimitMiddlewares = [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
]

const applyMiddleware = (middleware: any) => (request: NextApiRequest, response: NextApiResponse) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result: any) =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  })

async function applyRateLimit(request: NextApiRequest, response: NextApiResponse) {
  await Promise.all(
    rateLimitMiddlewares
      .map(applyMiddleware)
      .map(middleware => middleware(request, response))
  )
}

export default applyRateLimit;
