class Logger
{
  static out(tag, message)
  {
    const result = "[" + tag + "] " + message;
    if (console && typeof console['log'] === 'function')
    {
      console['log'].call(result);
    }
  }
}

export default Logger;
