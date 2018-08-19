const I18N = {
  baseUrl: "lang/",
  languageMapping: new Map(),
  fetchLanguageFile(langCode, callback=null)
  {
    console.log("Fetching language file \'" + langCode + "\'...");
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4/* READY */ &&
        request.status === 200/* GOT REPONSE */)
      {
        const result = request.responseText;
        if (callback)
        {
          callback(result);
        }
        else
        {
          console.log("Loading language file \'" + langCode + "\'...");
          I18N.loadLanguageFile(result);
          console.log("Language file \'" + langCode + "\' loaded.");
        }
      }
    };
    request.onerror = function() {
      console.log("Unable to find language file for \'" + langCode + "\'.");
    };
    request.open("GET", this.baseUrl + langCode + ".lang", true);
    request.send();
  },

  loadLanguageFile(langFile)
  {
    //Clear language mapping of any previous languages
    this.languageMapping.clear();

    //Load langugage file
    let separator, key, value;
    const lines = langFile.split("\n");
    for(let line of lines)
    {
      line = line.trim();
      if (line.startsWith("//")) continue;
      if (line.startsWith("//TODO:"))
      {
        console.log("Warning - found incomplete lang file: " + line.substring("//".length).trim());
      }

      separator = line.indexOf('=');
      if (separator < 0) continue;

      key = line.substring(0, separator).trim();
      value = line.substring(separator + 1).trim();
      if (key.length == 0) continue;

      this.languageMapping.set(key, value);
    }
  },

  toString(langKey)
  {
    return this.languageMapping.get(langKey) || langKey;
  }
};
