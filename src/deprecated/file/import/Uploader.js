class Uploader
{
    constructor() {}
	
    uploadFile(fileBlob) { return Promise.resolve(fileBlob); }
}

export default Uploader;
