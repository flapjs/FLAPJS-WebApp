import React from 'react';
import { shallow } from 'enzyme';

import { testComponentProps } from 'ComponentTests.js';

import JPGFileIcon from './flat/JPGFileIcon.js';
import JSONFileIcon from './flat/JSONFileIcon.js';
import PNGFileIcon from './flat/PNGFileIcon.js';
import XMLFileIcon from './flat/XMLFileIcon.js';

import AddIcon from './AddIcon.js';
import BoxAddIcon from './BoxAddIcon.js';
import BugIcon from './BugIcon.js';
import CheckCircleIcon from './CheckCircleIcon.js';
import CrossCircleIcon from './CrossCircleIcon.js';
import CrossIcon from './CrossIcon.js';
import DownArrowIcon from './DownArrowIcon.js';
import DownloadIcon from './DownloadIcon.js';
import EditPencilIcon from './EditPencilIcon.js';
import ExpandDownIcon from './ExpandDownIcon.js';
import FullscreenExitIcon from './FullscreenExitIcon.js';
import FullscreenIcon from './FullscreenIcon.js';
import HelpIcon from './HelpIcon.js';
import InfoIcon from './InfoIcon.js';
import MenuIcon from './MenuIcon.js';
import MoreIcon from './MoreIcon.js';
import MoveIcon from './MoveIcon.js';
import MoveOutIcon from './MoveOutIcon.js';
import NoticeCircleIcon from './NoticeCircleIcon.js';
import NoticeTriangleIcon from './NoticeTriangleIcon.js';
import OfflineCheckIcon from './OfflineCheckIcon.js';
import OfflineIcon from './OfflineIcon.js';
import PageAddIcon from './PageAddIcon.js';
import PageContentIcon from './PageContentIcon.js';
import PageEmptyIcon from './PageEmptyIcon.js';
import PauseIcon from './PauseIcon.js';
import PendingIcon from './PendingIcon.js';
import PinpointIcon from './PinpointIcon.js';
import PlayIcon from './PlayIcon.js';
import RedoIcon from './RedoIcon.js';
import RunningManIcon from './RunningManIcon.js';
import SaveDiskIcon from './SaveDiskIcon.js';
import SettingsIcon from './SettingsIcon.js';
import StopIcon from './StopIcon.js';
import SubtractIcon from './SubtractIcon.js';
import TinyDownIcon from './TinyDownIcon.js';
import TinyUpIcon from './TinyUpIcon.js';
import TrashCanDetailedIcon from './TrashCanDetailedIcon.js';
import TrashCanIcon from './TrashCanIcon.js';
import TriangleIcon from './TriangleIcon.js';
import UndoIcon from './UndoIcon.js';
import UploadIcon from './UploadIcon.js';
import WorldIcon from './WorldIcon.js';
import ZoomInIcon from './ZoomInIcon.js';
import ZoomOutIcon from './ZoomOutIcon.js';

testIconClass(JPGFileIcon);
testIconClass(JSONFileIcon);
testIconClass(PNGFileIcon);
testIconClass(XMLFileIcon);

testIconClass(AddIcon);
testIconClass(BoxAddIcon);
testIconClass(BugIcon);
testIconClass(CheckCircleIcon);
testIconClass(CrossCircleIcon);
testIconClass(CrossIcon);
testIconClass(DownArrowIcon);
testIconClass(DownloadIcon);
testIconClass(EditPencilIcon);
testIconClass(ExpandDownIcon);
testIconClass(FullscreenExitIcon);
testIconClass(FullscreenIcon);
testIconClass(HelpIcon);
testIconClass(InfoIcon);
testIconClass(MenuIcon);
testIconClass(MoreIcon);
testIconClass(MoveIcon);
testIconClass(MoveOutIcon);
testIconClass(NoticeCircleIcon);
testIconClass(NoticeTriangleIcon);
testIconClass(OfflineCheckIcon);
testIconClass(OfflineIcon);
testIconClass(PageAddIcon);
testIconClass(PageContentIcon);
testIconClass(PageEmptyIcon);
testIconClass(PauseIcon);
testIconClass(PendingIcon);
testIconClass(PinpointIcon);
testIconClass(PlayIcon);
testIconClass(RedoIcon);
testIconClass(RunningManIcon);
testIconClass(SaveDiskIcon);
testIconClass(SettingsIcon);
testIconClass(StopIcon);
testIconClass(SubtractIcon);
testIconClass(TinyDownIcon);
testIconClass(TinyUpIcon);
testIconClass(TrashCanDetailedIcon);
testIconClass(TrashCanIcon);
testIconClass(TriangleIcon);
testIconClass(UndoIcon);
testIconClass(UploadIcon);
testIconClass(WorldIcon);
testIconClass(ZoomInIcon);
testIconClass(ZoomOutIcon);

function testIconClass(IconClass)
{
  //Test props
  testComponentProps(IconClass);

  test("check container component type", () =>
  {
    const wrapper = shallow(<IconClass />);

    expect(wrapper.type()).toBe('svg');
  });
}
