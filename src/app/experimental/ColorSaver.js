import AbstractLocalSaver from 'deprecated/system/localsave/AbstractLocalSaver.js';
import LocalSave from 'deprecated/system/localsave/LocalSave.js';
import * as ColorHelper from 'util/ColorHelper.js';

class ColorSaver extends AbstractLocalSaver
{
  constructor(styleOpts, testOpts)
  {
    super();

    this._styleOpts = styleOpts;
    this._testOpts = testOpts;
    console.log(testOpts);
  }

  initialize()
  {
    const root = document.getElementById("root");
    const opts = this._styleOpts;
    const testOpts = this._testOpts;

    function activeColor(opt, value)
    {
      const color = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, false, color);
      const result = ColorHelper.RGBtoHEX(color);
      //Set style
      opts.getOptionByProp(opt.prop + "-active").setStyle(result);
      // update function to use StyleEntryVariable instead of StyleOption
      // console.log(testOpts.getStyles());
    }
    function liteColor(opt, value)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      const inverted = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, true, inverted);
      ColorHelper.blendRGB(0.39, color, inverted, color);
      const result = ColorHelper.RGBtoHEX(color);
      //Set style
      opts.getOptionByProp(opt.prop + "-lite").setStyle(result);
    }
    function darkColor(opt, value)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      const inverted = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.invertRGB(color, true, inverted);
      ColorHelper.blendRGB(0.2, color, inverted, color);
      const result = ColorHelper.RGBtoHEX(color);
      //Set style
      opts.getOptionByProp(opt.prop + "-dark").setStyle(result);
    }
    opts.registerStyleOption(root, "--color-graph-node", "color", "graph");
    // testOpts.register("--color-graph-node", "graph");
    // need to add more of these later
    opts.registerStyleOption(root, "--color-graph-text", "color", "graph");
    opts.registerStyleOption(root, "--color-graph-select", "color", "graph");

    opts.registerStyleOption(root, "--color-accent", "color", "general");
    opts.registerStyleOption(root, "--color-primary", "color", "general", (...args) => {
      liteColor(...args);
      darkColor(...args);
    });
    opts.registerStyleOption(root, "--color-primary-text", "color", "general");
    opts.registerStyleOption(root, "--color-primary-lite", "color", "hidden");
    opts.registerStyleOption(root, "--color-primary-dark", "color", "hidden");

    opts.registerStyleOption(root, "--color-background", "color", "general", (...args) => {
      activeColor(...args);
      liteColor(...args);
    });
    opts.registerStyleOption(root, "--color-background-active", "color", "hidden");
    opts.registerStyleOption(root, "--color-background-lite", "color", "hidden");

    opts.registerStyleOption(root, "--color-success", "color", "general");
    opts.registerStyleOption(root, "--color-warning", "color", "general");

    opts.registerStyleOption(root, "--color-surface", "color", "surface", (...args) => {
      activeColor(...args);
      liteColor(...args);
      darkColor(...args);
    });
    opts.registerStyleOption(root, "--color-surface-text", "color", "surface");
    opts.registerStyleOption(root, "--color-surface-active", "color", "surface");
    opts.registerStyleOption(root, "--color-surface-lite", "color", "hidden");
    opts.registerStyleOption(root, "--color-surface-dark", "color", "hidden");

    opts.registerStyleOption(root, "--color-surface-error", "color", "surface", darkColor);
    opts.registerStyleOption(root, "--color-surface-error-dark", "color", "hidden");
    opts.registerStyleOption(root, "--color-surface-success", "color", "surface", darkColor);
    opts.registerStyleOption(root, "--color-surface-success-dark", "color", "hidden");
    opts.registerStyleOption(root, "--color-surface-warning", "color", "surface", darkColor);
    opts.registerStyleOption(root, "--color-surface-warning-dark", "color", "hidden");

    opts.initialize();
    // add initialize here
  }

  destroy()
  {
    const opts = this._styleOpts;
    opts.terminate();

    //const testOpts = this._testOpts;
    //testOpts.destroy();
    // uncomment once done with other stuff
  }

  //Override
  onLoadSave()
  {
    const opts = this._styleOpts;
    // const testOpts = this._testOpts;
    const data = LocalSave.loadFromStorage("prefs-color");
    for(let prop in data)
    {
      const opt = opts.getOptionByProp(prop);
      // const testOpt = testOpts.getValue(prop);
      if (opt)
      {
        opt.setStyle(data[prop]);
        // testOpt.setValue(data[prop]);
      }
    }
  }

  //Override
  onUnloadSave()
  {
    //Don't do anything...
  }

  //Override
  onAutoSave()
  {
    const opts = this._styleOpts;
    const data = {};
    for(let opt of opts.getOptions())
    {
      if (!opt.isDefaultStyle())
      {
        data[opt.prop] = opt.getStyle();
      }
    }
    LocalSave.saveToStorage("prefs-color", data);
  }

  getStyleOpts()
  {
    return this._styleOpts;
  }
}

export default ColorSaver;
