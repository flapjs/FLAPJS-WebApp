class Exporter
{
  constructor(parser=null)
  {
    this._parser = parser;
  }

  exportToFile(filename, target)
  {
    return new Promise((resolve, reject) => {
      let fileData;
      try
      {
        if (this._parser)
        {
          fileData = this._parser.compose(target);
        }
        else
        {
          fileData = target;
        }

        Downloader.downloadText(filename, fileData);
        resolve();
      }
      catch (e)
      {
        reject(e);
      }
    });
  }

  isValidTarget(target) { return target; }
  getParser() { return this._parser; }
}
export default Exporter;
