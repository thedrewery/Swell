/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect, useSelector } from 'react-redux';
import * as actions from '../../actions/actions';
import NetworkDropdown from './NetworkDropdown';
import RestContainer from './RestContainer.jsx';
import OpenAPIContainer from './OpenAPIContainer.jsx';
import GraphQLContainer from './GraphQLContainer.jsx';
import GRPCContainer from './GRPCContainer.jsx';
import WSContainer from './WSContainer.jsx';
import WebRTCContainer from './WebRTCContainer';
import WebhookContainer from './WebhookContainer'; // jWallNote - fixed name of file

const mapStateToProps = (store) => {
  return {
    reqResArray: store.business.reqResArray,
    composerDisplay: store.ui.composerDisplay,
    newRequestFields: store.business.newRequestFields,
    newRequestHeaders: store.business.newRequestHeaders,
    newRequestStreams: store.business.newRequestStreams,
    newRequestBody: store.business.newRequestBody,
    newRequestsOpenAPI: store.business.newRequestsOpenAPI,
    newRequestCookies: store.business.newRequestCookies,
    newRequestSSE: store.business.newRequestSSE,
    currentTab: store.business.currentTab,
    warningMessage: store.business.warningMessage,
    introspectionData: store.business.introspectionData,
    webrtcData: store.business.webrtcData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
  setComposerWarningMessage: (message) => {
    dispatch(actions.setComposerWarningMessage(message));
  },
  setComposerDisplay: (composerDisplay) => {
    dispatch(actions.setComposerDisplay(composerDisplay));
  },
  setNewRequestHeaders: (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestStreams: (requestStreamsObj) => {
    dispatch(actions.setNewRequestStreams(requestStreamsObj));
  },
  setNewRequestFields: (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
  setNewTestContent: (testContent) => {
    dispatch(actions.setNewTestContent(testContent));
  },
  setNewRequestCookies: (requestCookiesObj) => {
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
  },
  setNewRequestSSE: (requestSSEBool) => {
    dispatch(actions.setNewRequestSSE(requestSSEBool));
  },
  setNewRequestsOpenAPI: (parsedDocument) => {
    dispatch(actions.setNewRequestsOpenAPI(parsedDocument));
  },
  resetComposerFields: () => {
    dispatch(actions.resetComposerFields());
  },
  setWorkspaceActiveTab: (tabName) => {
    dispatch(actions.setWorkspaceActiveTab(tabName));
  },
});

const ComposerContainer = (props) => {
  const onProtocolSelect = (network) => {
    if (props.warningMessage.uri) {
      const warningMessage = { ...props.warningMessage };
      delete warningMessage.uri;
      props.setComposerWarningMessage({ ...warningMessage });
    }
    props.setComposerWarningMessage({});
    switch (network) {
      case 'graphQL': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.gqlUrl,
          method: 'QUERY',
          graphQL: true,
          gRPC: false,
          webrtc: false,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'GQL',
          bodyContent: `query {

}`,
          bodyVariables: '',
        });
        break;
      }
      case 'rest': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.restUrl,
          method: 'GET',
          graphQL: false,
          webrtc: false,
          gRPC: false,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: ``,
        });
        break;
      }
      case 'openapi': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: '',
          method: 'GET',
          graphQL: false,
          gRPC: false,
          ws: false,
          webhook: false,
          network: 'openapi',
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: '',
        });
        break;
      }
      case 'grpc': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.grpcUrl,
          method: '',
          graphQL: false,
          gRPC: true,
          webrtc: false,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'GRPC',
          bodyContent: ``,
        });
        break;
      }
      case 'ws': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.wsUrl,
          method: '',
          graphQL: false,
          gRPC: false,
          webrtc: false,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: '',
        });
        break;
      }
      case 'webrtc': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.webrtcUrl,
          method: 'WebRTC',
          graphQL: false,
          gRPC: false,
          ws: false,
          webrtc: true,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'stun-ice',
          bodyContent: {
            iceConfiguration: {
              iceServers: [
                {
                  urls: 'stun:stun1.l.google.com:19302',
                },
              ],
            },
          },
        });
        break;
      }
      case 'webhook': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          //??? might need to fix url vvv if we want to pass our url api from the state
          url: '',
          method: 'Webhook',
          graphQL: false,
          gRPC: false,
          ws: false,
          webrtc: false,
          webhook: true,
          // vvv wat dis, don't think we neeed
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'none',
          // vvv need to update this and figure out what we are going to do with it
          bodyContent: `We will put our URL here maybe?`,
        });
        break;
      }
      default:
    }
  };

  const isDark = useSelector((store) => store.ui.isDark);
  
  return (
    <div className="is-flex is-flex-direction-column is-tall">
      {/* DROPDOWN PROTOCOL SELECTOR */}
      <NetworkDropdown
        onProtocolSelect={onProtocolSelect}
        network={props.newRequestFields.network}
        className="header-bar"
      />

      {/* COMPOSER CONTENT ROUTING */}
      <div className={`${isDark ? 'is-dark-400' : ''} is-not-7-5rem-tall pt-3 pl-3 pr-3`}>
        {props.newRequestFields.network === 'rest' && (
          <RestContainer {...props} />
        )}
        {props.newRequestFields.network === 'openapi' && (
          <OpenAPIContainer {...props} />
        )}
        {props.newRequestFields.network === 'graphQL' && (
          <GraphQLContainer {...props} />
        )}
        {props.newRequestFields.network === 'ws' && <WSContainer {...props} />}
        {props.newRequestFields.network === 'grpc' && (
          <GRPCContainer {...props} />
        )}
        {props.newRequestFields.network === 'webrtc' && (
          <WebRTCContainer {...props} />
        )}
        {props.newRequestFields.network === 'webhook' && (
          <WebhookContainer {...props} /> // jWallNote - fixed name of file
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ComposerContainer);
