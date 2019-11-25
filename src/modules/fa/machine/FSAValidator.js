import AbstractMachineValidator from '@flapjs/services/machine/AbstractMachineValidator.js';
import SuccessMessage from '@flapjs/services/notification/components/messages/SuccessMessage.jsx';

import * as FSANotifications from '@flapjs/modules/fa/components/messages/FSANotifications.js';

import
{
    ERROR_UNREACHABLE_STATE,
    ERROR_DUPLICATE_STATE,
    ERROR_INCOMPLETE_TRANSITION,
    ERROR_DUPLICATE_TRANSITION,
    ERROR_MISSING_TRANSITION,
    ERROR_EMPTY_TRANSITION
} from '@flapjs/modules/fa/machine/FSAMachineBuilder.js';


class FSAValidator extends AbstractMachineValidator
{
    constructor()
    {
        super();
    }

    /** @override */
    validate(machineController)
    {
        let machineBuilder = machineController.getMachineBuilder();
        let errors = machineBuilder._errors;
        let warnings = machineBuilder._warnings;

        let dispatch = this.session.notificationService.getProvider().dispatch;
        dispatch({ type: 'clear', tags: [ 'error' ]});

        if (errors && errors.length <= 0 && warnings.length <= 0)
        {
            dispatch({ type: 'push', content: 'message.error.none', message: SuccessMessage, tags: [ 'error' ]});
        }
        else
        {
            let props = {
                machineController,
                graphController: this.graphController,
                session: this.session
            };
            for (let warning of warnings)
            {
                switch (warning.name)
                {
                    case ERROR_UNREACHABLE_STATE:
                        dispatch({
                            type: 'push',
                            content: warning.nodes,
                            message: FSANotifications.StateUnreachableMessage,
                            tags: [ 'error' ],
                            props,
                            replace: false
                        });
                        break;
                }
            }

            for (const error of errors)
            {
                switch (error.name)
                {
                    case ERROR_DUPLICATE_STATE:
                        dispatch({
                            type: 'push',
                            content: {
                                text: 'Found duplicate nodes of similar names',
                                targets: error.nodes
                            },
                            message: FSANotifications.StateLayoutMessage,
                            tags: [ 'error' ],
                            props,
                            replace: false
                        });
                        break;
                    case ERROR_INCOMPLETE_TRANSITION:
                        dispatch({
                            type: 'push',
                            content: {
                                text: 'message.error.incomplete',
                                targets: error.edges
                            },
                            message: FSANotifications.TransitionLayoutMessage,
                            tags: [ 'error' ],
                            props,
                            replace: false
                        });
                        break;
                    case ERROR_DUPLICATE_TRANSITION:
                        dispatch({
                            type: 'push',
                            content: {
                                text: 'message.error.dupe',
                                targets: error.edges
                            },
                            message: FSANotifications.TransitionLayoutMessage,
                            tags: [ 'error' ],
                            props,
                            replace: false
                        });
                        break;
                    case ERROR_MISSING_TRANSITION:
                        dispatch({
                            type: 'push',
                            content: {
                                targets: [ error.nodes ],
                                symbol: error.symbols
                            },
                            message: FSANotifications.StateMissingMessage,
                            tags: [ 'error' ],
                            props,
                            replace: false
                        });
                        break;
                    case ERROR_EMPTY_TRANSITION:
                        dispatch({
                            type: 'push',
                            content: {
                                text: 'message.error.empty',
                                targets: error.edges
                            },
                            message: FSANotifications.TransitionLayoutMessage,
                            tags: [ 'error' ],
                            props,
                            replace: false
                        });
                        break;
                }
            }
        }
    }
}

export default FSAValidator;
