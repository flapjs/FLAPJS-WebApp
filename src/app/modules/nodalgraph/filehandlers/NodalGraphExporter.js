import SessionExporter from 'session/SessionExporter.js';

import JSONFileIcon from 'components/iconset/flat/JSONFileIcon.js';

class NodalGraphExporter extends SessionExporter
{
    constructor(jsonGraphParser)
    {
        super('.node.json');
        this._graphParser = jsonGraphParser;
    }

    /** @override */
    onExportSession(session, dst)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();
        const graphData = this._graphParser.objectify(graph);

        dst['graphData'] = graphData;
    }

    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.machine'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.machine.hint'); }
}

export default NodalGraphExporter;
