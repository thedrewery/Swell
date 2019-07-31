import React, { Component } from 'react';
import ReqResCtrl from '../../controllers/reqResController.js';

class NavBarContainer extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    return (
      <div className="navbar-console">
        <div className="navbar-console_inner">
          <button className="btn" type="button" onClick={ReqResCtrl.selectAllReqRes}>
            Select All
          </button>

          <button className="btn" type="button" onClick={(e) => {ReqResCtrl.deselectAllReqRes(e)}}>
            Deselect All
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.openAllSelectedReqRes}>
            Open Selected
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.closeAllReqRes}>
            Close Selected
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.minimizeAllReqRes}>
            Minimize All
          </button>

          <button className="btn" type="button" onClick={ReqResCtrl.expandAllReqRes}>
            Expand All
          </button>
          
          <button className="btn" type="button" onClick={ReqResCtrl.clearAllReqRes}>
            Clear All
          </button>
        </div>
      </div>
    );
  }
}

export default NavBarContainer;
