export function guid()
{
    function s4()
    {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function lerp(a, b, dt)
{
    return a * (1 - dt) + b * dt;
}

export function stringHash(value = '')
{
    let hash = 0;
    for (let i = 0, len = value.length; i < len; i++)
    {
        hash = Math.imul(31, hash) + value.charCodeAt(i) | 0;
    }
    return hash;
}


export function getDirectionalVector(x1, y1, x2, y2, dist = 1, angleOffset = 0, dst = { x: 0, y: 0 })
{
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx) + angleOffset;
    dst.x = Math.cos(angle) * dist;
    dst.y = Math.sin(angle) * dist;
    return dst;
}

export function getMidPoint(x1, y1, x2, y2, dst = { x: 0, y: 0 })
{
    dst.x = x1 + (x2 - x1) / 2;
    dst.y = y1 + (y2 - y1) / 2;
    return dst;
}
