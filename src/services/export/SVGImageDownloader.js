import { getFileExtFromName } from '@flapjs/util/loader/FileHelper.js';
import Downloader, { downloadURL } from './Downloader.js';

function getBlobFromSVG(svg)
{
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    return blob;
}

class SVGImageDownloader extends Downloader
{
    constructor() { super(); }

    /** @override */
    downloadFile(fileName, downloadType, fileData, opts)
    {
        if (fileData instanceof SVGElement)
        {
            const width = opts['width'] || 1;
            const height = opts['height'] || 1;
            const fileExt = getFileExtFromName(fileName);
            const imageType = opts['image-type'] || fileExt.substring(1);
            const blob = getBlobFromSVG(fileData);
            return new Promise((resolve, reject) =>
            {
                const url = URL.createObjectURL(blob);

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const pixelRatio = window.devicePixelRatio || 1;
                canvas.width = width * pixelRatio;
                canvas.height = height * pixelRatio;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

                const image = new Image();
                image.onload = () => 
                {
                    ctx.drawImage(image, 0, 0);
                    URL.revokeObjectURL(url);

                    const imageDataType = 'image/' + imageType;
                    const imageURI = canvas.toDataURL(imageDataType).replace(imageDataType, 'image/octet-stream');
                    downloadURL(fileName, imageURI);
                };
                image.src = url;
            });
        }
        else
        {
            throw new Error('Cannot download file data of this type - can only download svg elements');
        }
    }
}

export default SVGImageDownloader;
