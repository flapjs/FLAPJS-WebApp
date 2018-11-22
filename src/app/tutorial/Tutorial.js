import Notification from 'system/notification/Notification.js';
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
    if (!LocalSave.existsInStorage("graph"))
    {
      Notification.addMessage(I18N.toString("message.tutorial.1"));
      Notification.addMessage(I18N.toString("message.intro.2"));
    }
  }
}

export default Tutorial;
