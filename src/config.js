const LOCAL_STORAGE_ID = "config";

const cfg = {};
cfg._resetOnLoad = false;
export default cfg;

//General
cfg.CLEAR_GRAPH_MESSAGE = "Any unsaved changes will be lost. Are you sure you want to continue?";
cfg.EXIT_WINDOW_MESSAGE = "Any unsaved changes will be lost. Are you sure you want to leave?";

cfg.NO_ERRORS_MESSAGE = "Hooray! No more errors!";
cfg.MACHINE_ERROR_EDGE_PLACEHOLDER_MESSAGE = "Incomplete transitions";
cfg.MACHINE_ERROR_EDGE_EMPTY_MESSAGE = "Empty transitions";
cfg.MACHINE_ERROR_EDGE_DUPE_MESSAGE = "Duplicate transitions";
cfg.MACHINE_ERROR_NODE_UNREACHABLE_MESSAGE = "Unreachable node";
cfg.MACHINE_ERROR_NODE_MISSING_MESSAGE = "Missing transitions";

cfg.MACHINE_ERRORS_MESSAGE_TAG = "machineError";

cfg.ERROR_CHECK_INTERVAL = 2000;
cfg.GRAPH_IMMEDIATE_INTERVAL = 50;

//Toolbar
cfg.DEFAULT_MACHINE_NAME = "Untitled";

//Testing Panel
cfg.PLACEHOLDER_TEXT = "Test string";

//Controller
cfg.SMOOTH_OFFSET_DAMPING = 0.4;
cfg.SCROLL_SENSITIVITY = 1.0 / 300.0;
cfg.MIN_SCALE = 0.1;
cfg.MAX_SCALE = 10;

//Workspace
cfg.EMPTY_MESSAGE = "Double-tap to create a node";
cfg.INIT_WAITTIME = 5000;

//NodalGraph
cfg.STR_TRANSITION_DEFAULT_LABEL = "";
cfg.STR_STATE_LABEL = "q";
cfg.PARALLEL_EDGE_HEIGHT = 10;
cfg.SELF_LOOP_HEIGHT = 32;

//Input Fields
cfg.SUBMIT_KEY = 13; //ENTER
cfg.CLEAR_KEY = 27; //ESCAPE
cfg.TAB_KEY = 9; //TAB

/** LEGACY CONFIG **/

//Input
cfg.DELETE_KEY = 8; //DELETE
cfg.DELETE_FORWARD_KEY = 46; //DELETE FORWARD

//Geometry
cfg.DEFAULT_GRAPH_SIZE = 300;

cfg.NODE_RADIUS = 16;
cfg.NODE_RADIUS_SQU = cfg.NODE_RADIUS * cfg.NODE_RADIUS;
cfg.NODE_DIAMETER = cfg.NODE_RADIUS * 2;
cfg.NODE_RADIUS_INNER = 12;

cfg.INITIAL_MARKER_OFFSET_X = -(cfg.NODE_RADIUS + (cfg.NODE_RADIUS / 3));//Not centered, but a little closer to tip

cfg.EDGE_RADIUS = 12;
cfg.EDGE_RADIUS_SQU = cfg.EDGE_RADIUS * cfg.EDGE_RADIUS;
cfg.ARROW_WIDTH = 10;
cfg.PLACEHOLDER_LENGTH = cfg.NODE_RADIUS * 3;
cfg.ENDPOINT_RADIUS = 6;
cfg.ENDPOINT_RADIUS_SQU = cfg.ENDPOINT_RADIUS * cfg.ENDPOINT_RADIUS;

cfg.HOVER_RADIUS_OFFSET = 4;
cfg.CURSOR_RADIUS = 4;
cfg.CURSOR_RADIUS_SQU = cfg.CURSOR_RADIUS * cfg.CURSOR_RADIUS;

//Interface
cfg.DOUBLE_TAP_TICKS = 600;
cfg.LONG_TAP_TICKS = 600;
cfg.SPAWN_RADIUS = 64;
cfg.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE = true;
cfg.DRAGGING_BUFFER = 18;
cfg.DRAGGING_BUFFER_SQU = cfg.DRAGGING_BUFFER * cfg.DRAGGING_BUFFER;

//Graph sorting
cfg.PADDING_RADIUS_SQU = 2304;


/** LOCAL STORAGE FUNCTIONS **/

//check if browser support local storage
export function doesSupportLocalStorage() {
  return typeof(Storage) !== 'undefined';
}

export function loadConfig() {
  const jsonString = localStorage.getItem(LOCAL_STORAGE_ID);
  if (!jsonString) return null;
  try
  {
    const jsonData = JSON.parse(jsonString);
    if (jsonData['_resetOnLoad'] == true)
    {
      //Reset the config
      clearConfig();
      //Save a new config
      saveConfig();
    }
    else
    {
      Object.assign(cfg, jsonData);
    }
  }
  catch (e)
  {
    //Reset the config
    clearConfig();
  }
};

export function saveConfig() {
  try
  {
    const jsonString = JSON.stringify(cfg);
    localStorage.setItem(LOCAL_STORAGE_ID, jsonString);
  }
  catch (e)
  {
    //Reset the config
    clearConfig();
  }
};

export function clearConfig() {
  localStorage.removeItem(LOCAL_STORAGE_ID);
};
