import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateLocaleTable1500000000002 implements MigrationInterface {

    private table = new Table({
        name: 'locale',
        columns: [
            {
                name: 'id',
                type: 'serial',
                isPrimary: true,
                isNullable: false,
            }, {
                name: 'name',
                type: 'varchar',
                isPrimary: false,
                isNullable: false,
            }, {
                name: 'code',
                type: 'varchar',
                isPrimary: false,
                isNullable: false,
            },
        ],
    });

    private locale = new TableColumn({
        name: 'locale_id',
        type: 'integer',
        isPrimary: false,
        isNullable: false,
        default: 1,
    });

    private tableForeignKeyFromLocaleIdToUser= new TableForeignKey({
        name: 'fk_from_user_to_locale_id',
        columnNames: ['locale_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'locale',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table);
        await queryRunner.query(`ALTER TABLE "${this.table.name}"
            ADD CONSTRAINT "constraint_name_and_code_unique_from_locale" UNIQUE("name", "code")`);
        await queryRunner.query(
            `insert into ${this.table.name} (id, name, code) values ` +
            `(1, 'Russian', 'ru'), ` +
            `(2, 'English', 'en') `
        );
        await queryRunner.addColumn('user', this.locale);
        await queryRunner.createForeignKey('user', this.tableForeignKeyFromLocaleIdToUser);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', this.locale);
        await queryRunner.dropTable(this.table);
    }
}
