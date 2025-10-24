import serverless from '../apps/server/src/serverless/vercel'

export default async function handler(req: any, res: any) {
  return serverless(req, res)
}
