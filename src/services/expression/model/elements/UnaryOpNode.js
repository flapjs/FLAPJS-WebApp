import OpNode from './OpNode.js';

class UnaryOpNode extends OpNode
{
    constructor(symbol, parentNode, index)
    {
        super(symbol, parentNode, index, 1);
    }
}

export default UnaryOpNode;
