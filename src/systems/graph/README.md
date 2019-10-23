# Graph

This provides all necessary components, logic, state management, etc to implement a graph editor.

## History
### 10/13/2019
Things have been moved around to better reflect their purpose. So all pure data utilities are now under "model", all renderers under "components", etc.

### 05/05/2019
The old system was hard to change. This should have a better sense of division of responsibility.

The primary component that manages everything for editing a graph is the GraphView. The view is further divided into a graph view (NodeGraphView) and a label editing view (LabelEditorView). More views can be added through the graph editor's children or the corresponding props.

The components of the editor are divided into 4 categories:

At the top are the views, which manage all other components and should ONLY be dependent on something if it will initialize that component for you. These are the "entry points".

Then, each view is divided into layers. Each view should be able to be modified by someone by simply adding/modifying a layer. A layer should only render related items.

At the bottom are renderers and widgets. The difference is that a widget is self-contained, usually handling its own state and logic, while renderers are expected to be given data to render from. Together, they make up all the individual components of the editor.

-=-=-=-=-

All logic and manipulation not related to the UI are further distributed to the controllers, mainly graph tasks for GraphController, input handling for InputController, and selection handling for SelectionBox.

To change input behavior, replace/create the input handlers instead of modifying them. This should easily be done through the already implemented input system.