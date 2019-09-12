import Exporter from 'util/file/export/Exporter.js';

class SessionExporter extends Exporter
{
    constructor(fileType)
    {
        super();

        this._fileType = fileType;
    }

    onExportSession(session, dst)
    {
    }

    onPostExportSession(session, dst)
    {
        const currentModule = session.getCurrentModule();

        dst['_metadata'] = {
            name: session.getProjectName(),
            module: currentModule.getModuleName(),
            version: process.env.VERSION + ':' + currentModule.getModuleVersion(),
            timestamp: new Date().toString()
        };
    }

    onStringifySession(session, dst)
    {
        return JSON.stringify(dst);
    }

    /** @override */
    exportTarget(exportType, target)
    {
        return new Promise((resolve, reject) =>
        {
            const session = target;

            try
            {
                let data = {};
                this.onExportSession(session, data);
                this.onPostExportSession(session, data);
                data = this.onStringifySession(session, data);

                resolve({
                    name: session.getProjectName() + this._fileType,
                    type: 'text',
                    data: data
                });
            }
            catch(e)
            {
                reject(e);
            }
        });
    }
}

export default SessionExporter;
