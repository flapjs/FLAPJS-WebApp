import AbstractGraphController from 'modules/base/AbstractGraphController.js';

import NodalGraph from 'graph/NodalGraph.js';

class DefaultGraphController extends AbstractGraphController
{
  constructor(module)
  {
    super(module, new NodalGraph());
  }
}
export default DefaultGraphController;
