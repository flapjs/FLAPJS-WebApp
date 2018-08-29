import MessageContainer from 'notification/MessageContainer.js';
import AutoSaver from 'util/AutoSaver.js';
import Config from 'config.js';

class Tutorial
{
  constructor()
  {
    this.app = null;
  }

  start(app)
  {
    this.app = app;

    const notification = app.notification;
    if (!AutoSaver.hasAutoSave())
    {
      notification.addMessage("message.tutorial.1");
      notification.addMessage("message.intro.2");
    }
  }
}

export default Tutorial;
