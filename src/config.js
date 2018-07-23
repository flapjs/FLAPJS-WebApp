//Input
export const SUBMIT_KEY = 13; //ENTER
export const CLEAR_KEY = 27; //ESCAPE

export const STR_TRANSITION_DEFAULT_LABEL = "0";
export const STR_TRANSITION_PROXY_LABEL = "?";
export const STR_STATE_LABEL = "q";

//Geometry
export const NODE_RADIUS = 16;
export const NODE_RADIUS_SQU = NODE_RADIUS * NODE_RADIUS;
export const NODE_DIAMETER = NODE_RADIUS * 2;
export const NODE_RADIUS_INNER = 12;

export const INITIAL_MARKER_OFFSET_X = -(NODE_RADIUS + (NODE_RADIUS / 3));//Not centered, but a little closer to tip

export const EDGE_RADIUS = 12;
export const EDGE_RADIUS_SQU = EDGE_RADIUS * EDGE_RADIUS;
export const ARROW_WIDTH = 10;
export const PLACEHOLDER_LENGTH = NODE_RADIUS * 3;
export const ENDPOINT_RADIUS = 6;
export const ENDPOINT_RADIUS_SQU = ENDPOINT_RADIUS * ENDPOINT_RADIUS;

export const HOVER_RADIUS_OFFSET = 4;
export const CURSOR_RADIUS = 4;
export const CURSOR_RADIUS_SQU = CURSOR_RADIUS * CURSOR_RADIUS;

export const SELF_LOOP_HEIGHT = 32;

//Interface
export const DOUBLE_TAP_TICKS = 600;
export const LONG_TAP_TICKS = 600;
export const SPAWN_RADIUS = 64;
export const DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE = true;

//Graph sorting
export const PADDING_RADIUS_SQU = 2304;

//Colors
export const STATE_BASE_COLOR = "#EDEBA6";
export const STATE_LINE_COLOR = "black";
export const STATE_TEXT_COLOR = "black";
export const TRANSITION_COLOR = "black";
export const TRANSITION_TEXT_COLOR = "black";
export const GRAPH_INFO_COLOR = "lightgray";

//Styling
export const NODE_FONT = "12px Arial";
export const NODE_TEXT_ALIGN = "center";
export const NODE_TEXT_ANCHOR = "middle";
export const NODE_STROKE_STYLE = STATE_LINE_COLOR;
export const NODE_FILL_STYLE = STATE_BASE_COLOR;
export const NODE_TEXT_FILL_STYLE = STATE_TEXT_COLOR;

export const EDGE_FONT = "12px Arial";
export const EDGE_TEXT_ALIGN = "center";
export const EDGE_TEXT_ANCHOR = "middle";
export const EDGE_STROKE_STYLE = TRANSITION_COLOR;
export const EDGE_TEXT_STROKE_STYLE = TRANSITION_TEXT_COLOR;

export const BORDER_STROKE_STYLE = "rgba(0,0,0,0.02)";
export const BORDER_LINE_WIDTH = "0.5em";
export const BORDER_LINE_DASH = [20, 24];

export const HOVER_STROKE_STYLE = "rgba(0,0,0,0.6)";
export const HOVER_LINE_WIDTH = 2;
export const HOVER_LINE_DASH = [6, 4];
export const HOVER_ANGLE_SPEED = 0.01;

export const SELECTION_BOX_SHADOW_COLOR = "black";
export const SELECTION_BOX_SHADOW_SIZE = 5;
export const SELECTION_BOX_SHADOW_OFFSETX = 2;
export const SELECTION_BOX_SHADOW_OFFSETY = 2;
export const SELECTION_BOX_FILL_STYLE = "rgba(0, 0, 0, 0.1)";
export const SELECTION_BOX_STROKE_STYLE = "black";

//IO
export const EXPORT_FILE_NAME = "flap-machine.png";
