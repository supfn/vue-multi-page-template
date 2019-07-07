let chalk = require('chalk');
let semver = require('semver');
let packageConfig = require('../package.json');
let shell = require('shelljs');

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}

function checkVersion() {
  const warnings = [];
  const versionRequirements = [
    {
      name: 'node',
      currentVersion: semver.clean(process.version),
      versionRequirement: packageConfig.engines.node
    }
  ];

  if (shell.which('npm')) {
    versionRequirements.push({
      name: 'npm',
      currentVersion: exec('npm --version'),
      versionRequirement: packageConfig.engines.npm
    });
  }

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i];
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      );
    }
  }

  if (warnings.length) {
    console.log(chalk.yellow('\nTo use this template, you must update following to modules:\n'));
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i];
      console.log(`  ${warning}\n`);
    }
    process.exit(1);
  }
}

module.exports = checkVersion;
