import type { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from '../apps/server/src/serverless/vercel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // @ts-ignore serverless-http has broad types
  return serverless(req, res)
}
