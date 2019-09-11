// NavBar Container - displays buttons pertaining to selecting/deselecting/opening/minimizing/saving functionality
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReqResCtrl from '../../controllers/reqResController.js';
import CollectionsCtrl from '../../controllers/collectionsController.js'
import ReactModal from 'react-modal';
import uuid from 'uuid/v4';
import * as actions from '../../actions/actions';

// map the current reqResArray (list of requests currently displayed)
const mapStateToProps = store => ({
  reqResArray: store.business.reqResArray,
});
// map the functionality to add a collection to the store
const mapDispatchToProps = dispatch => ({
  collectionAdd: (collection) => { dispatch(actions.collectionAdd(collection)) },
});

class NavBarContainer extends Component {
  constructor(props) {
    super(props);
    // showModal = toggle for Save Collection modal
    this.state = {
      showModal: false,
    }
    // functionality for opening and closing modal (resets showModal in state),
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    // functionality for saving Collection (adding to IndexedDB as well as store)
    this.saveCollection = this.saveCollection.bind(this);
    // functionality for saving name and presenting naming error
    this.saveName = this.saveName.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // open and close modal functions
  handleOpenModal() {
    this.setState({ ...this.state, showModal: true });
  }
  handleCloseModal() {
    this.setState({ ...this.state, showModal: false });
  }

  // function to name a new collection and save it
  // 1. grab the name from the user input in the modal display
  // 2. test it against the IndexedDB to see if already exists
  // 3a. if it already exists - adjust UI to present error
  // 3b. if it does not - invoke saveCollection to proceed
  saveName() {
    const inputName = document.querySelector('#collectionNameInput').value;
    if (!!inputName.trim()) {
      CollectionsCtrl.collectionNameExists({ name: inputName })
        .catch((err) => console.error("error in checking collection name: ", err))
        .then((found) => {
          if (found) { //if the name already exists
            document.querySelector('#collectionNameInput').setAttribute("style", "border-color: red;");
            document.querySelector('#collectionNameError').setAttribute("style", "display: block");
          }
          else this.saveCollection(inputName)
        })
    }
  }
  // function to save collection to IndexedDB and to store
  // 1. clone reqResArray (because we cannot mutate state directly)
  // 2. reset all properties to their initial defaults
  // (to treat them as new for each recall of collection, all reqRes will be unopened and minimized)
  // 3. the new collection obj will be initialized with the reinitialized reqResArray and other collection properties
  // 4. the Collections Controller will handle adding collection to IndexedDB
  // 5. the collection will be added to the store
  // 6. the modal display will be reset
  saveCollection(inputName) {
    const clonedArray = (this.props.reqResArray).slice()
    clonedArray.forEach((reqRes) => { //reinitialize and minimize all things
      reqRes.checked = false;
      reqRes.minimized = true;
      reqRes.timeSent = null;
      reqRes.timeReceived = null;
      reqRes.connection = 'uninitialized';
      if (reqRes.response.hasOwnProperty('headers')) reqRes.response = { headers: null, events: null }
      else reqRes.response = { messages: [] }
    });
    const collectionObj = {
      name: inputName,
      id: uuid(),
      created_at: new Date(),
      reqResArray: clonedArray
    }
    CollectionsCtrl.addCollectionToIndexedDb(collectionObj); //add to IndexedDB
    this.props.collectionAdd(collectionObj) //add to store
    this.setState({ showModal: false });
  }

  // function associated to checking and saving collection names
  // 1. finds error element
  // 2. if "ENTER" is hit - tries to save collection (for UX convenience)
  // 3. if any other key is pressed (if the user is typing) - will force error warning to disappear if it was present
  handleKeyPress(event) {
    const warning = document.querySelector('#collectionNameError');
    if (event.key === 'Enter') this.saveName();
    else if (warning.style.display === 'block') {
      warning.setAttribute("style", "display: none !important");
      document.querySelector('#collectionNameInput').setAttribute("style", "border: 2px solid $yellowgrey !important;");
    }
  }

  render(props) {
    // Call setAppElement to properly hide application from assistive screenreaders and other assistive technologies while the modal is open
    ReactModal.setAppElement('#root');
    return (
      <div className="navbar-console">
        <div className="navbar-console_inner">
          <button className="btn" type="button" onClick={ReqResCtrl.selectAllReqRes}>
            Select All
          </button>

          <button className="btn" type="button" onClick={(e) => { ReqResCtrl.deselectAllReqRes(e) }}>
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

          <button className="btn" type="button" onClick={this.handleOpenModal}>
            Save Collection
          </button>

          <ReactModal
            isOpen={this.state.showModal}
            className="collectionModal"
            overlayClassName="collectionModalOverlay" // sets behind the modal
            contentLabel="Enter a Collection Name"
            onRequestClose={this.handleCloseModal} // allows close functionality after clicking overlay
            shouldCloseOnOverlayClick={true} // allows close functionality after clicking overlay
            aria={{
              labelledby: "heading"
            }}
          >
            <h1 id="heading">What would you like to name your collection?</h1>
            <input type={'text'} id="collectionNameInput" onKeyDown={(e) => this.handleKeyPress(e)} autoFocus />
            <p id="collectionNameError" style={{ display: 'none' }}>Collection name already exists!</p>
            <div>
              <button onClick={this.saveName}>Save</button>
              <button onClick={this.handleCloseModal}>Cancel</button>
            </div>
          </ReactModal>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);