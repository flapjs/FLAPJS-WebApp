import SessionExporter from '@flapjs/session/helper/SessionExporter.js';

import { RunningManIcon as XMLFileIcon } from '@flapjs/components/icons/Icons.js';

class JFFExporter extends SessionExporter
{
    constructor(jffGraphParser)
    {
        super('.jff');
        this._graphParser = jffGraphParser;
    }

    /** @override */
    onExportSession(session, dst)
    {
        const graphController = session.graphController;
        const graph = graphController.getGraph();
        const graphData = this._graphParser.compose(graph);

        dst['graphData'] = graphData;
    }

    /** @override */
    onStringifySession(session, dst)
    {
        return new XMLSerializer().serializeToString(dst.graphData);
    }

    /** @override */
    getIconClass() { return XMLFileIcon; }
    /** @override */
    getLabel() { return 'file.export.jff'; }
    /** @override */
    getTitle() { return 'file.export.jff.hint'; }
}

export default JFFExporter;
