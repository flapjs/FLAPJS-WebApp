import Eventable from 'util/Eventable.js';

import { convertToDFA } from 'machine/util/convertNFA.js';
import DFA from 'machine/DFA.js';

class MachineController
{
  constructor(machineBuilder)
  {
    this.machineBuilder = machineBuilder;
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

  initialize(app)
  {
    this.graphController = app.graphController;
  }

  destroy()
  {

  }

  getMachineBuilder()
  {
    return this.machineBuilder;
  }

  getMachineType()
  {
    return this.machineBuilder.getMachineType();
  }

  setMachineType(machineType)
  {
    this.machineBuilder.setMachineType(machineType);
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
    this.emit("userRenameMachine", this.machineBuilder, machineName, prev);
  }

  changeMachineTo(machineType)
  {
    const prev = this.machineBuilder.getMachineType();
    if (prev != machineType)
    {
      this.setMachineType(machineType);

      //Emit event
      this.emit("userChangeMachine", this.machineBuilder, machineType, prev);
    }
  }

  convertMachineTo(machineType)
  {
    const currentMachineType = this.getMachineType();

    //Already converted machine...
    if (currentMachineType === machineType) return;

    if (machineType == "DFA" && currentMachineType == "NFA")
    {
      this.emit("userPreConvertMachine", this.machineBuilder, machineType, currentMachineType);

      const result = convertToDFA(this.machineBuilder.getMachine(), new DFA());
      this.graphController.getGraph().copyMachine(result);
      this.setMachineType(machineType);

      this.emit("userConvertMachine", this.machineBuilder, machineType, currentMachineType);
      this.emit("userPostConvertMachine", this.machineBuilder, machineType, currentMachineType);
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
    return this.machineBuilder.getAlphabet();
  }

  createSymbol(symbol)
  {
    this.machineBuilder.addCustomSymbol(symbol);

    this.emit("userCreateSymbol", this.machineBuilder, symbol);
  }

  deleteSymbol(symbol)
  {
    let edge = null;
    let index = null;
    let result = null;
    const targets = [];

    this.emit("userPreDeleteSymbol", this.machineBuilder, symbol);

    const graph = this.graphController.getGraph();
    for(let i = graph.edges.length - 1; i >= 0; --i)
    {
      edge = graph.edges[i];
      index = edge.label.indexOf(symbol);
      if (index >= 0)
      {
        result = edge.label.substring(0, index) + edge.label.substring(index + 1);
        if (result.length > 0)
        {
          edge.setLabel(result);
        }
        else
        {
          edge.setLabel("");
          graph.deleteEdge(edge);
        }
        targets.push(edge);
      }
    }

    if (targets.length <= 0)
    {
      this.machineBuilder.removeCustomSymbol(symbol);
    }

    this.emit("userDeleteSymbol", this.machineBuilder, symbol, targets);
    this.emit("userPostDeleteSymbol", this.machineBuilder, symbol, targets);
  }

  renameSymbol(prevSymbol, nextSymbol)
  {
    let edge = null;
    let result = null;
    const targets = [];

    this.emit("userPreRenameSymbol", this.machineBuilder, nextSymbol, prevSymbol);

    const graph = this.graphController.getGraph();
    const length = graph.edges.length;
    for(let i = 0; i < length; ++i)
    {
      edge = graph.edges[i];
      let result = edge.label.replace(prevSymbol, nextSymbol);
      if (result != edge.label)
      {
        targets.push(edge);
      }
      edge.setLabel(result);
    }

    if (targets.length <= 0)
    {
      this.machineBuilder.renameCustomSymbol(prevSymbol, nextSymbol);
    }

    this.emit("userRenameSymbol", this.machineBuilder, nextSymbol, prevSymbol, targets);
    this.emit("userPostRenameSymbol", this.machineBuilder, nextSymbol, prevSymbol, targets);
  }

  isCustomSymbol(symbol)
  {
    return this.machineBuilder.isCustomSymbol(symbol);
  }
}
Eventable.mixin(MachineController);

export default MachineController;
