import fs from 'fs';

const ENCODING = 'utf-8';

export function importDFA(filepath, callback=null)
{
    return importFSA(filepath, callback);
}

export function importNFA(filepath, callback=null)
{
    return importFSA(filepath, callback);
}

export function importFSA(filepath, callback=null)
{
    if (callback)
    {
        importJSON(filepath, function(data) 
        {
            callback(parseJSONToFSA(data));
        });
        return null;//TODO: new Promise();
    }
    else
    {
        const data = importJSON(filepath, null);
        return parseJSONToFSA(data);
    }
}

function parseJSONToFSA(data)
{
    //TODO: convert json to DFA or NFA;
    /*
    if (data.type == 'DFA')
    {

    }
    else if (data.type == 'NFA')
    {

    }
    else if (data.type == 'FSA')
    {

    }
    else
    {
        throw new Error('Found unknown machine type \'' + data.type + '\'.');
    }
    */
}

//Change to return async promise
function importJSON(filepath, callback=null)
{
    if (callback)
    {
        fs.readFile(filepath, ENCODING, function(err, data) 
        {
            if (err) throw err;

            callback(data);
        });
        return null;
    }
    else
    {
        return fs.readFileSync(filepath, ENCODING);
    }
}
