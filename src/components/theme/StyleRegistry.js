class StyleRegistry
{
    constructor()
    {
        this.active = false;
        this.styleGroups = new Map();
        this.styleEntries = new Map();
    }

    setActive(active)
    {
        this.active = active;
    }

    /**
     * Registers a style entry. Order of registration does matter.
     *
     * @param name
     * @param type
     * @param group
     */
    registerStyle(name, type='color', group='default')
    {
        if (this.active)
        {
            throw new Error('Cannot register style after registry has been activated by a provider.');
        }

        const styleEntry = createStyleEntry(name, type, group);
        if (this.styleGroups.has(group))
        {
            this.styleGroups.get(group).add(name);
        }
        else
        {
            const set = new Set();
            set.add(name);
            this.styleGroups.set(group, set);
        }
        this.styleEntries.set(name, styleEntry);
        return styleEntry;
    }

    /**
     * Registers a computed style entry. Must be called AFTER the registered compute style name.
     *
     * @param name
     * @param computeName
     * @param computeFunction
     * @param type
     * @param group
     */
    registerComputedStyle(name, computeName, computeFunction='copy', type='color', group='default')
    {
        if (this.active)
        {
            throw new Error('Cannot register style after registry has been activated by a provider.');
        }
        
        const styleEntry = createStyleEntry(name, type, group, computeName, computeFunction);
        if (this.styleGroups.has(group))
        {
            this.styleGroups.get(group).add(name);
        }
        else
        {
            const set = new Set();
            set.add(name);
            this.styleGroups.set(group, set);
        }
        this.styleEntries.set(name, styleEntry);
        return styleEntry;
    }

    getStyleNames()
    {
        return this.styleEntries.keys();
    }

    getStyleNamesByGroup(group)
    {
        return this.styleGroups.get(group);
    }

    getStyleEntryByName(name)
    {
        return this.styleEntries.get(name);
    }

    getStyleEntries()
    {
        return this.styleEntries.values();
    }

    getStyleGroups()
    {
        return this.styleGroups.keys();
    }
}

function createStyleEntry(name, type='color', group='default', computeName = null, computeFunction='copy')
{
    return  { name, type, computeName, computeFunction, group };
}

export default StyleRegistry;
