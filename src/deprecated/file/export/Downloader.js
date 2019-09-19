export function downloadURL(filename, url)
{
    const element = document.createElement('a');
    const headerIndex = url.indexOf(';');
    url = url.substring(0, headerIndex + 1) + 'headers=Content-Disposition%3A%20attachment%3B%20filename=' + filename + ';' + url.substring(headerIndex + 1);
    element.setAttribute('href', url);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
    
    return Promise.resolve(url);
}

class Downloader
{
    constructor() {}

    downloadFile(fileName, downloadType, fileData, opts)
    {
        return Promise.resolve(fileData);
    }
}

export default Downloader;
