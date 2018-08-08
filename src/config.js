const LOCAL_STORAGE_ID = "config";

const cfg = {};
export default cfg;

//General
cfg.CLEAR_GRAPH_MESSAGE = "Any unsaved changes will be lost. Are you sure you want to continue?";
cfg.EXIT_WINDOW_MESSAGE = "Any unsaved changes will be lost. Are you sure you want to leave?";

//Toolbar
cfg.DEFAULT_MACHINE_NAME = "Untitled";

//Status Button
cfg.ACTIVE_PENDING_COLOR = "white";
cfg.ACTIVE_SUCCESS_COLOR = "lime";
cfg.ACTIVE_FAILURE_COLOR = "red";
cfg.INACTIVE_COLOR = "gray";

//Testing Panel
cfg.PLACEHOLDER_TEXT = "Test string";

//Overview Panel
cfg.DEFAULT_COLOR = "gray";
cfg.DEFAULT_CUSTOM_COLOR = "white";
cfg.EDIT_COLOR = "rgba(255,255,255,0.1)";
cfg.ERROR_COLOR = "rgba(255,0,0,0.7)";
cfg.DEFAULT_BACKGROUND = "#4D4D4D";
cfg.DEFAULT_CUSTOM_BACKGROUND = "#4D4D4D";
cfg.ERROR_BACKGROUND = "rgba(255,0,0,0.5)";

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
cfg.STR_TRANSITION_PROXY_LABEL = "?";
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

//Colors
cfg.STATE_BASE_COLOR = "#FEE781";
cfg.STATE_LINE_COLOR = "black";
cfg.STATE_TEXT_COLOR = "black";
cfg.TRANSITION_COLOR = "black";
cfg.TRANSITION_TEXT_COLOR = "black";
cfg.GRAPH_INFO_COLOR = "lightgray";

//Styling
cfg.NODE_FONT = "12px Arial";
cfg.NODE_TEXT_ALIGN = "center";
cfg.NODE_TEXT_ANCHOR = "middle";
cfg.NODE_STROKE_STYLE = cfg.STATE_LINE_COLOR;
cfg.NODE_FILL_STYLE = cfg.STATE_BASE_COLOR;
cfg.NODE_TEXT_FILL_STYLE = cfg.STATE_TEXT_COLOR;

cfg.EDGE_FONT = "12px Arial";
cfg.EDGE_TEXT_ALIGN = "center";
cfg.EDGE_TEXT_ANCHOR = "middle";
cfg.EDGE_STROKE_STYLE = cfg.TRANSITION_COLOR;
cfg.EDGE_TEXT_FILL_STYLE = cfg.TRANSITION_TEXT_COLOR;

cfg.BORDER_STROKE_STYLE = "rgba(0,0,0,0.02)";
cfg.BORDER_LINE_WIDTH = "0.5em";
cfg.BORDER_LINE_DASH = [20, 24];

cfg.HOVER_STROKE_STYLE = "rgba(0,0,0,0.6)";
cfg.HOVER_LINE_WIDTH = 2;
cfg.HOVER_LINE_DASH = [6, 4];
cfg.HOVER_ANGLE_SPEED = 0.01;

cfg.SELECTION_BOX_SHADOW_COLOR = "black";
cfg.SELECTION_BOX_SHADOW_SIZE = 5;
cfg.SELECTION_BOX_SHADOW_OFFSETX = 2;
cfg.SELECTION_BOX_SHADOW_OFFSETY = 2;
cfg.SELECTION_BOX_FILL_STYLE = "rgba(0, 0, 0, 0.1)";
cfg.SELECTION_BOX_STROKE_STYLE = "black";

//IO
cfg.EXPORT_FILE_NAME = "flap-machine.png";


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
    Object.assign(cfg, jsonData);
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
  localStorage.clear();
};
