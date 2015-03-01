var UploadDataset = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var that = this;
    $.ajax({
      type: "POST",
      url: "/api/datasets",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({url: this.refs.url.getDOMNode().value.trim()}),
      success: function(data) {
        that.props.onUploadSubmit(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("uhoh: " + err);
      }.bind(this)
    });
  },
  render: function() {
    return (
      <form className="row" onSubmit={this.handleSubmit}>
        <div className="large-11 small-9 columns">
          <input ref="url" type="url" required placeholder="http://example.com/data.csv" />
        </div>
        <div className="left large-1 small-1 columns"> 
          <button className="tiny button">add</button>
        </div>
      </form>
    );
  }
});

var Dataset = React.createClass({
  render: function() {
    return (
      <h3>Dataset</h3>
    );
  }
});

var DatasetList = React.createClass({
  render: function() {
    return (
      <h3>Datasets!</h3>
    );
  }
});

var DatasetsBox = React.createClass({
  handleUpload: function(d) {
    console.log('uploaded: ' + d.url);
  },
  render: function() {
    return (
      <div id="datasets" className="row large-offset-2 large-8 small-offset-1 small-10">
        <UploadDataset onUploadSubmit={this.handleUpload}/>
        <DatasetList />
      </div>
    );
  }
});

React.render(
  <DatasetsBox />,
  document.getElementById('datasets')
);
