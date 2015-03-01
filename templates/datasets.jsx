var UploadDataset = React.createClass({
  render: function() {
    return (
      <form className="row">
        <div className="large-11 small-9 columns">
          <input name="url" type="url" required placeholder="http://example.com/data.csv" />
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
  render: function() {
    return (
      <div id="datasets" className="row large-offset-2 large-8 small-offset-1 small-10">
        <UploadDataset />
        <DatasetList />
      </div>
    );
  }
});

React.render(
  <DatasetsBox />,
  document.getElementById('datasets')
);
