/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import hasAncestor from 'lib/hasAncestor';
import Parse from 'parse';
import React from 'react';
import styles from 'components/FileEditor/FileEditor.scss';
import FileSaver from 'file-saver';
import ParseApp      from 'lib/ParseApp';

export default class FileEditor extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: props.value
    };

    this.checkExternalClick = this.checkExternalClick.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.checkExternalClick);
    document.body.addEventListener('keypress', this.handleKey);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.checkExternalClick);
    document.body.removeEventListener('keypress', this.handleKey);
  }

  checkExternalClick(e) {
    if (!hasAncestor(e.target, this.refs.input)) {
      this.props.onCommit(this.state.value);
    }
  }

  handleKey(e) {
    if (e.keyCode === 13) {
      this.props.onCommit(this.state.value);
    }
  }

  handleChange(e) {
    let file = e.target.files[0];
    if (file) {
      this.props.onCommit(new Parse.File(file.name, file));
    }
  }
    
    openFileWithHeader(fileurl) {
        console.log(ParseApp.applicationId);
        var req = new XMLHttpRequest();
        req.open('GET', fileurl, true); //true means request will be async
        req.responseType = "blob";
        req.onload = function() {
            var filename = fileurl.substring(fileurl.lastIndexOf('/')+1);
            var file = new Blob([req.response], {
                                type: 'application/gzip'
                                });
            
            FileSaver.saveAs(file,filename);
        };
        
        req.setRequestHeader('X-Parse-Application-Id', this.currentApp.applicationId );
        req.send();
    }

  render() {
    const file = this.props.value;
    return (
      <div ref='input' style={{ minWidth: this.props.width }} className={styles.editor}>
        {file && file.url() ? <a href='javascript:;' role='button' className={styles.download} onClick={() => this.openFileWithHeader(this.props.value.url())}>Download</a> : null}
        <a className={styles.upload}>
          <input type='file' onChange={this.handleChange.bind(this)} />
          <span>{file ? 'Replace file' : 'Upload file'}</span>
        </a>
        {file ? <a href='javascript:;' role='button' className={styles.delete} onClick={() => this.props.onCommit(undefined)}>Delete</a> : null}
      </div>
    );
  }
}
