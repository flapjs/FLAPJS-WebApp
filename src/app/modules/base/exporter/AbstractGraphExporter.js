class AbstractGraphExporter
{
  constructor() {}

  importFromData(data, app)
  {
    throw new Error("Unsupported import for type \'" + this.getFileType() + "\'");
  }

  exportToData(app)
  {
    throw new Error("Unsupported export for type \'" + this.getFileType() + "\'");
  }

  doesSupportData()
  {
    return false;
  }

  importFromFile(fileBlob, app)
  {
    throw new Error("Unsupported import for type \'" + this.getFileType() + "\'");
  }

  exportToFile(filename, app)
  {
    throw new Error("Unsupported export for type \'" + this.getFileType() + "\'");
  }

  doesSupportFile()
  {
    return false;
  }

  canImport()
  {
    return false;
  }

  getTitle()
  {
    return this.getLabel();
  }

  getIconComponentClass()
  {
    return null;
  }

  getLabel()
  {
    return "Export as " + this.getFileType().toUpperCase();
  }

  getFileType()
  {
    throw new Error("Unknown file type for exporter");
  }
}

export default AbstractGraphExporter;
