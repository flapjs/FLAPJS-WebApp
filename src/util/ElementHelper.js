export function getElementFromRef(ref)
{
    if (typeof ref === 'function')
    {
        return ref.call(null);
    }
    else
    {
        return ref.current;
    }
}
