import React from 'react';
import Style from './LanguagePanel.css';

import IconButton from 'experimental/components/IconButton.js';

class LanguagePanel extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  renderLanguageButton(localizedName, langFile)
  {
    return (
      <IconButton key={langFile}
        className={Style.panel_button}
        title={localizedName}
        onClick={(e) => {
          I18N.fetchLanguageFile(langFile);
        }}>
      </IconButton>
    );
  }

  //Override
  render()
  {
    const module = this.props.currentModule;

    return (
      <div id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{I18N.toString("component.language.title")}</h1>
        </div>
        <div className={Style.panel_content}>
          {this.renderLanguageButton("English", "en_us")}
          {this.renderLanguageButton("Pirate Speak", "xx_pirate")}
        </div>
      </div>
    );
  }
}

export default LanguagePanel;
