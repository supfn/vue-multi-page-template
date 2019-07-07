const Entry = require('./Entry.js');
const inquirer = require('inquirer');
const chalk = require('chalk');

function getEntries() {

  let entry = new Entry();
  let allEntries = entry.getAllEntries();
  let entries = {};
  if (process.env.NODE_ENV === 'production') {
    return new Promise((resolve => {
      const buildWayArr = [
        { type: 0, desc: 'compile none && exit', action: () => process.exit(0) },
        { type: 1, desc: 'compile all', action: entry.getAllEntries.bind(entry) },
        { type: 2, desc: 'compile changed', action: entry.getChangedEntries.bind(entry) },
        { type: 3, desc: 'compile single', action: entry.getSingleEntry.bind(entry) }
      ];

      console.log('Git changed file of src :');
      console.log(chalk.blue(entry.effectiveFiles.join('\n')), '\n');
      let optionTips = buildWayArr.map(item => `${item.type}: ${item.desc}`).join('\n');
      let suggestTips = '';
      if (entry.effectiveFiles && entry.effectiveFiles.length) {
        suggestTips = entry.hasCommonChange ? 'Has common changed,Suggest to input 1 compile all\n' : 'Suggest to input 2 compile changed\n';
      } else {
        suggestTips = 'Suggest input 0 to compile none && exit\n';
      }

      console.log(chalk.cyan('-------------------------'));
      console.log(chalk.cyan(optionTips), '\n');
      console.log(chalk.bgCyan(suggestTips));
      inquirer.prompt([
        {
          type: 'input',
          name: 'type',
          message: 'Please input compile type :'
        }
      ]).then(answers => {
        let type = ~~answers.type;
        let buildWay = buildWayArr.filter(item => item.type === type)[0];
        console.log('\nHas select to', chalk.greenBright(buildWay.desc), '...');
        if (type === 3) {
          console.log('All entries:', JSON.stringify(allEntries, null, 2));
          inquirer.prompt([
            {
              type: 'input',
              name: 'entryKey',
              message: 'Please input the key of all entries:'
            }
          ]).then(answers => {
            let entryKey = answers.entryKey;
            if (entryKey) {
              if (entryKey in allEntries) {
                entries = buildWay.action(entryKey);
                resolve(entries);
              } else {
                console.log(chalk.red('No this entry, process exit with 1'));
                process.exit(0);
              }
            } else {
              console.log(chalk.red('Cant input null, process exit with 1'));
              process.exit(0);
            }
          });
        } else {
          entries = buildWay.action();
          resolve(entries);
        }
      });
    }));
  } else {
    return allEntries;
  }
}

module.exports = getEntries;

