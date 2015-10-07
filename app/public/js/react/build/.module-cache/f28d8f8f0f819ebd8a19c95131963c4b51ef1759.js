var App = React.createClass({displayName: "App",
    getInitialState: function() {
      return {userInput: ''};
    },
    handleChange: function(e) {
      this.setState({userInput: e.target.value});
    },
    clearAndFocusInput: function() {
      this.setState({userInput: ''}); // Clear the input
      // We wish to focus the <input /> now!
      this.refs.myInput.getDOMNode().focus();
      console.log(this.props.children);
    },
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement("div", {onClick: this.clearAndFocusInput}, 
            "Click to Focus and Reset"
          ), 
          React.createElement("input", {
            value: this.state.userInput, 
            onChange: this.handleChange, 
            ref: "myInput"}
          )
        )
      );
    }
  });

React.render(
  React.createElement(App, null, "ss"),
  document.getElementById('example')
);
