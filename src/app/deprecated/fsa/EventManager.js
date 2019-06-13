import GraphNodeInitialEventHandler from './controller/events/GraphNodeInitialEventHandler.js';
import GraphNodeMoveEventHandler from './controller/events/GraphNodeMoveEventHandler.js';
import GraphNodeMoveAllEventHandler from './controller/events/GraphNodeMoveAllEventHandler.js';
import GraphEdgeMoveEventHandler from './controller/events/GraphEdgeMoveEventHandler.js';
import GraphEdgeDestinationEventHandler from './controller/events/GraphEdgeDestinationEventHandler.js';
import GraphEdgeLabelEventHandler from './controller/events/GraphEdgeLabelEventHandler.js';

import UserCreateNodeEventHandler from './controller/events/UserCreateNodeEventHandler.js';
import UserToggleNodeEventHandler from './controller/events/UserToggleNodeEventHandler.js';
import UserDeleteNodesEventHandler from './controller/events/UserDeleteNodesEventHandler.js';
import UserRenameNodeEventHandler from './controller/events/UserRenameNodeEventHandler.js';

import UserCreateEdgeEventHandler from './controller/events/UserCreateEdgeEventHandler.js';
import UserDeleteEdgeEventHandler from './controller/events/UserDeleteEdgeEventHandler.js';
import UserImportGraphEventHandler from './controller/events/UserImportGraphEventHandler.js';
import SafeGraphEventHandler from './controller/events/SafeGraphEventHandler.js';

import UserChangeMachineEventHandler from './controller/events/UserChangeMachineEventHandler.js';
import UserConvertMachineEventHandler from './controller/events/UserConvertMachineEventHandler.js';
import UserRenameMachineEventHandler from './controller/events/UserRenameMachineEventHandler.js';
import UserRenameSymbolEventHandler from './controller/events/UserRenameSymbolEventHandler.js';
import UserDeleteSymbolEventHandler from './controller/events/UserDeleteSymbolEventHandler.js';

class EventManager
{
    constructor(undoManager)
    {
        this.graphController = null;
        this.machineController = null;

        this.eventHandlers = [];

        this.undoManager = undoManager;
    }

    initialize(module)
    {
        this.graphController = module.getGraphController();
        this.machineController = module.getMachineController();
        
        const events = this.undoManager;

        this.eventHandlers.push(new GraphNodeMoveEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphNodeMoveAllEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphEdgeMoveEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphEdgeDestinationEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphNodeInitialEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphEdgeLabelEventHandler(events, this.graphController));

        this.eventHandlers.push(new UserCreateNodeEventHandler(events, this.graphController));
        this.eventHandlers.push(new UserRenameNodeEventHandler(events, this.graphController));
        this.eventHandlers.push(new UserToggleNodeEventHandler(events, this.graphController));
        this.eventHandlers.push(new UserDeleteNodesEventHandler(events, this.graphController));

        this.eventHandlers.push(new UserCreateEdgeEventHandler(events, this.graphController));
        this.eventHandlers.push(new UserDeleteEdgeEventHandler(events, this.graphController));

        this.eventHandlers.push(new UserImportGraphEventHandler(events, this.graphController, this.machineController));
        this.eventHandlers.push(new SafeGraphEventHandler(events, this.graphController, 'userPreChangeLayout', 'userPostChangeLayout'));

        this.eventHandlers.push(new UserChangeMachineEventHandler(events, this.machineController));
        this.eventHandlers.push(new UserConvertMachineEventHandler(events, this.machineController, this.graphController));
        this.eventHandlers.push(new UserRenameMachineEventHandler(events, this.machineController));
        this.eventHandlers.push(new UserRenameSymbolEventHandler(events, this.machineController, this.graphController));
        this.eventHandlers.push(new UserDeleteSymbolEventHandler(events, this.machineController, this.graphController));
    }

    destroy()
    {
        for(const handler of this.eventHandlers)
        {
            handler.destroy();
        }

        //TODO: Remove all event listeners...
        this.graphController.clearEventListeners();
    }
}

export default EventManager;
