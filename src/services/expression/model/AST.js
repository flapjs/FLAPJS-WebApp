import TerminalNode from './elements/TerminalNode.js';
import BinaryOpNode from './elements/BinaryOpNode.js';
import UnaryOpNode from './elements/UnaryOpNode.js';
import ScopeNode from './elements/ScopeNode.js';
import OpNode from './elements/OpNode.js';

export default {
    Terminal: TerminalNode,
    Binary: BinaryOpNode,
    Unary: UnaryOpNode,
    Scope: ScopeNode,
    Op: OpNode,
};
