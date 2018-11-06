class Downloader
{
  static downloadText(filename, data)
  {
    Downloader.downloadURL(filename, Downloader.getTextDataURI(data));
  }

  static downloadSVG(filename, filetype, svg, width, height)
  {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], {type:'image/svg+xml;charset=utf-8'});
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
    image.onload = function() {
      ctx.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);

      const imageURI = canvas.toDataURL('image/'+filetype).replace('image'+filetype, 'image/octet-stream');
      Downloader.downloadURL(filename+'.'+filetype, imageURI);
    }
    image.src = url;
  }

  static downloadURL(filename, url)
  {
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }
  
  static getTextDataURI(data)
  {
    return 'data:text/plain; charset=utf-8,' + encodeURIComponent(data);
  }
}

export default Downloader;
