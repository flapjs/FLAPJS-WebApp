export const FILE_TYPE_PNG = "png";
export const FILE_TYPE_JPG = "jpg";

export function downloadText(filename, textData)
{
  downloadURL(filename, getTextDataURI(textData));
}

export function downloadSVG(filename, filetype, svg, width, height)
{
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const blob = new Blob([svgString], {type:'image/svg+xml'});
  const url = URL.createObjectURL(blob);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const image = new Image();
  image.onload = () => {
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);

    const imageURI = canvas.toDataURL('image/' + filetype).replace('image/' + filetype, 'image/octet-stream');
    downloadURL(filename + '.' + filetype, imageURI);
  };
  image.src = url;
}

export function downloadURL(filename, url)
{
  const element = document.createElement('a');
  const headerIndex = url.indexOf(";");
  url = url.substring(0, headerIndex + 1) + "headers=Content-Disposition%3A%20attachment%3B%20filename=" + filename + ";" + url.substring(headerIndex + 1);
  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

function getTextDataURI(data)
{
  return 'data:text/plain; charset=utf-8,' + encodeURIComponent(data);
}
