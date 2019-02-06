import AbstractMachineBuilder from 'modules/abstract/AbstractMachineBuilder.js';

class EmptyMachineBuilder extends AbstractMachineBuilder
{
  constructor()
  {
    super();
  }

  //Override
  onGraphChange(graph)
  {
    //Do nothing.
  }
}

export default EmptyMachineBuilder;
