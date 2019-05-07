class Importer
{
    constructor(parser=null)
    {
        this._parser = parser;
    }

    importFromFile(filename, fileData)
    {
        return new Promise((resolve, reject) => 
        {
            let target;
            try
            {
                if (this._parser)
                {
                    target = this._parser.parse(fileData);
                }
                else
                {
                    target = fileData;
                }
                resolve(target);
            }
            catch (e)
            {
                reject(e);
            }
        });
    }
  
    isValidFile(filename, fileData) { return fileData; }
    getParser() { return this._parser; }
}
export default Importer;
