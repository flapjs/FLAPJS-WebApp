import fs from 'fs';
import path from 'path';

export function exportDFA(dir, filename, dfa)
{
    exportFSA(dir, filename, dfa);
}

export function exportNFA(dir, filename, nfa)
{
    exportFSA(dir, filename, nfa);
}

export function exportFSA(dir, filename, fsa)
{
    exportJSON(path.resolve(dir, filename), fsa.toJSON());
}

function exportJSON(filepath, obj, callback=null)
{
    const result = JSON.stringify(obj);
    let ws = fs.createWriteStream(filepath);
    ws.write(result, 'utf-8');
    if (callback)
    {
        ws.on('finish', () => 
        {
            callback(ws, obj);
        });
    }
    ws.end();
}
