import { EMPTY , CONCAT , UNION , KLEENE } from 'machine/Symbols.js';
import Regex from 'machine/Regex.js';

class ASTNode {
    constructor() {
        this._symbol = EMPTY;
        this._isTerminal = true;
        this._parent = null;
        this._children = [];
    }

    constructor(symbol, isTerminal, parentNode) {
        this._symbol = symbol;
        this._isTerminal = isTerminal;
        this._parent = parentNode;
        this._children = []
    }

    addChild(childNode) {
        if(hasRoomForChildren()) {
            this._children.push(childNode);
        }
        else {
            throw new Error("Trying to add more than 2 children to an ASTNode");
        }
    }

    replaceChild(originalChild, newChild) {
        if(this._children.includes(originalChild)) {
            index = this._children.indexOf(originalChild);
            this._children[index] = newChild;
        }
        else {
            throw new Error("The child to replace isn't a child already")
        }
    }

    hasRoomForChildren() {
        return this._children.length < 2;
    }

    isTerminal() {
        return this._isTerminal;
    }

    setTerminal(isTerminal) {
        this._istTerminal = isTerminal;
    }

    getSymbol() {
        return this._symbol;
    }

    setSymbol(newSymbol) {
        this._symbol = newSymbol;
    }

    getParent() {
        return this._parent;
    }

    setParent(parentNode) {
        this._parent = parentNode;
    }

    getChildren() {
        return this._children;
    }
}

class RegexParser {
    constructor() {
        this.rootNode = null;
    }

    parseRegex(regex) {
        if(regex.isExpressionValid()) {
            currNode = this.rootNode;
            openParenStack = [];
            expression = regex.getExpression();

            for(const char of expression) {
                switch(char) {
                    case '(':
                        if(!currNode) {
                            rootNode = currNode = new ASTNode('(', false, null);
                        }
                        else {
                            newNode = new ASTNode('(', false, currNode)
                            currNode.addChild(newNode);
                            currNode = newNode;
                        }
                        openParenStack.push(currNode);
                        break;
                    case ')':
                        currNode = openParenStack.pop();
                        break;
                    case KLEENE:
                        kleeneNode = new ASTNode(KLEENE, false, originalParent);
                        makeParentOf(kleeneNode, currNode);
                        currNode = kleeneNode;
                        break;
                    case CONCAT:
                        if(!currNode.getParent()) {
                            concatNode = new ASTNode(CONCAT, false, null);
                            concatNode.addChild(currNode);
                            currNode.setParent(concatNode);
                            currNode = concatNode;
                        }
                        else {
                            originalParent = currNode.getParent();
                            parentSym = originalParent.getSymbol();
                            if(parentSym == UNION) {
                                concatNode = new ASTNode(CONCAT, false, originalParent);
                                makeParentOf(concatNode, currNode);
                                currNode = concatNode;
                            }
                            else if (parentSym == CONCAT) {
                                grandparent = originalParent.getParent();
                                concatNode = new ASTNode(CONCAT, false, grandparent);
                                makeParentOf(concatNode, originalParent);
                                currNode = concatNode;
                            }
                            else {
                                throw new Error ("Operators of regular expression are poorly formatted");
                            }
                        }

                        break;
                    case UNION:
                        if(!currNode.getParent()) {
                            unionNode = new ASTNode(UNION, false, null);
                            unionNode.addChild(currNode);
                            currNode.setParent(unionNode);
                            currNode = unionNode;
                        }
                        else {
                            originalParent = currNode.getParent();
                            parentSym = originalParent.getSymbol();

                        }
                }
            }
        }
    }

    makeParentOf(newParentNode, targetNode) {
        originalParent = targetNode.getParent();
        newParentNode.setParent(originalParent);
        newParentNode.addChild(targetNode);
        originalParent.replaceChild(targetNode, newParentNode);
        targetNode.setParent(newParentNode);
    }
}

export default RegexParser;
