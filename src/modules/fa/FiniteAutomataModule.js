import AnalysisPanel from '@flapjs/modules/fa/components/panels/AnalysisPanel.jsx';
import TestingPanel from '@flapjs/modules/fa/components/panels/TestingPanel.jsx';
import OverviewPanel from '@flapjs/modules/fa/components/panels/OverviewPanel.jsx';

const MODULE = {
    id: 'fa',
    version: '1.0.0',
    services: {},
    renders: {
        drawer: [
            OverviewPanel,
            TestingPanel,
            AnalysisPanel
        ]
    },
    reducer(state, action)
    {
        switch(action.type)
        {
            default:
                throw new Error(`Unsupported action ${action}.`);
        }
    },
    load(session)
    {
    },
    unload(session)
    {
    }
};

export default MODULE;
