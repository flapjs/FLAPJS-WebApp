import React from 'react';
import Style from './LanguagePanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
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
                className={Style.language_button}
                title={localizedName}
                onClick={(e) => I18N.fetchLanguageFile(langFile)}>
            </IconButton>
        );
    }

    /** @override */
    render()
    {
        //const session = this.props.session;

        return (
            <PanelContainer id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={I18N.toString('component.language.title')}>
                <div className={Style.language_button_list}>
                    {this.renderLanguageButton('English', 'en_us')}
                    {this.renderLanguageButton('Pirate Speak', 'xx_pirate')}
                </div>
            </PanelContainer>
        );
    }
}

export default LanguagePanel;
