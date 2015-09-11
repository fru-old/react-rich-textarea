var React = require('react');

window.React = React;
var inputSupport = "oninput" in document.body;


// Aspects:
// - autosize
// - unexpected input
// - paste
// - selection / caret

// Plugins
// - Component (may render additional RichTextareEditable)

// Open Questions
// - How to select with unknown RichTextareaEditable tree combinantions



// fallback if no oninput exists
// manage global state?
// everything else is a plugin?
// serialize html
// deserialize html

var RichTextarea = React.createClass({

  getInitialState () {
    return {
      count: 0,
      empty: false
    };
  },

  run () {
    this.setState({count: this.state.count+1});
  },

  componentWillUnmount () {
    clearInterval(this.interval);
  },

  componentDidMount () {
    this.interval = setInterval(this.run, 5000);
    this.setupContentEditable();
    window.addEventListener('mouseup', this.handleMouseUp, false);
  },

  handleMouseUp (event) {
    var range = window.getSelection().getRangeAt(0);
    console.log(range.startOffset);
    console.log(range.endOffset);
  },

  setSelectionRange(el, start, end) {
    if (document.createRange && window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var textNodes = getTextNodesIn(el);
        var foundStart = false;
        var charCount = 0, endCharCount;

        for (var i = 0, textNode; textNode = textNodes[i++]; ) {
            endCharCount = charCount + textNode.length;
            if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i < textNodes.length))) {
                range.setStart(textNode, start - charCount);
                foundStart = true;
            }
            if (foundStart && end <= endCharCount) {
                range.setEnd(textNode, end - charCount);
                break;
            }
            charCount = endCharCount;
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(true);
        textRange.moveEnd("character", end);
        textRange.moveStart("character", start);
        textRange.select();
    }
  },

	render () {
    return !this.state.empty && (<div className="rich-textarea" onPaste={this.onpaste} ref="main">{this.state.count}</div>);
	},

  onpaste (e) {
    var n = e.nativeEvent;
    var self = this;
    if (n && n.clipboardData && n.clipboardData.getData) {
      if (/text\/html/.test(n.clipboardData.types)) {
        console.log(n.clipboardData.getData('text/html'));
      } else if (/text\/plain/.test(n.clipboardData.types)) {
        console.log(n.clipboardData.getData('text/plain'));
      }
      e.stopPropagation();
      e.preventDefault();
    } else {
      var main = this.refs.main;
      if(main){
        main = main.getDOMNode();
        main.innerHTML = '';
        self.justPasted = true;
        setTimeout(function(){
          console.log('Pasted: '+main.innerHTML);
          self.setState({empty: true});
        },60);
      }
    }
  },

  componentDidUpdate () {
    this.justPasted = false;
    if(this.state.empty){
      this.setState({empty: false});
      this.reinitContentEditable = true;
    }else if(this.reinitContentEditable){
      this.setupContentEditable();
      this.reinitContentEditable = false;
    }
  },

  setupContentEditable () {
    var main = this.refs.main;
    var self = this;
    if (main) {
      main = main.getDOMNode();
      if(main.getAttribute('contentEditable') !== 'true') {
        main.setAttribute('contentEditable', 'true');
        return;
        main.addEventListener('input', function (e) {
          if(!self.justPasted)console.log('Unexpected: ' +main.innerHTML);
          self.setState({empty: true});
        }, false);
      }
    }
  }
});

export default RichTextarea;