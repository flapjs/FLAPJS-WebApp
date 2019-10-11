class LabelFormatter
{
    formatLabel(target, nextLabel, prevLabel = null) { return nextLabel; }
    getDefaultLabel(target) { return ''; }

    formatNodeLabel(nextNodeLabel, prevNodeLabel = null)
    {
        return nextNodeLabel;
    }

    formatEdgeLabel(nextEdgeLabel, prevEdgeLabel = null)
    {
        return nextEdgeLabel;
    }

    getDefaultNodeLabel() { return ''; }
    getDefaultEdgeLabel() { return ''; }

    getNodeLabelFormatter()
    {
        return this.formatNodeLabel.bind(this);
    }

    getEdgeLabelFormatter()
    {
        return this.formatEdgeLabel.bind(this);
    } 
}
export default LabelFormatter;

export const DEFAULT_LABEL_FORMATTER = new LabelFormatter();
