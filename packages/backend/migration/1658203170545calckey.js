export class calckey1658203170545 {
		name = 'calckey1658203170545'

		async up(queryRunner) {
				await queryRunner.query(`UPDATE meta SET "useStarForReactionFallback" = TRUE;`);
				await queryRunner.query(`UPDATE meta SET "repositoryUrl" = 'https://codeberg/thatonecalculator/calckey'`);
				await queryRunner.query(`UPDATE meta SET "feedbackUrl" = 'https://codeberg/thatonecalculator/calckey/issues'`);
		}

		async down(queryRunner) {
				await queryRunner.query(`UPDATE meta SET "useStarForReactionFallback" = FALSE;`);
				await queryRunner.query(`UPDATE meta SET "repositoryUrl" = 'https://codeberg/thatonecalculator/calckey'`);
				await queryRunner.query(`UPDATE meta SET "feedbackUrl" = 'https://codeberg/thatonecalculator/calckey/issues'`);
		}
}
