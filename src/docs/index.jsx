/*  eslint-disable import/no-extraneous-dependencies */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Report from '../lib';
import './styles.css';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.report = null;
    this.state = {
      embedType: 'report',
      tokenType: 'Embed',
      accessToken: '',
      embedUrl: '',
      embedId: '',
      permissions: 'All',
      filterPaneEnabled: 'filter-false',
      navContentPaneEnabled: 'nav-false',
      visualHeaderFlag: true,
      flag: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getCode = this.getCode.bind(this);
    this.toggleAllVisualHeaders = this.toggleAllVisualHeaders.bind(this);
  }

  getCode(view = true) {
    const {
      embedType,
      tokenType,
      accessToken,
      embedUrl,
      embedId,
      permissions,
    } = this.state;
    const viewAccessToken = accessToken && `${accessToken.slice(0, 10)}...`;
    const viewEmbedUrl = embedUrl && `${embedUrl.slice(0, 10)}...`;
    return `<Report embedType="${embedType}"
    tokenType="${tokenType}"
    accessToken="${view ? viewAccessToken : accessToken}"
    embedUrl="${view ? viewEmbedUrl : embedUrl}"
    embedId="${embedId}"
    extraSettings={{
      filterPaneEnabled: ${this.state.filterPaneEnabled === 'filter-true'},
      navContentPaneEnabled: ${this.state.navContentPaneEnabled === 'nav-true'},
    }}
    permissions="${permissions}"
    style={{
      height: '100%',
      border: '0',
      padding: '20px',
      background: '#eee'
    }}
    onLoad={(report) => {
      /*
      you can set filters onLoad using:
      this.report.setFilters([filter]).catch((errors) => {
        console.log(errors);
      });*/
      console.log('Report Loaded!');
      //this.report = report (Read docs to know how to use report object that is returned)
    }}
    onSelectData={(data) => { 
      window.alert('You clicked chart:' + data.visual.title); 
    }}
    onPageChange={(data) => { 
      console.log('You changed page to:' + data.newPage.displayName); 
    }}
    onTileClicked={(dashboard, data) => { //only used for dashboard
      // this.report = dashboard; use for object for triggering fullscreen
      console.log('You clicked tile:', data);
    }}
  />`;
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  toggleAllVisualHeaders() {
    const newSettings = {
      visualSettings: {
        visualHeaders: [
          {
            settings: {
              visible: !this.state.visualHeaderFlag,
            },
          },
        ],
      },
    };
    if (this.report) {
      this.report.updateSettings(newSettings)
        .then(() => {
          console.log('Visual header was successfully hidden for all the visuals in the report.');
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.setState({
      visualHeaderFlag: !this.state.visualHeaderFlag,
    });
  }

  render() {
    const {
      embedType,
      tokenType,
      accessToken,
      embedUrl,
      embedId,
      permissions,
    } = this.state;
    const style = {
      report: {
        height: '50%', border: '0', padding: '20px', background: '#eee',
      },
    };
    const extraSettings = {
      filterPaneEnabled: this.state.filterPaneEnabled === 'filter-true',
      navContentPaneEnabled: this.state.navContentPaneEnabled === 'nav-true',
    };
    const filter = {
      $schema: 'http://powerbi.com/product/schema#basic',
      target: {
        table: 'Geo',
        column: 'Region',
      },
      operator: 'In',
      values: ['West'],
    };
    const reportFlag = embedType === 'report';
    return (
      <div className="root">
        <div className="header">Power BI Report Component Demo</div>
        <div className="container">
          <div className="config">
            <span>Embed Type: <input name="embedType" onChange={this.handleChange} value={embedType} required /></span>
            <span>Token Type: <input name="tokenType" onChange={this.handleChange} value={tokenType} required /></span>
            <span>Token: <input name="accessToken" onChange={this.handleChange} value={accessToken} required /></span>
            <span>Embed Url: <input name="embedUrl" onChange={this.handleChange} value={embedUrl} required /></span>
            <span>Embed Id: <input name="embedId" onChange={this.handleChange} value={embedId} required /></span>
            {reportFlag && <span>Permissions: <input name="permissions" onChange={this.handleChange} value={permissions} required /></span>}
            {
              reportFlag &&
              <span>
                Display Nav Pane:
                <span><input checked={this.state.navContentPaneEnabled === 'nav-true'} type="radio" value="nav-true" name="navContentPaneEnabled" onChange={this.handleChange} />True</span>
                <span><input checked={this.state.navContentPaneEnabled === 'nav-false'} type="radio" value="nav-false" name="navContentPaneEnabled" onChange={this.handleChange} />False</span>
              </span>
          }
            {
                reportFlag &&
                <span>
                Display Filter Pane:
                  <span><input checked={this.state.filterPaneEnabled === 'filter-true'} type="radio" value="filter-true" name="filterPaneEnabled" onChange={this.handleChange} />True</span>
                  <span><input checked={this.state.filterPaneEnabled === 'filter-false'} type="radio" value="filter-false" name="filterPaneEnabled" onChange={this.handleChange} />False</span>
                </span>
          }
            <span className="interactions">
              General Operations:
              <button
                className="interactionBtn"
                onClick={() => {
                  if (this.report) {
                    this.report.fullscreen();
                  }
                }}
              >
                  Fullscreen
              </button>
              <button
                className="interactionBtn"
                disabled={!reportFlag}
                onClick={() => {
                  if (this.report) {
                    this.report.switchMode('edit');
                  }
                }}
              >
                Edit Mode
              </button>
              <button
                className="interactionBtn"
                disabled={!reportFlag}
                onClick={() => {
                  if (this.report) {
                    this.report.switchMode('view');
                  }
                }}
              >
                View Mode
              </button>
              <button
                className="interactionBtn"
                disabled={!reportFlag}
                onClick={() => {
                  if (this.report) {
                    this.report.setFilters([filter]).catch((errors) => {
                      console.log(errors);
                    });
                  }
                }}
              >
                Set Filter
              </button>
              <button
                className="interactionBtn"
                disabled={!reportFlag}
                onClick={() => {
                  if (this.report) {
                    this.report.removeFilters()
                      .catch((errors) => {
                        console.log(errors);
                    });
                  }
                }}
              >
                Remove Filter
              </button>
              <button
                className="interactionBtn"
                disabled={!reportFlag}
                onClick={() => this.toggleAllVisualHeaders()}
              >
                Toggle Visual Header
              </button>
              <button
                className="interactionBtn"
                disabled={!reportFlag}
                onClick={() => {
                  if (this.report) {
                    this.report.print();
                  }
                }}
              >
                Print
              </button>
            </span>
            <button
              className="runBtn"
              onClick={() => {
              if (!this.state.flag) {
                this.setState({
                flag: true,
                });
              }
            }}
            >Run
            </button>
          </div>
          <div className="code">
            <span className="codeHeader">
              <h2>Code:</h2>
              <CopyToClipboard
                text={this.getCode(false)}
              >
                <button className="copyBtn">Copy</button>
              </CopyToClipboard>
            </span>
            <pre>
              <code className="language-css">
                {this.getCode()}
              </code>
            </pre>
          </div>
        </div>
        {this.state.flag && <Report
          embedType={embedType}
          tokenType={tokenType}
          accessToken={accessToken}
          embedUrl={embedUrl}
          embedId={embedId}
          extraSettings={extraSettings}
          permissions={permissions}
          style={style.report}
          onLoad={(report) => {
            console.log("You'll get back a report object with this callback");
            this.report = report;
          }} //eslint-disable-line
          onSelectData={(data) => { window.alert(`You clicked chart: ${data.visual.title}`); }} //eslint-disable-line
          onPageChange={(data) => { console.log(`You changed page to: ${data.newPage.displayName}`); }} //eslint-disable-line
          onTileClicked={(dashboard, data) => {
            this.report = dashboard;
            console.log('You clicked tile:', data);
          }}
        />}
      </div>
    );
  }
}

render(<Demo />, document.getElementById('app'));
