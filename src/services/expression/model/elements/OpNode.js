import AbstractNode from './AbstractNode.js';

/**
 * A class to represent the operations of an AST.
 */
class OpNode extends AbstractNode
{
    constructor(symbol, parentNode, index, maxChildren = Infinity)
    {
        super(symbol, parentNode, index);

        this._maxChildren = maxChildren;
        this._children = [];
    }

    addChild(childNode)
    {
        if (this._children.length < this._maxChildren)
        {
            this._children.push(childNode);
            childNode.setParent(this);
        }
        else
        {
            throw new Error(`Trying to add more than ${this._maxChildren} children to an ASTNode.`);
        }
    }

    replaceChild(originalChild, newChild)
    {
        if (this._children.includes(originalChild))
        {
            let index = this._children.indexOf(originalChild);
            this._children[index] = newChild;
        }
        else
        {
            throw new Error('The child to replace isn\'t a child already.');
        }
    }

    /** @override */
    hasChildren() { return this._children.length > 0; }

    /** @override */
    getChildren() { return this._children; }
}

export default OpNode;
