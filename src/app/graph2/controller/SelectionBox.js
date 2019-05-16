class SelectionBox
{
    constructor()
    {
        this._boundingBox = {
            fromX: 0, fromY: 0,
            toX: 0, toY: 0,
            visible: false
        };

        this.targets = [];
    }

    getBoundingBox() { return this._boundingBox; }

    getSelection(graph, forceUpdate = false)
    {
        if (forceUpdate)
        {
            const box = this._boundingBox;
            const mx = Math.max(box.toX, box.fromX);
            const my = Math.max(box.toY, box.fromY);
            const lx = Math.min(box.toX, box.fromX);
            const ly = Math.min(box.toY, box.fromY);
            this.clearSelection();
            getNodesWithin(graph, lx, ly, mx, my, this.targets);
        }

        return this.targets;
    }

    beginSelection(graph, x, y)
    {
        const box = this._boundingBox;
        box.fromX = box.toX = x;
        box.fromY = box.toY = y;
        this.clearSelection();

        box.visible = true;
    }

    updateSelection(graph, x, y)
    {
        const box = this._boundingBox;
        box.toX = x;
        box.toY = y;
        this.getSelection(graph, true);
    }

    endSelection(graph, x, y)
    {
        const box = this._boundingBox;
        box.toX = x;
        box.toY = y;
        this.getSelection(graph, true);

        box.visible = false;
    }
	
    isTargetInSelection(target) { return this.targets.includes(target); }
    hasSelection() { return this.targets.length > 0; }
    clearSelection() { this.targets.length = 0; }
    isVisible() { return this._boundingBox.visible; }
}

function getNodesWithin(graph, x1, y1, x2, y2, dst)
{
    const fromX = Math.min(x1, x2);
    const fromY = Math.min(y1, y2);
    const toX = Math.max(x1, x2);
    const toY = Math.max(y1, y2);

    for (const node of graph.getNodes())
    {
        if (node.x >= fromX && node.x < toX &&
			node.y >= fromY && node.y < toY)
        {
            dst.push(node);
        }
    }
    return dst;
}

export default SelectionBox;
