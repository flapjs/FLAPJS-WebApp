class ExportManager
{
  constructor()
  {
    this._exporters = new Map();
  }

  clear()
  {
    this._exporters.clear();
  }

  addExporter(exportName, exporter)
  {
    this._exporters.set(exportName, exporter);
  }

  removeExporter(exportName)
  {
    this._exporters.delete(exportName);
  }

  getExporterByName(exportName) { return this._exporters.get(exportName); }
  getExporters() { return this._exporters.values(); }
  getExportNames() { return this._exporters.keys(); }
  
  isEmpty() { return this._exporters.size <= 0; }
}

export default ExportManager;
