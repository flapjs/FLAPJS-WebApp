import MessageContainer from 'notification/MessageContainer.js';
import AutoSaver from 'util/AutoSaver.js';
import Config from 'config.js';

class Tutorial
{
  constructor(app)
  {
    this.app = app;
  }

  start()
  {
    const notification = this.app.notification;
    if (!AutoSaver.hasAutoSave())
    {
      notification.addMessage("message.tutorial.1");
      notification.addMessage("message.intro.2");
      notification.addMessage("message.intro.1");
    }
  }
}

export default Tutorial;
