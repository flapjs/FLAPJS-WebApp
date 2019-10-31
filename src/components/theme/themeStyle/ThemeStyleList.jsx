import React from 'react';
import Style from './ThemeStyleList.module.css';

import { ThemeConsumer } from '../ThemeContext.jsx';
import ThemeStyleEntry from './ThemeStyleEntry.jsx';
import ThemeStyleGroup from './ThemeStyleGroup.jsx';
import StyleInput from '../sourceStyle/StyleInput.jsx';
import ComputedStyleInput from '../computedStyle/ComputedStyleInput.jsx';

/**
 * Accepts a function as its only child to render each style entry.
 *
 * @param props
 */
function ThemeStyleList(props)
{
    const sourceStyleRefs = new Map();

    return (
        <ThemeConsumer>
            {
                context =>
                {
                    const registry = context.registry;

                    const result = [];
                    for(const styleGroup of registry.getStyleGroups())
                    {
                        const groupResult = [];
                        for(const styleName of registry.getStyleNamesByGroup(styleGroup))
                        {
                            const styleEntry = registry.getStyleEntryByName(styleName);
                            let styleResult;
                            if (styleEntry.computeName)
                            {
                                const ref = sourceStyleRefs.get(styleEntry.computeName);
                                if (!ref)
                                {
                                    throw new Error(`Missing source compute style - the computed style '${styleName}' needs to be registered AFTER its source '${styleEntry.computeName}'.`);
                                }
                                styleResult = (
                                    <ThemeStyleEntry
                                        key={styleName}
                                        className={Style.computedEntry}
                                        title={styleName}>
                                        <ComputedStyleInput
                                            source={context.source}
                                            name={styleName}
                                            compute={ref}
                                            computeFunction={styleEntry.computeFunction} />
                                    </ThemeStyleEntry>
                                );
                            }
                            else
                            {
                                let ref;
                                if (sourceStyleRefs.has(styleName))
                                {
                                    ref = sourceStyleRefs.get(styleName);
                                }
                                else
                                {
                                    ref = React.createRef();
                                    sourceStyleRefs.set(styleName, ref);
                                }
                                styleResult = (
                                    <ThemeStyleEntry
                                        key={styleName}
                                        title={styleName}>
                                        <StyleInput
                                            ref={ref}
                                            source={context.source}
                                            name={styleName} />
                                    </ThemeStyleEntry>
                                );
                            }
    
                            groupResult.push(styleResult);
                        }

                        result.push(
                            <ThemeStyleGroup
                                key={styleGroup}
                                className={Style.groupEntry}
                                title={styleGroup}>
                                {groupResult}
                            </ThemeStyleGroup>
                        );
                    }

                    return (
                        <ul className={Style.container}>
                            {result.map(e => <li key={e.key}>{e}</li>)}
                        </ul>
                    );
                }
            }
        </ThemeConsumer>
    );
}

export default ThemeStyleList;
