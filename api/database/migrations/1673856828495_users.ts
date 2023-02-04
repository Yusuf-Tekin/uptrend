import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Helper/Enums/Roles';

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')


      table.string('fullname',255).notNullable();

      table.string('username',255).notNullable().unique();
      table.string('email',255).notNullable().unique();
      table.string('password',255).notNullable().checkLength('>=',6);

      table.string('profile_image',255).defaultTo('/profile_image/default.png');
      table.boolean('is_block').defaultTo(false).notNullable();
      table.boolean('is_verify').defaultTo(false).notNullable();

      table.enum('role',Object.values(Roles)).notNullable().defaultTo('USER');

      table.string('reset_password_token').nullable();
      table.timestamp('reset_password_expired',{useTz:true}).nullable();

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
