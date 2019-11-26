import SessionExporter from '@flapjs/session/loaders/SessionExporter.js';
import { INSTANCE as RE_PARSER } from '@flapjs/modules/re/loaders/REParser.js';
import { INSTANCE as AST_PARSER } from '@flapjs/services/expression/model/parser/ASTParser.js';
import { FileJSONIcon } from '@flapjs/components/icons/Icons.js';

/**
 * A class that represents a session exporter for the RE module.
 */
class REExporter extends SessionExporter
{
    constructor()
    {
        super('.re.json');
    }

    /** @override */
    onExportSession(session, dst)
    {
        const machineController = session.machineService.machineController;

        let machine = machineController.getMachine();
        let astRootNode = RE_PARSER.parse(machine);
        dst['machineData'] = {
            expression: machine.getExpression(),
            ast: AST_PARSER.compose(astRootNode)
        };
    }

    /** @override */
    getIconClass() { return FileJSONIcon; }
    /** @override */
    getLabel() { return 'file.export.machine'; }
    /** @override */
    getTitle() { return 'file.export.machine.hint'; }
}

export default REExporter;
