import chalk from 'chalk';
import commander from 'commander';
import * as glob from 'glob';
import { basename, join } from 'path';
import { runSeeder, useSeeding } from 'typeorm-seeding';

// Cli helper
commander
    .version('1.0.0')
    .description('Run database seeds of your project')
    .option('--run <seeds>', 'run specific seeds (file names without extension)', (val) => val.split(','))
    .parse(process.argv);

// Get cli parameter for a different seeds path
const seedsPath = (commander.seeds)
    ? commander.seeds
    : ['src/database/seeds/**/*{.js,.ts}'];

// Get a list of seeds
const listOfSeeds = (commander.run)
    ? commander.run.map(l => l.trim()).filter(l => l.length > 0)
    : [];

function loadFiles(filePattern: string[]): string[] {
    const res =  filePattern
        .map(pattern => glob.sync(join(process.cwd(), pattern)))
        .reduce((acc, filePath) => acc.concat(filePath), []);
    return res;
}


const handleError = (error) => {
    console.log('AHHH');
    console.error(error);
    process.exit(1);
};

// Search for seeds and factories
const run = async () => {
    const log = console.log;
    let seedFiles;
    try {
        seedFiles = loadFiles(seedsPath);
    } catch (error) {
        return handleError(error);
    }

    // Filter seeds
    if (listOfSeeds.length > 0) {
        seedFiles = seedFiles.filter(sf => listOfSeeds.indexOf(basename(sf).replace('.ts', '')) >= 0);
    }

    // Status logging to print out the amount of factories and seeds.
    log(chalk.bold('seeds'));
    log('🔎 ', chalk.gray.underline(`found:`), chalk.blue.bold(`${seedFiles.length} seeds`));

    // Show seeds in the console
    await useSeeding();
    for (const seedFile of seedFiles) {
        try {
            let className = seedFile.split('/')[seedFile.split('/').length - 1];
            className = className.replace('.ts', '').replace('.js', '');
            className = className.split('-')[className.split('-').length - 1];
            log('\n' + chalk.gray.underline(`executing seed:  `), chalk.green.bold(`${className}`));
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const seedFileObject: any = require(seedFile);
            await runSeeder(seedFileObject['default']);
        } catch (error) {
            console.error('Could not run seed ', error);
            process.exit(1);
        }
    }

    log('\n👍 ', chalk.gray.underline(`finished seeding`));
    process.exit(0);
};

run();


