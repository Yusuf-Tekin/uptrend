import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import TeamRoles from 'App/Helper/Enums/TeamRoles';

export default class extends BaseSchema {
  protected tableName = 'user_teams'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('users.id');
      table.integer('team_id').unsigned().references('teams.id');
      table.unique(['user_id','team_id'])
      table.timestamp('joined_at',{useTz:true});

      table.enum('role',Object.values(TeamRoles)).notNullable();

      table.boolean('is_confirmed').defaultTo(false).notNullable();

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
