export const FILE_TYPE_PNG = 'png';
export const FILE_TYPE_JPG = 'jpg';
export const FILE_TYPE_SVG = 'svg';

export function downloadText(filename, textData)
{
    downloadURL(filename, getTextDataURI(textData));
}

function createBlobFromSVG(svg)
{
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    return blob;
}

export function downloadImageFromSVG(filename, filetype, svg, width, height)
{
    const blob = createBlobFromSVG(svg);
    switch (filetype)
    {
    case FILE_TYPE_PNG:
    case FILE_TYPE_JPG:
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

                const imageURI = canvas.toDataURL('image/' + filetype).replace('image/' + filetype, 'image/octet-stream');
                downloadURL(filename + '.' + filetype, imageURI);
            };
            image.src = url;
        }
        break;
    case FILE_TYPE_SVG:
        {
            const reader = new FileReader();
            reader.onload = () => 
            {
                downloadURL(filename + '.' + filetype, reader.result);
            };
            reader.readAsDataURL(blob);
        }
        break;
    default:
        throw new Error('Unknown file type \'' + filetype + '\'');
    }
}

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
}

function getTextDataURI(data)
{
    return 'data:text/plain; charset=utf-8,' + encodeURIComponent(data);
}
