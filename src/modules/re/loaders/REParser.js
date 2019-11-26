import
{
    EMPTY,
    CONCAT,
    UNION,
    KLEENE,
    SIGMA,
    EMPTY_SET,
    PLUS
} from '@flapjs/modules/re/machine/RE.js';

import AST from '@flapjs/services/expression/model/AST.js';

class REParser
{
    constructor()
    {
        this.rootNode = null;
        this.size = 0;

        // Map of indicies of the regex characters to their ASTNode
        this.indexToNode = new Map();
        // Indicies of the closed parenthesis in the regex
        this.closedParensIndicies = [];
    }

    /**
     * Used by external loaders to properly parse an RE expression.
     * 
     * @param {RE} re The regular expression machine.
     * 
     * @returns {AbstractNode} The root of the AST.
     */
    parse(re)
    {
        const previousExpression = re.getExpression();
        re.setExpression(previousExpression.replace(/\s/g, ''));
        re.insertConcatSymbols();
        this.parseRegex(re);
        re.setExpression(previousExpression);
        return this.rootNode;
    }
    
    parseRegex(regex)
    {
        this.rootNode = null;
        this.size = 0;
        regex.clearTerminals();
        if (regex.getExpression().length == 0)
        {
            regex.clear();
            return;
        }
        else if (regex.isExpressionValid())
        {
            let currNode = this.rootNode;
            let openParenStack = [];
            let expression = regex.getExpression();
            let index = -1;

            for (const char of expression)
            {
                this.size = this.size + 1;
                index++;
                switch (char)
                {
                    case '(':
                        currNode = this.createOpenParenNode(currNode, index);
                        openParenStack.push(currNode);
                        break;
                    case ')':
                        currNode = openParenStack.pop();
                        this.closedParensIndicies.push(index);
                        break;
                    case KLEENE:
                        currNode = this.createUnaryOperNode(currNode, index, KLEENE);
                        break;
                    case PLUS:
                        currNode = this.createUnaryOperNode(currNode, index, PLUS);
                        break;
                    case CONCAT:
                        currNode = this.createBinaryOperNode(currNode, index, CONCAT);
                        break;
                    case UNION:
                        currNode = this.createBinaryOperNode(currNode, index, UNION);
                        break;
                    //Ignore spaces
                    case ' ':
                        break;
                    //For symbols
                    default:
                    {
                        currNode = this.createTerminalNode(currNode, index, char);
                        // Add TERMINALS ONLY to the regex's terminal set
                        if (char != SIGMA && char != EMPTY_SET && char != EMPTY)
                        {
                            regex.addTerminal(char);
                        }
                    }
                }
            }
        }
    }

    makeParentOf(newParentNode, targetNode)
    {
        let originalParent = targetNode.getParent();
        newParentNode.setParent(originalParent);
        newParentNode.addChild(targetNode);
        if (originalParent != null)
        {
            originalParent.replaceChild(targetNode, newParentNode);
        }
        targetNode.setParent(newParentNode);

        if (this.rootNode == targetNode)
        {
            this.rootNode = newParentNode;
        }
    }

    createOpenParenNode(currNode, index)
    {
        if (!currNode)
        {
            currNode = new AST.Scope('(', index);
            this.indexToNode.set(index, currNode);
            this.rootNode = currNode;
        }
        else
        {
            let newNode = new AST.Scope('(', index);
            this.indexToNode.set(index, newNode);
            currNode.addChild(newNode);
            currNode = newNode;
        }
        return currNode;
    }

    createUnaryOperNode(currNode, index, symbol)
    {
        let newNode = new AST.Unary(symbol, index).setParent(currNode.getParent());
        this.indexToNode.set(index, newNode);
        this.makeParentOf(newNode, currNode);
        currNode = newNode;
        return currNode;
    }

    createBinaryOperNode(currNode, index, symbol)
    {
        if (!currNode.getParent())
        {
            let newNode = new AST.Binary(symbol, index);
            this.indexToNode.set(index, newNode);
            this.makeParentOf(newNode, currNode);
            currNode = newNode;
        }
        else
        {
            //Special cases where the newly created node should be the parent of
            //the PARENT of the currNode are based off of symbol, so whenever
            //we add a new binary operator, this is something you should MODIFY
            let makeParentOfParent = false;
            const originalParent = currNode.getParent();
            const parentSym = originalParent.getSymbol();
            switch (symbol)
            {
                case CONCAT:
                    if (parentSym == CONCAT) makeParentOfParent = true;
                    break;
                case UNION:
                    if (parentSym != '(') makeParentOfParent = true;
                    break;
            }
            if (makeParentOfParent)
            {
                let grandparent = originalParent.getParent();
                let newNode = new AST.Binary(symbol, index).setParent(grandparent);
                this.indexToNode.set(index, newNode);
                this.makeParentOf(newNode, originalParent);
                currNode = newNode;
            }
            else
            {
                let newNode = new AST.Binary(symbol, index).setParent(originalParent);
                this.indexToNode.set(index, newNode);
                this.makeParentOf(newNode, currNode);
                currNode = newNode;
            }
        }
        return currNode;
    }

    createTerminalNode(currNode, index, symbol)
    {
        if (!currNode)
        {
            currNode = new AST.Terminal(symbol, index);
            this.indexToNode.set(index, currNode);
            this.rootNode = currNode;
        }
        else
        {
            let symbolNode = new AST.Terminal(symbol, index);
            this.indexToNode.set(index, symbolNode);
            currNode.addChild(symbolNode);
            currNode = symbolNode;
        }
        return currNode;
    }

    /**
     * A cursor can only be clicked on a spaceIndex, hence its use.
     * 
     * @example
     * e.g.   A U B
     *       0 1 2 3
     * 
     * @param {Regex}  regex 	The regular expression to parse and do scope highlighting on.
     * @param {number} spaceIndex Is the index of the space between the characters in the regex.
     * @returns {Array} [[start1_spaceIndex, end1_spaceIndex], [start2_spaceIndex, end2_spaceIndex]] of the scope.
     */
    scopeFromSpaceIndexing(regex, spaceIndex)
    {
        if (spaceIndex == 0) 
        {
            return [[0, 0], [0, 0]];
        }
        else if (spaceIndex > 0 && spaceIndex <= this.size + 1) 
        {
            const index = spaceIndex - 1;
            const scope = this.scopeFromCharAtIndex(regex, index);
            // scope will be null if the character selected is just an operand,
            // so nothing should be highlighted
            if (!scope) 
            {
                return [[spaceIndex, spaceIndex], [spaceIndex, spaceIndex]];
            }
            else 
            {
                scope[1][1] += 1;	//Increment last index to account for space indexing in highlighting
                return scope;
            }
        }
        else 
        {
            throw new Error('Invalid index');
        }
    }

    /**
     * Scope in this context is considered as the operands for a selected operator.
     * For an operand 	    -> there is no scope, return null.
     * For a unary operator -> return [[start_index, start_index], [end_index, end_index]]
     *							start_index is index of beginning index of the sole operand and
     *							end_index is the index of the end.
     * For a binary operator -> return [[start1_index, end1_index], [start2_index, end2_index]]
     *							start1_index and end1_index correspond to the first operand
     *							start2_index and end2_index correspond to the second operand.
     * Finding the start and end indicies relies on the parse tree made, where operands of an
     * operator are descendants in the subtree where the operator is the root node, so earliest
     * and latest parts of the operands will be the terminal nodes with the least and highest index.
     * 
     * @param {Regex}  regex 	The regular expression to parse and do scope highlighting on.
     * @param {number} index  	Is the index of the characters in the regex.
     * @returns {Array} [[start1_spaceIndex, end1_spaceIndex], [start2_spaceIndex, end2_spaceIndex]] of the scope.
     */
    scopeFromCharAtIndex(regex, index)
    {
        this.parseRegex(regex);
        let currentNode = this.indexToNode.get(index);
        let symbol = currentNode.getSymbol();
        //Unary operators
        if (symbol == KLEENE || symbol == PLUS) 
        {
            let smallest = this.smallestIndexOfChildren(currentNode);
            let largest = this.largestIndexOfChildren(currentNode);
            return [[smallest, smallest], [largest, largest]];
        }
        //Binary operators
        else if (symbol == UNION || symbol == CONCAT) 
        {
            let smallest = this.smallestIndexOfChildren(currentNode);
            let largest = this.largestIndexOfChildren(currentNode);
            return [[smallest, index - 1], [index + 1, largest]];
        }
        //Operands
        else 
        {
            return null;
        }
    }

    /**
     * @param {ASTNode} node The root node.
     * @returns {ASTNode} The child with the largest index.
     */
    largestIndexOfChildren(node)
    {
        let max = node.getIndex();
        for (let child of node.getChildren()) 
        {
            max = Math.max(max, this.largestIndexOfChildren(child));
        }
        return max;
    }

    /**
     * @param {ASTNode} node The root node.
     * @returns {ASTNode} The child with the smallest index.
     */
    smallestIndexOfChildren(node)
    {
        let min = node.getIndex();
        for (let child of node.getChildren()) 
        {
            min = Math.min(min, this.smallestIndexOfChildren(child));
        }
        return min;
    }

}

export const INSTANCE = new REParser();
export default REParser;
