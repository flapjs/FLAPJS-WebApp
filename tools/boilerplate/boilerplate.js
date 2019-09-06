/* eslint-env node */

const path = require('path');
const fs = require('fs');
const TEMPLATES_DIR = path.resolve(__dirname, 'templates');

function createBoilerplate(templateName, outputDir, outputName, opts={})
{
    opts.__DIR__ = outputDir;
    opts.__NAME__ = outputName;

    let resultTemplate = fs.readFileSync(path.resolve(TEMPLATES_DIR, templateName)).toString();
    let resultName = path.basename(templateName);

    // Process content...
    for(const name of Object.keys(opts))
    {
        const pattern = new RegExp(name, 'g');
        resultTemplate = resultTemplate.replace(pattern, opts[name]);
    }

    // Process name...
    for(const name of Object.keys(opts))
    {
        const pattern = new RegExp(name, 'g');
        resultName = resultName.replace(pattern, opts[name]);
    }

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const outputPath = path.resolve(outputDir, resultName);
    if (fs.existsSync(outputPath))
    {
        // eslint-disable-next-line no-console
        console.error('Skipping...file already exists.');
    }
    else
    {
        fs.writeFileSync(outputPath, resultTemplate);
    }
}

function main(name, dir)
{
    createBoilerplate('component/__NAME__.jsx', dir, name);
    createBoilerplate('component/__NAME__.module.css', dir, name);
    createBoilerplate('component/__NAME__.md', dir, name);
    createBoilerplate('component/__NAME__.spec.js', dir, name);
    createBoilerplate('component/__NAME__.stories.js', dir, name);
    process.exit();
}

process.stdout.write('What is the component name? ', () =>
{
    process.stdin.once('data', (name) =>
    {
        process.stdout.write('What is the output directory? ', () =>
        {
            process.stdin.once('data', (dir) =>
            {
                main(name.toString().trim(), dir.toString().trim());
            });
        });
    });
});
