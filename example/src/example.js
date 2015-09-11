var React = require('react');
var RichTextarea = require('react-rich-textarea');

React.initializeTouchEvents(true);

var App = React.createClass({
	render () {
		return (
			<div>
				<RichTextarea value={'test text 123'}/>
			</div>
		);
	}
});

React.render(<App />, document.getElementById('app'));
