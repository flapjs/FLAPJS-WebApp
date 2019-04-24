import AbstractAutoSaveHandler from 'util/storage/AbstractAutoSaveHandler.js';
import * as ColorHelper from 'util/ColorHelper.js';
import SourceStyleEntry from 'util/theme/style/SourceStyleEntry.js';
import TransformStyleEntry from 'util/theme/style/TransformStyleEntry.js';

export const COLOR_STORAGE_ID = "prefs-color";

class ColorSaver extends AbstractAutoSaveHandler
{
  constructor(themeManager)
  {
    super();

    this._themeManager = themeManager;
  }

  initialize()
  {
    const root = document.getElementById("root");
    const themeManager = this._themeManager;

    function activeColor(value)
    {
      const color = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, false, color);
      const result = ColorHelper.RGBtoHEX(color);
      return result;
    }
    function liteColor(value)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      const inverted = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, true, inverted);
      ColorHelper.blendRGB(0.39, color, inverted, color);
      const result = ColorHelper.RGBtoHEX(color);
      return result;
    }
    function darkColor(value)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      const inverted = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, true, inverted);
      ColorHelper.blendRGB(0.2, color, inverted, color);
      const result = ColorHelper.RGBtoHEX(color);
      return result;
    }

    themeManager.register("--color-graph-node", "graph");
    themeManager.register("--color-graph-text", "graph");
    themeManager.register("--color-graph-select", "graph");

    themeManager.register("--color-accent", "general");
    themeManager.register("--color-primary", "general");
    themeManager.register("--color-primary-text", "general");
    themeManager.register("--color-primary-lite", "hidden", new TransformStyleEntry("--color-primary-lite",
      themeManager.getStyleByName("--color-primary"), liteColor));
    themeManager.register("--color-primary-dark", "hidden", new TransformStyleEntry("--color-primary-dark",
      themeManager.getStyleByName("--color-primary"), darkColor));

    themeManager.register("--color-background", "general");
    themeManager.register("--color-background-active", "hidden", new TransformStyleEntry("--color-background-active",
      themeManager.getStyleByName("--color-background"), activeColor));
    themeManager.register("--color-background-lite", "hidden", new TransformStyleEntry("--color-background-lite",
      themeManager.getStyleByName("--color-background"), liteColor));

    themeManager.register("--color-success", "general");
    themeManager.register("--color-warning", "general");

    themeManager.register("--color-surface", "surface");
    themeManager.register("--color-surface-text", "surface");
    themeManager.register("--color-surface-active", "hidden", new TransformStyleEntry("--color-surface-active",
      themeManager.getStyleByName("--color-surface"), activeColor));
    themeManager.register("--color-surface-lite", "hidden", new TransformStyleEntry("--color-surface-lite",
      themeManager.getStyleByName("--color-surface"), liteColor));
    themeManager.register("--color-surface-dark", "hidden", new TransformStyleEntry("--color-surface-dark",
      themeManager.getStyleByName("--color-surface"), darkColor));

    themeManager.register("--color-surface-error", "surface");
    themeManager.register("--color-surface-error-dark", "hidden", new TransformStyleEntry("--color-surface-error-dark",
      themeManager.getStyleByName("--color-surface-error"), darkColor));

    themeManager.register("--color-surface-success", "surface");
    themeManager.register("--color-surface-success-dark", "hidden",  new TransformStyleEntry("--color-surface-success-dark",
      themeManager.getStyleByName("--color-surface-success"), darkColor));

    themeManager.register("--color-surface-warning", "surface");
    themeManager.register("--color-surface-warning-dark", "hidden", new TransformStyleEntry("--color-surface-warning-dark",
      themeManager.getStyleByName("--color-surface-warning"), darkColor));

    themeManager.initialize(root);
  }

  destroy()
  {
    const themeManager = this._themeManager;
    themeManager.destroy();
  }

  update()
  {
    for(let style of this._themeManager.getStyles())
    {
      if(style instanceof TransformStyleEntry)
      {
        this._themeManager.setComputedValue(style.getName(), style.getValue());
      }
    }
  }

  //Override
  onAutoSaveLoad(dataStorage)
  {
    const themeManager = this._themeManager;
    const data = dataStorage.getDataAsObject(COLOR_STORAGE_ID);

    for(const key in data)
    {
      const style = themeManager.getStyleByName(key);
      if (style && style instanceof SourceStyleEntry)
      {
        style.setValue(data[key]);
      }
    }
  }

  //Override
  onAutoSaveUnload(dataStorage)
  {
    //Don't do anything...
  }

  //Override
  onAutoSaveUpdate(dataStorage)
  {
    const themeManager = this._themeManager;
    const data = {};

    for(let style of themeManager.getStyles())
    {
      if (style.getValue() !== themeManager.getDefaultValue(style.getName()))
      {
        data[style.getName()] = style.getValue();
      }
    }
    dataStorage.setDataAsObject(COLOR_STORAGE_ID, data);
  }

  getThemeManager()
  {
    return this._themeManager;
  }
}

export default ColorSaver;
