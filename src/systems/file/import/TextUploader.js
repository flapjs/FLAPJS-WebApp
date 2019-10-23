import Uploader from './Uploader.js';

class TextUploader extends Uploader
{
    constructor() { super(); }

    /** @override */
    uploadFile(fileBlob)
    {
        return new Promise((resolve, reject) =>
        {
            const reader = new FileReader();

            // If file reading successful...
            reader.addEventListener('load', event =>
            {
                const fileData = event.target.result;
                resolve(fileData);
            });

            // If file reading failed...
            reader.addEventListener('error', event =>
            {
                reject(new Error('Unable to import file: ' + event.target.error.code));
            });

            // Now let's begin the read...
            reader.readAsText(fileBlob);
        });
    }
}

export default TextUploader;
