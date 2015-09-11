var React = require('react');

var RichTextarea = React.createClass({

  componentDidMount () {
    window.addEventListener('mouseup', this.handleMouseUp, false);
  },
	
  getInitialState () {
    var input = this.props.html || '';
    var array = [];
    for(var i = 0; i < input.length; i++){
      array.push(input[i]);
    }
    return {
      html: array,
      start: -1,
      ended: -1
    };
  },

  handleMouseDown (event) {
    this.setState({start: -1, ended: -1});
  },

  handleMouseUp (event) {
    var range = window.getSelection().getRangeAt(0);
    var start = +range.startContainer.parentNode.id;
    var ended = +range.endContainer.parentNode.id;

    if(start < ended){
      this.setState({start: start, ended: ended});
    }
  },

  componentDidUpdate () {
    if(this.refs.start && this.refs.ended){
      var start = this.refs.start.getDOMNode();
      var ended = this.refs.ended.getDOMNode();
      console.log(start.id);
      console.log(ended.id);
      var selection = window.getSelection();
      var range = document.createRange();
      range.setStartBefore(start);
      range.setEndAfter(ended);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  componentWillUnmount () {
    clearInterval(this.interval);
  },
  componentDidMount () {
    this.interval = setInterval(this.handleMouseUp, 100);
  },

  // keyevent 
  // render 

	render () {
    var self = this;
    var text = this.state.html.map(function(t, index){
      var ref = {}
      if(index === self.state.start)ref.ref = 'start'
      if(index === self.state.ended)ref.ref = 'ended'
      return <span id={index} {...ref}>{t}</span>;
    });
    if(this.state.ended > -1)text.splice(this.state.ended + 1, 0, <span>|</span>);
    if(this.state.start > -1)text.splice(this.state.start, 0, <span>|</span>);
		return <div onMouseDown={this.handleMouseDown} contentEditable="true">{text}</div>;
	},
});

export default RichTextarea;