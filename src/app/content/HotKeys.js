class HotKeys
{
  constructor()
  {
    this.app = null;
    this.workspace = null;
    this.toolbar = null;
    this.undoManager = null;
    this.graphController = null;
    this.machineController = null;

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  initialize(app)
  {
    this.app = app;
    this.workspace = app.workspace;
    this.toolbar = app.toolbar;
    this.undoManager = app.getUndoManager();
    this.graphController = app.getGraphController();
    this.machineController = app.getMachineController();

    window.addEventListener('keydown', this.onKeyDown);
  }

  destroy()
  {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e)
  {
    //Ctrl-S
    if (event.which == 83 && (event.metaKey || event.ctrlKey))
    {
      //Save as machine file
      const exporter = this.graphController.getDefaultGraphExporter();
      const machineName = this.machineController.getMachineName();
      exporter.exportToFile(machineName, this.app.getCurrentModule());

      e.preventDefault();
      e.stopPropagation();
    }
    //Ctrl-Z
    else if (event.which == 90 && (event.metaKey || event.ctrlKey))
    {
      if (event.shiftKey)
      {
        //Redo
        this.undoManager.redo();
      }
      else
      {
        //Undo
        this.undoManager.undo();
      }
      e.preventDefault();
      e.stopPropagation();
    }
    //Ctrl-P
    else if (event.which == 80 && (event.metaKey || event.ctrlKey))
    {
      //Export to PNG
      const imageExporters = this.graphController.getImageExporters();
      if (imageExporter.length >= 1)
      {
        const exporter = imageExporters[0];
        const machineName = this.machineController.getMachineName();
        exporter.exportToFile(machineName, this.app.getCurrentModule());
      }
      else
      {
        throw new Error("Unable to find valid image exporter for module \'" + this.app.getCurrentModule().getModuleName() + "\'");
      }

      e.preventDefault();
      e.stopPropagation();
    }
  }
}

export default HotKeys;
