class Grammar
{
    constructor(text = '')
    {
        this._content = text;
    }

    clear()
    {
        this._content = '';
    }

    appendText(text)
    {
        this._content += text;
    }

    setText(text)
    {
        this._content = text;
    }

    getText()
    {
        return this._content;
    }
}

export default Grammar;