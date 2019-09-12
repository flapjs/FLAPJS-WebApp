const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function getMatchedStringsInDirectory(dir, pattern)
{
    const result = await getFilesInDirectory(dir);
    if (!result.length) return Promise.resolve(new Map());
    return new Promise((resolve, reject) =>
    {
        const stringRegistry = new Map();
        let progress = 0;
        for (const filePath of result)
        {
            const dst = new Set();
            stringRegistry.set(filePath, dst);
            const lineReader = readline.createInterface({
                input: fs.createReadStream(filePath)
            });
            lineReader.on('line', (line) =>
            {
                const lineStrings = line.match(pattern);
                if (lineStrings)
                {
                    for (const string of lineStrings)
                    {
                        dst.add(string);
                    }
                }
            });
            lineReader.on('close', () =>
            {
                ++progress;
                if (!dst.size) stringRegistry.delete(filePath);
                if (progress === result.length)
                {
                    resolve(stringRegistry);
                }
            });
        }
    });
}

function getFilesInDirectory(dir, callback)
{
    return new Promise((resolve, reject) =>
    {
        let results = [];
        fs.readdir(dir, (err, list) =>
        {
            if (err)
            {
                reject(err);
                return;
            }
    
            let pending = list.length;
            if (!pending)
            {
                resolve(results);
                return;
            }
    
            list.forEach(file =>
            {
                file = path.resolve(dir, file);
                fs.stat(file, (err, stat) =>
                {
                    if (stat && stat.isDirectory())
                    {
                        getFilesInDirectory(file)
                            .then(result =>
                            {
                                results = results.concat(result);
                                if (!--pending) resolve(results);
                            })
                            .catch(e => reject(e));
                    }
                    else
                    {
                        results.push(file);
                        if (!--pending) resolve(results);
                    }
                });
            });
        });
    });
}

module.exports = {
    getMatchedStringsInDirectory: getMatchedStringsInDirectory,
    getFilesInDirectory: getFilesInDirectory,
};