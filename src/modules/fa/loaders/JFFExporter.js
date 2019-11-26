import SessionExporter from '@flapjs/session/loaders/SessionExporter.js';
import { FileXMLIcon } from '@flapjs/components/icons/Icons.js';
import { INSTANCE as JFF_PARSER } from '@flapjs/modules/fa/loaders/JFFGraphParser.js';

class JFFExporter extends SessionExporter
{
    constructor()
    {
        super('.jff');
    }

    /** @override */
    onExportSession(session, dst)
    {
        const graphController = session.graphService.graphController;
        const graph = graphController.getGraph();
        const graphData = JFF_PARSER.compose(graph);

        dst['graphData'] = graphData;
    }

    /** @override */
    onStringifySession(session, dst)
    {
        return new XMLSerializer().serializeToString(dst.graphData);
    }

    /** @override */
    getIconClass() { return FileXMLIcon; }
    /** @override */
    getLabel() { return 'file.export.jff'; }
    /** @override */
    getTitle() { return 'file.export.jff.hint'; }
}

export default JFFExporter;
