
import {isEquivalentFSA} from 'modules/fsa2/machine/FSAUtils.js';
import { JSON as JSONGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import FSA from 'modules/fsa2/machine/FSA.js';
const CHANNEL_NAME = "flapjs";
/*


<select id="bird">
{session.getApp()._broadcast.sessionIDs.map(e => <option value={e}>{e}</option>)}
</select>
<button onClick={e => {
const value = document.querySelector('#bird').value;
alert(value);
app._broadcast.test_equivalence(value, (result) => {
  alert("The result is: " + result);
});
}}>Test Equal</button>


*/


class Broadcast
{
  static initBroadcast()
  {
    if ('BroadcastChannel' in self) {
      const sessionID = session.getSessionID();
      const channel = new BroadcastChannel(CHANNEL_NAME);
      this._broadcast = new Broadcast(channel, sessionID, session);
    }
  }

  //channel is the BroadcastChannel object
  constructor(channel, sessionID, session)
  {
    this.channel = channel;
    this.sessionID = sessionID;
    this.channel.onmessage = this.onmessage.bind(this);
    this.channel.postMessage({action_type: "newSession",
                              sessionID:   sessionID,
                              objectID:    null,
                              info:        null,
                              event_result:null});
    this.session = session;
    this.sessionIDs = [];

    this.callback = null;

    window.addEventListener('beforeunload', (event) => {
      const sessionID = this.session.getSessionID();
      this.channel.postMessage({action_type: "deleteSession",
                                sessionID:   sessionID,
                                objectID:    None,
                                info:        None,
                                event_result:None});
    });
  }

  onmessage(ev)
  {
    switch(ev.data.action_type){
      case "newSession":
        if (ev.data.sessionID != this.sessionID && !this.sessionIDs.includes(ev.data.sessionID))
        {
          this.sessionIDs.push(ev.data.sessionID);
          this.channel.postMessage({action_type: "newSession",
                                    sessionID:   this.sessionID,
                                    objectID:    null,
                                    info:        null,
                                    event_result:null});
        }
        break;

      case "deleteSession":
        this.sessionIDs.splice(this.sessionIDs.indexOf(ev.data.sessionID),1);
        if (ev.data.sessionID == this.sessionID)
        {
          this.channel.close();
        }

        break;

      case "test_equivalence":
        if (ev.data.objectID == this.sessionID){
          //post message back to the session which request sessionID
          const current_machine = this.session.getCurrentModule().getMachineController().getMachineBuilder().getMachine();
          const graph = JSONGraphParser.parse(ev.data.info)
          const machine = this.session.getCurrentModule().getMachineController().getMachineBuilder().attemptBuild(graph,new FSA())
          const result  = isEquivalentFSA(machine, current_machine);

          this.channel.postMessage({action_type: "test_equivalence_result",
                                    sessionID:   this.sessionID,
                                    objectID:    ev.data.sessionID,
                                    info:        null,
                                    event_result:result});

        }
        break;
      case "test_equivalence_result":
        if (ev.data.objectID == this.sessionID){
          const result = ev.data.event_result;
          if (this.callback)
          {
            this.callback(result);
          }
        }
        break;
    }
  }

  test_equivalence(objectID, callback)
  {
    const graph = this.session.getCurrentModule().getGraphController().getGraph();
    const graphdata = JSONGraphParser.objectify(graph);
    this.channel.postMessage({action_type: "test_equivalence",
                              sessionID:   this.sessionID,
                              objectID:    objectID,
                              info:        graphdata,
                              event_result:null});
    this.callback = callback;
  }
}

export default Broadcast;
