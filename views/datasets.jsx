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
      <li>{ this.props.title }</li>
    );
  }
});

var DatasetList = React.createClass({
  render: function() {
    var datasetNodes = this.props.data.map(function (dataset) {
      return (
        <Dataset title={dataset.title} />
      )
    });
    return (
      <ul>
        {datasetNodes}
      </ul>
    );
  }
});

var DatasetsBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  handleUpload: function(d) {
    console.log('uploaded: ' + d.url);
  },
  loadDatasets: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadDatasets();
    setInterval(this.loadDatasets, this.props.pollInterval)
  },
  render: function() {
    return (
      <div id="datasets" className="row large-offset-2 large-8 small-offset-1 small-10">
        <UploadDataset onUploadSubmit={this.handleUpload}/>
        <DatasetList data={this.state.data} />
      </div>
    );
  }
});

React.render(
  <DatasetsBox url="/api/datasets" pollInterval={2000} />,
  document.getElementById('datasets')
);
