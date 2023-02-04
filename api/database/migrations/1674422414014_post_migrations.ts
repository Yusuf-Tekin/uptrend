import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import TeamRoles from 'App/Helper/Enums/TeamRoles';

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('author_id').unsigned().references('users.id').onDelete('CASCADE');

      table.integer('team_id').unsigned().references('teams.id').onDelete('CASCADE');

      table.string('post_text',255).nullable();

      table.enum('role',Object.values(TeamRoles)).notNullable();

      table.boolean('is_comments').defaultTo(true).notNullable();

      table.boolean('is_open').defaultTo(true).notNullable();

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
