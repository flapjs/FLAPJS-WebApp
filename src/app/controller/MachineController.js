import Eventable from 'util/Eventable.js';

import { convertToDFA } from 'machine/util/convertNFA.js';
import DFA from 'machine/DFA.js';

class MachineController
{
  constructor()
  {
    this._module = null;

    this.machineName = null;

    this.graphController = null;

    //userChangeMachine(machineBuilder, nextMachineType, prevMachineType) - when user changes machine type
    this.registerEvent("userChangeMachine");
    //userConvertMachine(machineBuilder, nextMachineType, prevMachineType) - when user converts machine type
    this.registerEvent("userConvertMachine");
    this.registerEvent("userPreConvertMachine");//Before changes
    this.registerEvent("userPostConvertMachine");//After all changes
    //userRenameMachine(machineBuilder, nextMachineName, prevMachineName) - when machine name is changed
    this.registerEvent("userRenameMachine");
    //userCreateSymbol(machineBuilder, symbol) - When user adds a custom symbol
    this.registerEvent("userCreateSymbol");
    //userDeleteSymbol(machineBuilder, symbol, prevEdges) - When user delets a symbol (and affects the edges)
    this.registerEvent("userDeleteSymbol");
    this.registerEvent("userPreDeleteSymbol");//userPreDeleteSymbol(machineBuilder, symbol)
    this.registerEvent("userPostDeleteSymbol");
    //userRenameSymbol(machineBuilder, symbol, prevSymbol, targetEdges) - When user renames a used symbol (and affects the edges)
    this.registerEvent("userRenameSymbol");
    this.registerEvent("userPreRenameSymbol");//userPreDeleteSymbol(machineBuilder, symbol, prevSymbol)
    this.registerEvent("userPostRenameSymbol");
  }

  setModule(module)
  {
    this._module = module;
  }

  initialize(app)
  {
    this.graphController = app.graphController;
  }

  destroy()
  {

  }

  getLabelFormatter()
  {
    return this._module.getLabelFormatter();
  }

  getMachineBuilder()
  {
    return this._module.getMachineBuilder();
  }

  getMachineType()
  {
    return this.getMachineBuilder().getMachineType();
  }

  setMachineType(machineType)
  {
    this.getMachineBuilder().setMachineType(machineType);
  }

  getMachineName()
  {
    return this.machineName || I18N.toString("file.untitled");
  }

  setMachineName(machineName)
  {
    if (!machineName || machineName.length <= 0)
    {
      this.machineName = null;
    }
    else
    {
      this.machineName = machineName;
    }

    const value = this.getMachineName();
    const element = document.getElementById('window-title');
    const string = element.innerHTML;
    const separator = string.indexOf('-');
    if (separator !== -1)
    {
      element.innerHTML = value + " - " + string.substring(separator + 1).trim();
    }
    else
    {
      element.innerHTML = value + " - " + string;
    }
  }

  renameMachine(machineName)
  {
    const prev = this.machineName;
    this.setMachineName(machineName);

    //Emit a user rename machine event
    this.emit("userRenameMachine", this.getMachineBuilder(), machineName, prev);
  }

  changeMachineTo(machineType)
  {
    const prev = this.getMachineBuilder().getMachineType();
    if (prev != machineType)
    {
      this.setMachineType(machineType);

      //Emit event
      this.emit("userChangeMachine", this.getMachineBuilder(), machineType, prev);
    }
  }

  convertMachineTo(machineType)
  {
    const currentMachineType = this.getMachineType();

    //Already converted machine...
    if (currentMachineType === machineType) return;

    if (machineType == "DFA" && currentMachineType == "NFA")
    {
      this.emit("userPreConvertMachine", this.getMachineBuilder(), machineType, currentMachineType);

      const result = convertToDFA(this.getMachineBuilder().getMachine(), new DFA());
      this.graphController.getGraph().copyMachine(result);
      this.setMachineType(machineType);

      this.emit("userConvertMachine", this.getMachineBuilder(), machineType, currentMachineType);
      this.emit("userPostConvertMachine", this.getMachineBuilder(), machineType, currentMachineType);
    }
    else if (machineType == "NFA" && currentMachineType == "DFA")
    {
      this.changeMachineTo(machineType);
    }
    else
    {
      throw new Error("Conversion scheme between \'" + currentMachineType + "\' to \'" + machineType + "\' is not supported");
    }
  }

  getAlphabet()
  {
    return this.getMachineBuilder().getAlphabet();
  }

  createSymbol(symbol)
  {
    this.getMachineBuilder().addCustomSymbol(symbol);

    this.emit("userCreateSymbol", this.getMachineBuilder(), symbol);
  }

  deleteSymbol(symbol)
  {
    let edge = null;
    let index = null;
    let result = null;
    const targets = [];

    this.emit("userPreDeleteSymbol", this.getMachineBuilder(), symbol);

    const graph = this.graphController.getGraph();
    for(let i = graph.getEdges().length - 1; i >= 0; --i)
    {
      edge = graph.getEdges()[i];
      index = edge.getEdgeLabel().indexOf(symbol);
      if (index >= 0)
      {
        result = edge.getEdgeLabel().substring(0, index) + edge.getEdgeLabel().substring(index + 1);
        if (result.length > 0)
        {
          edge.setEdgeLabel(result);
        }
        else
        {
          edge.setEdgeLabel("");
          graph.deleteEdge(edge);
        }
        targets.push(edge);
      }
    }

    if (targets.length <= 0)
    {
      this.getMachineBuilder().removeCustomSymbol(symbol);
    }

    this.emit("userDeleteSymbol", this.getMachineBuilder(), symbol, targets);
    this.emit("userPostDeleteSymbol", this.getMachineBuilder(), symbol, targets);
  }

  renameSymbol(prevSymbol, nextSymbol)
  {
    let edge = null;
    let result = null;
    const targets = [];

    this.emit("userPreRenameSymbol", this.getMachineBuilder(), nextSymbol, prevSymbol);

    const graph = this.graphController.getGraph();
    const length = graph.getEdges().length;
    for(let i = 0; i < length; ++i)
    {
      edge = graph.getEdges()[i];
      let result = edge.getEdgeLabel().replace(prevSymbol, nextSymbol);
      if (result != edge.getEdgeLabel())
      {
        targets.push(edge);
      }
      edge.setEdgeLabel(result);
    }

    if (targets.length <= 0)
    {
      this.getMachineBuilder().renameCustomSymbol(prevSymbol, nextSymbol);
    }

    this.emit("userRenameSymbol", this.getMachineBuilder(), nextSymbol, prevSymbol, targets);
    this.emit("userPostRenameSymbol", this.getMachineBuilder(), nextSymbol, prevSymbol, targets);
  }

  getCustomSymbols()
  {
    return this.getMachineBuilder()._symbols;
  }

  isCustomSymbol(symbol)
  {
    return this.getMachineBuilder().isCustomSymbol(symbol);
  }
}
Eventable.mixin(MachineController);

export default MachineController;
