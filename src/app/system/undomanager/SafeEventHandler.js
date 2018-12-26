import AbstractEventHandler from './AbstractEventHandler.js';

class SafeEventHandler extends AbstractEventHandler
{
  constructor(executeCallback)
  {
    super();

    this._event = executeCallback;

    this.onPreEvent();
    this.onEvent();
    this.onPostEvent();
  }

  onPreEvent() {}
  onPostEvent() {}

  onEvent()
  {
    this._event.call(null);
  }
}
export default SafeEventHandler;
