import InputHandler from './InputHandler.js';

class GraphNodeCreateInputHandler extends InputHandler
{
    constructor()
    {
        super();
    }

    /** @override */
    isTargetable(inputController, pointer, target, targetType)
    {
        return targetType === 'none';
    }

    /** @override */
    onDblAction(inputController, graphController, pointer, target)
    {
        let x = pointer.x;
        let y = pointer.y;

        if (inputController._snapToGrid)
        {
            const snapSize = inputController._snapSize;
            x = Math.round(x / snapSize) * snapSize;
            y = Math.round(y / snapSize) * snapSize;
        }

        //Create node at position
        const node = graphController.createNode(x, y);
        //TODO: this allows nodes to move away from other nodes
        //But undoManager does not recognize it.
        //graphController.moveNodeTo(pointer, node, x, y);
        return true;
    }
}

export default GraphNodeCreateInputHandler;
