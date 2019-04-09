import { guid } from 'util/MathHelper.js';

class Message
{
  constructor(handler, value, type, tags, componentClass, componentProps)
  {
    this._handler = handler;
    this._id = guid();
    this._type = type;

    this.value = value;
    this.tags = tags;
    this.componentClass = componentClass;
    this.componentProps = componentProps;
  }

  close()
  {
    const messages = this._handler.getMessages();
    const index = messages.indexOf(this);
    if (index < 0) throw new Error("Trying to close an unopened notification message");
    messages.splice(index, 1);
  }

  getType()
  {
    return this._type;
  }

  getID()
  {
    return this._id;
  }

  getComponentClass()
  {
    return this.componentClass;
  }

  getComponentProps()
  {
    return this.componentProps;
  }

  hasTag(tag)
  {
    return this.tags.indexOf(tag) >= 0;
  }
}

class NotificationManager
{
  constructor()
  {
    this._messageQueue = [];
  }

  addMessage(value, type=null, tags=null, componentClass=null, componentProps=null, shouldReplaceRelated=true)
  {
    if (tags && shouldReplaceRelated)
    {
      this.clearMessages(tags);
    }

    const result = new Message(this, value, type || "default", tags || [], componentClass, componentProps);
    this._messageQueue.unshift(result);
  }

  addDefaultMessage(value, tags=null, componentClass=null, componentProps=null, shouldReplaceRelated=true)
  {
    this.addMessage(value, "default", tags, componentClass, componentProps, shouldReplaceRelated);
  }

  addErrorMessage(value, tags=null, componentClass=null, componentProps=null, shouldReplaceRelated=true)
  {
    this.addMessage(value, "error", tags, componentClass, componentProps, shouldReplaceRelated);
  }

  addWarningMessage(value, tags=null, componentClass=null, componentProps=null, shouldReplaceRelated=true)
  {
    this.addMessage(value, "warning", tags, componentClass, componentProps, shouldReplaceRelated);
  }

  clearMessages(tags=null)
  {
    if (!tags)
    {
      this._messageQueue.length = 0;
    }
    else
    {
      if (!Array.isArray(tags)) tags = [tags];

      let message;
      for(let i = this._messageQueue.length - 1; i >= 0; --i)
      {
        message = this._messageQueue[i];
        for(const tag of tags)
        {
          if (message.hasTag(tag))
          {
            this._messageQueue.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  hasMessages(tags=null)
  {
    if (!tags)
    {
      return this._messageQueue.length >= 0;
    }
    else
    {
      if (!Array.isArray(tags)) tags = [tags];

      for(let i = this._messageQueue.length - 1; i >= 0; --i)
      {
        message = this._messageQueue[i];
        for(const tag of tags)
        {
          if (message.hasTag(tag))
          {
            return true;
          }
        }
      }

      return false;
    }
  }

  getMessages()
  {
    return this._messageQueue;
  }
}
export default NotificationManager;
