import AbstractMachineBuilder from 'modules/abstract/AbstractMachineBuilder.js';

class DefaultMachineBuilder extends AbstractMachineBuilder
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

export default DefaultMachineBuilder;
