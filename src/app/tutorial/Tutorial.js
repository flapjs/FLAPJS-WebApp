import MessageContainer from 'notification/MessageContainer.js';
import LocalSave from 'system/localsave/LocalSave.js';
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
    if (!LocalSave.existsInStorage("graph"))
    {
      notification.addMessage("message.tutorial.1");
      notification.addMessage("message.intro.2");
    }
  }
}

export default Tutorial;
