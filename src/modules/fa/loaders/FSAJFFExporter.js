import SessionExporter from '@flapjs/session/helper/SessionExporter.js';

import { RunningManIcon as XMLFileIcon } from '@flapjs/components/icons/Icons.js';

class FSAJFFExporter extends SessionExporter
{
    constructor(jffGraphParser)
    {
        super('.jff');
        this._graphParser = jffGraphParser;
    }

    /** @override */
    onExportSession(session, dst)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();
        dst['graphData'] = this._graphParser.objectify(graph);
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

export default FSAJFFExporter;
