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

export function out(msg)
{
  testBuffer.push(msg);
}

export function assertNotNull(value, msg=null)
{
  if (!value)
  {
    ++testFailures;
    testBuffer.push("= Failed: Value is null" + (msg ? " - " + msg : "."));
  }
  else
  {
    ++testSuccesses;
    testBuffer.push("= Passed!");
  }
}

export function assertEquals(expected, value, msg=null)
{
  if (expected != value)
  {
    ++testFailures;
    testBuffer.push("= Failed: Expected \'" + expected + ", but found \'" + value + "\'" + (msg ? " - " + msg : "."));
  }
  else
  {
    ++testSuccesses;
    testBuffer.push("= Passed!");
  }
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
