var Table = Reactable.Table;

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
      </div>
    );
  }
});

function addDataset(datasetId) {
  var url = '/api/datasets/' + datasetId + '.csv';
  Papa.parse(url, {header: true, download: true, complete: function(results, parser) {
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