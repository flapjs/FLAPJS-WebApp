import Downloader from 'util/Downloader.js';
import * as FlapSaver from 'util/FlapSaver.js';

class HotKeys
{
  constructor(events)
  {
    this.workspace = null;
    this.toolbar = null;
    this.events = null;
    this.graphController = null;
    this.machineController = null;

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  initialize(app)
  {
    this.workspace = app.workspace;
    this.toolbar = app.toolbar;
    this.events = app.eventManager;
    this.graphController = app.graphController;
    this.machineController = app.machineController;

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
      //TODO: Refer to export panel
      const jsonString = JSON.stringify(FlapSaver.saveToJSON(this.graphController, this.machineController));
      const machineName = this.machineController.getMachineName();
      Downloader.downloadText(machineName + '.json', jsonString);

      e.preventDefault();
      e.stopPropagation();
    }
    //Ctrl-Z
    else if (event.which == 90 && (event.metaKey || event.ctrlKey))
    {
      if (event.shiftKey)
      {
        //Redo
        //TODO: Refer to toolbar
        this.events.getLogger().redo();
      }
      else
      {
        //Undo
        //TODO: Refer to toolbar
        this.events.getLogger().undo();
      }
      e.preventDefault();
      e.stopPropagation();
    }
    //Ctrl-P
    else if (event.which == 80 && (event.metaKey || event.ctrlKey))
    {
      //Export to PNG
      //TODO: Refer to export panel
      const workspaceDim = this.workspace.ref.viewBox.baseVal;
      const width = workspaceDim.width;
      const height = workspaceDim.height;
      const svg = this.workspace.getSVGForExport(width, height);
      Downloader.downloadSVG(this.machineController.getMachineName(), 'png', svg, width, height);

      e.preventDefault();
      e.stopPropagation();
    }
  }
}

export default HotKeys;
