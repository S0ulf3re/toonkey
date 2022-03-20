export class userIndexes1647777116829 {
    name = 'userIndexes1647777116829'

    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX "IDX_8977c6037a7bc2cb0c84b6d4db" ON "user" ("isSuspended") `);
        await queryRunner.query(`CREATE INDEX "IDX_391e03c755cc3dffa85d85536f" ON "user" ("isSilenced") `);
        await queryRunner.query(`CREATE INDEX "IDX_b2033a3235871353c93700a0b6" ON "user" ("isAdmin") `);
        await queryRunner.query(`CREATE INDEX "IDX_dfb7b092897e7b354f73e7ae25" ON "user" ("isModerator") `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_dfb7b092897e7b354f73e7ae25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2033a3235871353c93700a0b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_391e03c755cc3dffa85d85536f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8977c6037a7bc2cb0c84b6d4db"`);
    }
}
