var Table = Reactable.Table;

var DatasetNotes = React.createClass({
  getDefaultProps: function() {
    return {
      notes: []
    }
  },
  render: function() {
    var notes = [];
    for (var i = 0; i < this.props.notes.length; i++) {
      var note = this.props.notes[i];
      notes.push(
        <div>
        { note.body.text } - 
        { note.target }
        </div>
      );
    }
    return (
      <div id="notes">
        { notes }
      </div>
    );
  }
});

var UploadForm = React.createClass({
  getInitialState: function() {
    return({
      modalIsOpen: false
    });
  },
  openModal: function() {
    this.setState({modalIsOpen: true});
  },
  closeModal: function(event) {
    this.setState({modalIsOpen: false});
    event.preventDefault();
  },
  upload: function() {
    var form = $("#upload");
    form.submit(function(event) {
    });
  },
  render: function() {
    return (
      <div>
        <a className="button tiny success" onClick={this.openModal}>Upload Changes</a>
        <ReactModal className="upload-form" isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
          <h2>Upload Changes</h2>
          <p>
          This form allows you to upload a modified version of your CSV dataset. It will be saved as a 
          new version along with a comment you wish to add about your changes.
          </p>
          <form id="upload" method="post" encType="multipart/form-data" action={ "/api/datasets/" + this.props.datasetId }>
            <label>First select the CSV file to upload:
              <input type="file" name="upload" />
            </label>
            <br />
            <label>Next please describe your changes:
              <textarea name="comment" rows="4" cols="40"></textarea>
            </label>
            <br />
            <button className="button tiny alert" onClick={this.closeModal}>cancel</button>
            &nbsp;
            <input type="submit" className="button tiny success" value="save" onClick={this.upload} />
          </form>
        </ReactModal>
      </div>
    );
  }
});

var DatasetMetadata = React.createClass({
  getInitialState: function() {
    return ({
      title: null,
      creator: null,
      distribution: {
        derivedFrom: null,
        downloadURL: null
      }
    });
  },
  componentDidMount: function() {
    return this.load();
  },
  load: function() {
    $.ajax({
      url: '/api/datasets/' + this.props.datasetId,
      dataType: 'json',
      success: function(data) {
        var a = document.createElement('a');
        a.href = data.distribution.derivedFrom;
        data.forkedFrom = a.hostname;
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)  
    });
  },
  render: function() {
    return (
      <div className="row" id="dataset-metadata">
        <div className="large-6 small-12 column">
          <div>Title: <span contentEditable>{ this.state.title }</span></div>
          <div>Creator: { this.state.creator }</div>
          <div>Description: <span contentEditable>{ this.state.description }&nbsp;</span></div>
          <div>Forked from: <a href={ this.state.distribution.derivedFrom } title={ this.state.distribution.derivedFrom }>{ this.state.forkedFrom }</a></div>
        </div>
        <div className="large-6 small-12 column">
          <div>
            <a className="tiny info button" href={ this.state['@id'] + '.csv' }>C S V</a>
            &nbsp;
            <a className="tiny secondary button" href={ this.state['@id'] }>C S V W</a>
            <UploadForm datasetId={ this.props.datasetId } />
          </div>
        </div>
        <div className="large-6 small-12">
          <DatasetNotes notes={ this.state.notes } />
        </div>
      </div>
    );
  }
});



function addDataset(datasetId) {
  var url = '/api/datasets/' + datasetId + '.csv';
  Papa.parse(url, {header: true, download: true, complete: function(results, parser) {

    // for the modal upload form 
    var appElement = document.getElementById('dataset');
    ReactModal.setAppElement(appElement);

    React.render(
      <div id="table-detail">
        <div className="row">
        <DatasetMetadata datasetId={ datasetId } />
        </div>
        <div className="row">
        <Table className="table" data={results.data} itemsPerPage={100} sortable={true} />
        </div>
      </div>,
      document.getElementById('dataset')
    );
  }});
}