import AbstractNode from './AbstractNode.js';

class TerminalNode extends AbstractNode
{
    constructor(symbol, parentNode, index)
    {
        super(symbol, parentNode, index);
    }
}

export default TerminalNode;
