/* global __VERSION__ */

import Exporter from '@flapjs/services/export/Exporter.js';

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
        dst['_metadata'] = {
            name: session.sessionName,
            module: session.moduleID,
            // eslint-disable-next-line import/namespace
            version: __VERSION__ + ':' + session.module.version,
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
                    name: session.sessionName + this._fileType,
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
