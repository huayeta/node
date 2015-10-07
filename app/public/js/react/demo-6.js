var App = React.createClass({
    getInitialState: function() {
      return {userInput: ''};
    },
    handleChange: function(e) {
      this.setState({userInput: e.target.value});
    },
    clearAndFocusInput: function() {
      this.setState({userInput: ''},function(){
          this.refs.myInput.getDOMNode().focus();
      }); // Clear the input
      // We wish to focus the <input /> now!
      console.log(this.props.children);
    },
    render: function() {
      return (
        <div>
          <div onClick={this.clearAndFocusInput}>
            Click to Focus and Reset
          </div>
          <input
            value={this.state.userInput}
            onChange={this.handleChange}
            ref="myInput"
          />
        </div>
      );
    }
  });

React.render(
  <App >sss</App>,
  document.getElementById('example')
);
