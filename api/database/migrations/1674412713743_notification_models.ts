import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import NotificationTypes from 'App/Helper/Enums/NotificationTypes';

export default class extends BaseSchema {
  protected tableName = 'notifications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title',50).notNullable();
      table.string('content',255).notNullable();
      table.boolean('is_read').defaultTo(false).notNullable();
      
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');

      table.string('redirect_url',255).nullable();

      table.enum('type',Object.values(NotificationTypes)).notNullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
