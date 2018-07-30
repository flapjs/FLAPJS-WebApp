const WIDTH = 640;
const HEIGHT = 480;

class Downloader
{
  static downloadText(filename, data)
  {
    Downloader.downloadURL(filename, 'data:text/plain; charset=utf-8,' + encodeURIComponent(data));
  }

  static downloadSVG(filename, filetype, svg)
  {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], {type:'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = function() {
      ctx.canvas.width = WIDTH;
      ctx.canvas.height = HEIGHT;
      ctx.drawImage(image, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
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
}

export default Downloader;
