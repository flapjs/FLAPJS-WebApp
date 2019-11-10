import OverviewPanel from './components/panels/OverviewPanel.jsx';
import AnalysisPanel from './components/panels/AnalysisPanel.jsx';
import TestingPanel from './components/panels/TestingPanel.jsx';

const MODULE = {
    id: 'pda',
    version: '1.0.0',
    services: {},
    renders: {
        drawer: [ OverviewPanel, AnalysisPanel, TestingPanel ]
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
