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

var DatasetTable = React.createClass({
	getInitialState: function() {
		console.log('init');
		return {rows: []};
	},
	componentDidMount: function() {
		return this.load();
	},
	load: function() {
		var url = 'http://localhost:3000/api/datasets/' + this.props.datasetId + '.csv';
		var complete = function(results, file) {
			this.setState({rows: results.data});	
		}.bind(this);
		Papa.parse(url, {complete: complete, download: true, fast: true});
	},
	render: function() {
		console.log('starting render');
		var rows = this.state.rows.map(function(row) {
			var cells = row.map(function(cell) {
				return (
					<td>{cell}</td>
				);
			});
			return (
				<tr>{cells}</tr>
			);
		});
		var table = (
			<table>
			{rows}
			</table>
		);
		console.log('finished render');
		return table;
	}
});


function addDataset(id) {
	React.render(
		<div>
		  <DatasetMetadata datasetId={ id } />
		  <DatasetTable datasetId={ id } />
	  </div>,
	  document.getElementById('dataset')
	);
}