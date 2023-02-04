import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'teams'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name',255).notNullable().unique();

      table.string('image',255).nullable().defaultTo('/uploads/teams/profileImage/default.png');

      table.string('about',355).nullable();

      table.integer('author_id').unsigned().references('users.id');

      table.boolean('is_active').notNullable().defaultTo(true);

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
