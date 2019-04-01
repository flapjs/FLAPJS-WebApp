import StyleEntry from './StyleEntry.js';

const BASE_URL = "color/";

class StylePreset
{
  constructor(presetName)
  {
    this._name = presetName;

    this._styles = new Map();
  }

  static fetchPresetFile(presetName, callback)
  {
    console.log("[StylePreset] Fetching preset file \'" + presetName + "\'...");
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4/* READY */ &&
        request.status === 200/* GOT REPONSE */)
      {
        const result = request.responseText;
        callback(result);
      }
    };
    request.onerror = function() {
      console.log("[StylePreset] Unable to find preset file for \'" + presetName + "\'.");
    };
    request.open("GET", BASE_URL + presetName + ".theme", true);
    request.setRequestHeader("Content-Type", "text/strings");
    request.send();
  }

  static loadPresetFile(presetName, presetData, callback)
  {
    console.log("[StylePreset] Loading preset file \'" + presetName + "\'...");

    const result = new StylePreset(presetName);

    //Load preset file
    let separator, key, value;
    const lines = presetData.split("\n");
    for(let line of lines)
    {
      line = line.trim();
      if (line.startsWith("//")) continue;
      if (line.startsWith("//TODO:"))
      {
        console.log("[StylePreset] Warning - found incomplete preset file: " + line.substring("//".length).trim());
      }

      separator = line.indexOf('=');
      if (separator < 0) continue;

      key = line.substring(0, separator).trim();
      value = line.substring(separator + 1).trim();
      if (key.length == 0) continue;

      result._styles.set(key, new StyleEntry(key, value));
    }

    console.log("[StylePreset] Preset file \'" + presetName + "\' loaded.");

    callback(result);
  }

  getStyles() { return this._styles.values(); }
  getStyle(variableName) { return this._styles.get(variableName); }
  getName() { return this._name; }
}

export default StylePreset;
