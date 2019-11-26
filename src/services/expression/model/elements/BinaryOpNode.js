import OpNode from './OpNode.js';

class BinaryOpNode extends OpNode
{
    constructor(symbol, parentNode, index)
    {
        super(symbol, parentNode, index, 2);
    }
}

export default BinaryOpNode;
