/* eslint-disable no-console */
/* eslint-env node */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const I18NUtil = require('./I18NUtil.js');

const srcDirectory = process.argv[2];
const langDirectory = process.argv[3];
const outputPath = process.argv[4];

console.log('Beginning to diff language files...(it may not be accurate, but it\'s something)');
console.log('...Finding source files...');
I18NUtil.getMatchedStringsInDirectory(srcDirectory, /I18N\.toString\('.*'\)/gm)
    .then(sourceResult =>
    {
        console.log('...Processing source files...');
        const prefix = 'I18N.toString(\'';
        const suffix = '\')';
        const sourceMap = new Map();
        for(const file of sourceResult.keys())
        {
            const strings = sourceResult.get(file);
            for(const string of strings)
            {
                const entityName = string.substring(prefix.length, string.length - suffix.length);
                if (sourceMap.has(entityName))
                {
                    sourceMap.get(entityName).push(file);
                }
                else
                {
                    sourceMap.set(entityName, [file]);
                }
            }
        }

        console.log('...Finding language files...');
        I18NUtil.getMatchedStringsInDirectory(langDirectory, /^[^(//)#].+/gm)
            .then(langResult =>
            {
                console.log('...Processing language files...');
                const langMap = new Map();
                for(const lang of langResult.keys())
                {
                    const fileIndex = lang.lastIndexOf('/');
                    const extIndex = lang.lastIndexOf('.');
                    const langCode = lang.substring(fileIndex + 1, extIndex);
                    const strings = langResult.get(lang);
                    const result = new Map();
                    for(const string of strings)
                    {
                        const entityIndex = string.indexOf('=');
                        const entityName = string.substring(0, entityIndex).trim();
                        const localizedString = string.substring(entityIndex + 1).trim();
                        result.set(entityName, localizedString);
                    }
                    langMap.set(langCode, result);
                }

                console.log('...Diffing...');

                // Output data
                const output = [];
                output.push('# Internationalization Diff');
                output.push(`_Generated on ${new Date().toString()} in '${srcDirectory}'_`);
                output.push('');
                output.push('');
                output.push('');

                for(const langCode of langMap.keys())
                {
                    const stringMap = langMap.get(langCode);
                    output.push(`## ${langCode}`);
                    const statIndex = output.length;
                    output.push('');
                    let unusedCount = 0;
                    for(const entityName of stringMap.keys())
                    {
                        if (!sourceMap.has(entityName))
                        {
                            if (unusedCount <= 0)
                            {
                                output.push('### Not Used');
                            }
                            output.push(entityName);
                            ++unusedCount;
                        }
                    }
                    let missingCount = 0;
                    for(const entityName of sourceMap.keys())
                    {
                        if (!stringMap.has(entityName))
                        {
                            if (missingCount <= 0)
                            {
                                output.push('### Not Found');
                            }
                            output.push(`// ${sourceMap.get(entityName).join(', ')}`);
                            output.push(entityName);
                            ++missingCount;
                        }
                    }
                    output.push('');
                    output[statIndex] = `Found ${unusedCount} unused entries and ${missingCount} missing entries from file.`;
                }

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
    });
