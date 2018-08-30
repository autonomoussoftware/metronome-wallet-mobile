import crypto from 'crypto'

export const sha256 = data =>
  crypto.createHash('sha256').update(data).digest('hex')
