import Notifications from 'system/notification/Notifications.js';
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
      Notifications.addMessage(I18N.toString("message.tutorial.1"));
      Notifications.addMessage(I18N.toString("message.intro.2"));
    }
  }
}

export default Tutorial;
