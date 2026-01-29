import { Pool, PoolClient, QueryResult, PoolConfig, QueryResultRow } from "pg"

interface PostgresConfig extends PoolConfig {
  max?: number
  idleTimeoutMillis?: number
  connectionTimeoutMillis?: number
}

class PostgresClient {
  private pool: Pool
  private client: PoolClient | null

  constructor(config: PostgresConfig = {}) {
    const useSSL = process.env.POSTGRESSQL_SSL === "true"

    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: config.max || 10,
      idleTimeoutMillis: config.idleTimeoutMillis || 30000,
      connectionTimeoutMillis: config.connectionTimeoutMillis || 10000,
      ...(useSSL && {
        ssl: { rejectUnauthorized: false },
      }),
      ...config,
    })
    this.client = null
  }

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = await this.pool.connect()
      console.log("✅ Connected to PostgreSQL")
    }
  }

  async query<T extends QueryResultRow = any>(
    queryText: string,
    params: any[] = [],
  ): Promise<QueryResult<T>> {
    if (!this.client) {
      throw new Error("❌ There is no active connection to PostgreSQL")
    }
    return await this.client.query<T>(queryText, params)
  }

  async insert<T extends QueryResultRow = any>(
    table: string,
    columns: string[],
    values: any[],
  ): Promise<QueryResult<T>> {
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")
    const queryText = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`
    return await this.query<T>(queryText, values)
  }

  async countDocuments(
    table: string,
    condition: string = "1=1",
    params: any[] = [],
  ): Promise<number | string> {
    const queryText = `SELECT COUNT(*) FROM ${table} WHERE ${condition}`
    const result = await this.query<any>(queryText, params)
    return result.rows[0].count
  }

  async getRowsBy(
    table: string,
    field: string = "id",
    params: any[] = [],
  ): Promise<string[]> {
    const queryText = `SELECT ${field} FROM ${table}`
    const { rows } = await this.query<any>(queryText, params)
    return rows.map((row) => row[field].toString())
  }

  async find<T extends QueryResultRow = any>(
    table: string,
    condition: string = "1=1",
    params: any[] = [],
  ): Promise<QueryResult<T>> {
    const queryText = `SELECT * FROM ${table} WHERE ${condition}`
    return await this.query<T>(queryText, params)
  }

  async update<T extends QueryResultRow = any>(
    table: string,
    updates: Record<string, any>,
    condition: string,
    conditionParams: any[],
  ): Promise<QueryResult<T>> {
    const keys = Object.keys(updates)
    const setColumns = keys.map((key, i) => `${key} = $${i + 1}`).join(", ")

    const queryText = `UPDATE ${table} SET ${setColumns} WHERE ${condition} RETURNING *`
    return await this.query<T>(queryText, [
      ...Object.values(updates),
      ...conditionParams,
    ])
  }

  async delete<T extends QueryResultRow = any>(
    table: string,
    condition: string,
    params: any[],
  ): Promise<QueryResult<T>> {
    const queryText = `DELETE FROM ${table} WHERE ${condition} RETURNING *`
    return await this.query<T>(queryText, params)
  }

  async close(): Promise<void> {
    if (this.client) {
      this.client.release()
      console.log("🔴 PostgreSQL connection closed")
      this.client = null
    }
    await this.pool.end()
  }
}

export default PostgresClient
