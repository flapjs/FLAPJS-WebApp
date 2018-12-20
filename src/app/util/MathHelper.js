export function guid()
{
  function s4()
  {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

export function lerp(a, b, dt)
{
  return a * (1 - dt) + b * dt;
};

export function stringHash(value="")
{
  let hash = 0;
  for(let i = 0, len = value.length; i < len; i++)
  {
    hash = Math.imul(31, h) + value.charCodeAt(i) | 0;
  }
  return hash;
};
