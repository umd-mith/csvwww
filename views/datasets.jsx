var UploadDataset = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();
    var that = this;
    var urlInput = this.refs.url.getDOMNode();
    $.ajax({
      type: "POST",
      url: "/api/datasets",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({url: urlInput.value.trim()}),
      success: function(data) {
        urlInput.value = '';
        that.props.onUploadSubmit(data);
      }.bind(this),
      error: function(xhr, status, err) {
        try {
          var e = JSON.parse(xhr.responseText);
          // TODO: using the placeholder text for an error is a bit of an abomination
          var oldPlaceholder = urlInput.getAttribute('placeholder');
          urlInput.value = '';
          urlInput.setAttribute('placeholder', e.error);
          setTimeout(function() {urlInput.setAttribute('placeholder', oldPlaceholder)}, 5000);
        } catch(error) {
          console.log(error);
          console.log("error API response is not JSON: " + xhr.responseText);
        }
      }.bind(this)
    });
  },

  render: function() {
    return (
      <form className="row" onSubmit={this.handleSubmit}>
        <div className="large-11 small-9 columns">
          <input ref="url" type="url" required placeholder="Please enter a URL for a CSV file" />
        </div>
        <div className="left large-1 small-1 columns"> 
          <button ref="addButton" className="tiny button">add</button>
        </div>
      </form>
    );
  }

});


var Dataset = React.createClass({

  render: function() {
    var d = this.props.dataset;
    var modified = new Date(d.modified);
    modified = modified.toLocaleDateString() + " " + modified.toLocaleTimeString();
    return (
      <tr id={"dataset-" + d._id}>
        <td className="hide-for-small">{ modified }</td>
        <td><a href={"/datasets/" +  d._id }>{ d.title }</a></td>
        <td className="hide-for-small"><a href={"http://twitter.com/" + d.creator }>{ d.creator }</a></td>
      </tr>
    );
  }

});


var DatasetList = React.createClass({

  render: function() {
    var datasetNodes = this.props.data.map(function (dataset) {
      return (
        <Dataset dataset={dataset} />
      )
    });
    return (
      <table className="large-12">
        {datasetNodes}
      </table>
    );
  }
});


var DatasetsBox = React.createClass({

  getInitialState: function() {
    return {data: []};
  },

  handleUpload: function(d) {
    this.setState({newDataset: d._id});
    this.loadDatasets();
  },

  loadDatasets: function(next) {
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
        <DatasetList data={this.state.data} newDataset={this.state.newDataset} />
      </div>
    );
  }

});


React.render(
  <DatasetsBox url="/api/datasets" pollInterval={20000} />,
  document.getElementById('datasets')
);
