class Downloader
{
  static downloadText(filename, data)
  {
    Downloader.downloadURL(filename, 'data:text/plain; charset=utf-8,' + encodeURIComponent(data));
  }

  static downloadSVG(filename, svg)
  {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], {type:'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = function() {
      ctx.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);

      const imageURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      Downloader.downloadURL(filename, imageURI);
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
}

export default Downloader;
