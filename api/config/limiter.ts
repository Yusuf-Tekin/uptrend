/**
 * Config source: https://bit.ly/3yXw6Tw
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import { limiterConfig } from '@adonisjs/limiter/build/config'

export default limiterConfig({
  default: 'db',
  stores: {
    db: {
      client: 'db',
      dbName: 'uptrend',
      tableName: 'rate_limits',
      connectionName: 'mysql',
      clearExpiredByTimeout: true,
    }
  }
})
