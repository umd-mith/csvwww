var Table = Reactable.Table;

var DatasetMetadata = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    return this.load();
  },
  load: function() {
    $.ajax({
      url: '/api/datasets/' + this.props.datasetId,
      dataType: 'json',
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)  
    });
  },
  render: function() {
    return (
      <div>{ this.state.title }</div>
    );
  }
});

function addDataset(datasetId) {
  var url = '/api/datasets/' + datasetId + '.csv';
  Papa.parse(url, {header: true, download: true, complete: function(results, parser) {
    React.render(
      <div className="tableDetail row large-12 small-offset-1 small-10">
        <DatasetMetadata datasetId={ datasetId } />
        <Table className="table" data={results.data} itemsPerPage={100} sortable={true} />
      </div>,
      document.getElementById('dataset')
    );
  }});
}