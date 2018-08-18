const I18N = {
  languageMapping: new Map(),
  fetchLanguageFile(langCode)
  {
    const BASE_URL = "lang/";

    console.log("Fetching language file \'" + langCode + "\'...");
    const request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
      if (request.readyState === 4/* READY */ &&
        request.status === 200/* GOT REPONSE */)
      {
        console.log("Loading language file...");
        I18N.loadLanguageFile(request.responseText);
        console.log("Language file loaded.");
      }
      else
      {
        console.log("Unable to find language file for \'" + langCode + "\'.");
      }
    };
    request.open("GET", BASE_URL + langCode + ".lang", true);
    request.send();
  },

  loadLanguageFile(langFile)
  {
    //Clear language mapping of any previous languages
    this.languageMapping.clear();

    //Load langugage file
    let separator, key, value;
    const lines = langFile.split("\n");
    for(const line of lines)
    {
      separator = line.indexOf('=');
      if (separator < 0) continue;

      key = line.substring(0, separator).trim();
      value = line.substring(separator + 1).trim();
      if (key.length == 0) continue;

      //TODO: debug message!
      console.log("KEY:" + key + " = VALUE:" + value);
      this.languageMapping.set(key, value);
    }
  },

  toString(langKey)
  {
    return this.languageMapping.get(langKey) || langKey;
  }
};
