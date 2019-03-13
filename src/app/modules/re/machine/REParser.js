import RE, {EMPTY, CONCAT, UNION, KLEENE, SIGMA, EMPTY_SET, PLUS} from './RE.js';

class ASTNode {

    constructor(symbol, isTerminal, parentNode, index) {
        this._symbol = symbol;
        this._isTerminal = isTerminal;
        this._parent = parentNode;
        this._children = [];
        this._index = index;
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

    getIndex() {
        return this._index;
    }

    setIndex(index) {
        this._index = index;
    }
}

class REParser {
    constructor() {
        this.rootNode = null;
    }

    parseRegex(regex) {
      this.rootNode = null;
      regex.clearTerminals();
        if(regex.isExpressionValid()) {
            let currNode = this.rootNode;
            let openParenStack = [];
            let expression = regex.getExpression();
            let index = -1;

            for(const char of expression) {
                index++;
                switch(char) {
                    case '(':
                        if(!currNode) {
                            currNode = new ASTNode('(', false, null, index);
                            this.rootNode = currNode;
                        }
                        else {
                            let newNode = new ASTNode('(', false, currNode, index);
                            currNode.addChild(newNode);
                            currNode = newNode;
                        }
                        openParenStack.push(currNode);
                        break;
                    case ')':
                        currNode = openParenStack.pop();
                        break;
                    case KLEENE:
                        let kleeneNode = new ASTNode(KLEENE, false, currNode.getParent(), index);
                        this.makeParentOf(kleeneNode, currNode);
                        currNode = kleeneNode;
                        break;
                    case PLUS:
                        let plusNode = new ASTNode(PLUS, false, currNode.getParent(), index);
                        this.makeParentOf(plusNode, currNode);
                        currNode = plusNode;
                        break;
                    case CONCAT:
                        if(!currNode.getParent()) {
                            let concatNode = new ASTNode(CONCAT, false, null, index);
                            this.makeParentOf(concatNode, currNode);
                            currNode = concatNode;
                        }
                        else {
                            let originalParent = currNode.getParent();
                            let parentSym = originalParent.getSymbol();
                            if(parentSym == CONCAT) {
                                let grandparent = originalParent.getParent();
                                let concatNode = new ASTNode(CONCAT, false, grandparent, index);
                                this.makeParentOf(concatNode, originalParent);
                                currNode = concatNode;
                            }
                            else {
                                let concatNode = new ASTNode(CONCAT, false, originalParent, index);
                                this.makeParentOf(concatNode, currNode);
                                currNode = concatNode;
                            }
                        }
                        break;

                    case UNION:
                        if(!currNode.getParent()) {
                            let unionNode = new ASTNode(UNION, false, null, index);
                            this.makeParentOf(unionNode, currNode);
                            currNode = unionNode;
                        }
                        else {
                            let originalParent = currNode.getParent();
                            let sym = originalParent.getSymbol();
                            if(sym == '(') {
                                let unionNode = new ASTNode(UNION, false, originalParent, index);
                                this.makeParentOf(unionNode, currNode);
                                currNode = unionNode;
                            }
                            else {
                                let grandparent = originalParent.getParent();
                                let unionNode = new ASTNode(UNION, false, grandparent, index);
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
                            currNode = new ASTNode(char, true, null, index);
                            this.rootNode = currNode;
                        }
                        else {
                            let symbolNode = new ASTNode(char, true, currNode, index);
                            currNode.addChild(symbolNode);
                            currNode = symbolNode;
                        }
                        // Add terminals to the regex's terminal set
                        if (char != SIGMA && char != EMPTY_SET && char != EMPTY) {
                            regex.addTerminal(char);
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

export default REParser;
