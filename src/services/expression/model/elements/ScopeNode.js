import UnaryOpNode from './UnaryOpNode.js';

class ScopeNode extends UnaryOpNode
{
    constructor(symbol, parentNode, index)
    {
        super(symbol, parentNode, index);
    }
}

export default ScopeNode;
