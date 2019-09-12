import { EMPTY , CONCAT , UNION , KLEENE } from 'deprecated/machine/Symbols.js';
import Regex from 'deprecated/machine/Regex.js';

class ASTNode {

    constructor(symbol, isTerminal, parentNode) {
        this._symbol = symbol;
        this._isTerminal = isTerminal;
        this._parent = parentNode;
        this._children = []
    }

    addChild(childNode) {
        if(this.hasRoomForChildren()) {
            this._children.push(childNode);
            this._isTerminal = false;
        }
        else {
            throw new Error("Trying to add more than 2 children to an ASTNode");
        }
    }

    replaceChild(originalChild, newChild) {
        if(this._children.includes(originalChild)) {
            let index = this._children.indexOf(originalChild);
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
        this._isTerminal = isTerminal;
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
            let currNode = this.rootNode;
            let openParenStack = [];
            let expression = regex.getExpression();

            for(const char of expression) {
                switch(char) {
                    case '(':
                        if(!currNode) {
                            currNode = new ASTNode('(', false, null);
                            this.rootNode = currNode;
                        }
                        else {
                            let newNode = new ASTNode('(', false, currNode)
                            currNode.addChild(newNode);
                            currNode = newNode;
                        }
                        openParenStack.push(currNode);
                        break;
                    case ')':
                        currNode = openParenStack.pop();
                        break;
                    case KLEENE:
                        let kleeneNode = new ASTNode(KLEENE, false, currNode.getParent());
                        this.makeParentOf(kleeneNode, currNode);
                        currNode = kleeneNode;
                        break;
                    case CONCAT:
                        if(!currNode.getParent()) {
                            let concatNode = new ASTNode(CONCAT, false, null);
                            this.makeParentOf(concatNode, currNode);
                            currNode = concatNode;
                        }
                        else {
                            let originalParent = currNode.getParent();
                            let parentSym = originalParent.getSymbol();
                            if(parentSym == CONCAT) {
                                let grandparent = originalParent.getParent();
                                let concatNode = new ASTNode(CONCAT, false, grandparent);
                                this.makeParentOf(concatNode, originalParent);
                                currNode = concatNode;
                            }
                            else {
                                let concatNode = new ASTNode(CONCAT, false, originalParent);
                                this.makeParentOf(concatNode, currNode);
                                currNode = concatNode;
                            }
                        }
                        break;

                    case UNION:
                        if(!currNode.getParent()) {
                            let unionNode = new ASTNode(UNION, false, null);
                            this.makeParentOf(unionNode, currNode);
                            currNode = unionNode;
                        }
                        else {
                            let originalParent = currNode.getParent();
                            let sym = originalParent.getSymbol();
                            if(sym == '(') {
                                let unionNode = new ASTNode(UNION, false, originalParent);
                                this.makeParentOf(unionNode, currNode);
                                currNode = unionNode;
                            }
                            else {
                                let grandparent = originalParent.getParent();
                                let unionNode = new ASTNode(UNION, false, grandparent);
                                this.makeParentOf(unionNode, originalParent);
                                currNode = unionNode;
                            }
                        }
                        break;
                    case ' ':
                        break;
                    //For symbols
                    default:
                        if(!currNode) {
                            currNode = new ASTNode(char, true, null);
                            this.rootNode = currNode;
                        }
                        else {
                            let symbolNode = new ASTNode(char, true, currNode);
                            currNode.addChild(symbolNode);
                            currNode = symbolNode;
                        }
                }
            }
        }
    }

    makeParentOf(newParentNode, targetNode) {
        let originalParent = targetNode.getParent();
        newParentNode.setParent(originalParent);
        newParentNode.addChild(targetNode);
        if(originalParent != null) {
            originalParent.replaceChild(targetNode, newParentNode);
        }
        targetNode.setParent(newParentNode);

        if(this.rootNode == targetNode) {
            this.rootNode = newParentNode;
        }
    }
}

export default RegexParser;
