import Downloader from 'util/Downloader.js';

class HotKeys
{
  constructor(graph, events)
  {
    this.graph = graph;
    this.events = events;

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  initialize(workspace, toolbar)
  {
    this.workspace = workspace;
    this.toolbar = toolbar;

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
      Downloader.downloadText(this.toolbar.getMachineName() + '.json', JSON.stringify(this.graph.toJSON()));
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
      Downloader.downloadSVG(this.toolbar.getMachineName(), 'png', svg, width, height);

      e.preventDefault();
      e.stopPropagation();
    }
  }
}

export default HotKeys;
