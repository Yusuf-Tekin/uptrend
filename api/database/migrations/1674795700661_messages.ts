import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('message').notNullable();

      table.integer('author_id').notNullable().unsigned().references('users.id').onDelete('CASCADE');
      table.integer('team_id').notNullable().unsigned().references('teams.id').onDelete('CASCADE');

      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
