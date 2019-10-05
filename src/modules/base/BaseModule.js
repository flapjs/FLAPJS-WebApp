import BasePanels from './BasePanels.jsx';

const MODULE = {
    id: 'base',
    onInitialization(session)
    {
        session.panels.push(...BasePanels);
    },
    onTermination(session)
    {
        session.panels.length = 0;
    }
};

export default MODULE;

