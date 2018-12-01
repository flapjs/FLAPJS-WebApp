const TEST_DIR = './src/debug/test/';
const fs = require('fs');

//For unit testing...
let testBuffer = [];
let testSuccesses = 0;
let testFailures = 0;

//Start of program

console.error("Preparing tests...");
const files = fs.readdirSync(TEST_DIR);
console.error("Starting " + files.length + " test(s)...");
console.error("- - - - - - - - - - - - - - - - - -\n");
const length = files.length;
for(let i = 0; i < length; ++i)
{
  const file = files[i];
  let success = true;
  console.error("== TEST #" + i + " == (" + file + ")");
  {
    try
    {
      testBuffer.length = 0;
      testSuccesses = 0;
      testFailures = 0;
      require('./test/' + file);
      success = testFailures == 0;

      if (!success)
      {
        while(testBuffer.length > 0)
        {
          const msg = testBuffer.shift();
          console.error(msg);
        }
      }

      ++testSuccesses;
    }
    catch(e)
    {
      console.error(e);
      success = false;
      ++testFailures;
    }
  }
  const totals = "(" + testSuccesses + "/" + (testSuccesses + testFailures) + ")";
  console.error("== > " + (success ? "SUCCESS!" : "FAILURE!") + " " + totals + "\n");
}

console.error("- - - - - - - - - - - - - - - - - -\n");

//End of program
function format(element, depth=0)
{
  if (depth > 100) return element;

  if (!element)
  {
    return element;
  }
  else if (typeof element === 'string')
  {
    return element;
  }
  else if (typeof element === 'object')
  {
    if (Array.isArray(element) || typeof element[Symbol.iterator] === 'function')
    {
      const className = element.constructor.name || "Iterator";
      let msg = "[";
      for(const e of element)
      {
        if (msg.length > 1) msg += ", ";
        msg += format(e, depth + 1);
      }
      msg += "]";
      return className + msg;
    }
    else
    {
      return JSON.stringify(element, null, 2);
    }
  }
  else
  {
    return element;
  }
}

export function out(...msg)
{
  for(let i = 0, len = msg.length; i < len; ++i)
  {
    const element = msg[i];
    msg[i] = format(element);
  }
  testBuffer.push(msg.join(", "));
}

export function assertNotNull(value, msg=null)
{
  assert(value, "null check - " + msg);
}

export function assertEquals(expected, value, msg=null)
{
  assert(value == expected, msg);
}

export function assert(condition, msg=null)
{
  if (!condition)
  {
    ++testFailures;
    testBuffer.push("= Failed" + (msg ? " - " + msg : "."));
  }
  else
  {
    ++testSuccesses;
    testBuffer.push("= Passed!");
  }
}
