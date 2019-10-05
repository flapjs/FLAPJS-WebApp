/* eslint-disable no-console */
/* eslint-env node */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const I18NUtil = require('./I18NUtil.js');

const srcDirectory = process.argv[2];
const outputPath = process.argv[3];

console.log('Beginning to log used language strings...(it may not be accurate, but it\'s something)');
I18NUtil.getMatchedStringsInDirectory(srcDirectory, /I18N\.toString\(.*\)/gm)
    .then(result =>
    {
        // Finished reading all files!
        const prefix = 'I18N.toString(\'';
        const suffix = '\')';

        const output = [];
        output.push('# Internationalization Log');
        output.push(`_Generated on ${new Date().toString()} in '${srcDirectory}'_`);
        output.push('');
        output.push('');
        output.push('');

        let count = 0;
        for(const file of result.keys())
        {
            output.push(`## ${file}`);
            for(const string of result.get(file))
            {
                const s = string.substring(prefix.length, string.length - suffix.length);
                ++count;
                output.push(s);
            }
            output.push('');
        }

        output[2] = `_Found ${count} entries in ${result.size} files!_`;

        if (outputPath)
        {
            mkdirp(path.dirname(outputPath), (err) =>
            {
                if (err) throw err;

                fs.writeFile(outputPath, output.join('\n'), (err) =>
                {
                    if (err) throw err;
                });
            });
        }
        else
        {
            console.log(output.join('\n'));
        }
    });
