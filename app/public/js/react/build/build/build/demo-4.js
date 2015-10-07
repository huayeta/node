var Parent=React.createClass({displayName: "Parent",
    render:function(){
        return (
            React.createElement("div", null, 
                React.createElement(Children, {username: this.props.username})
            )
        )
    }
});

var Children=React.createClass({displayName: "Children",
    render:function(){
        return (
            React.createElement("div", {className: "children", "data-username": this.props.username}, this.props.username, ":children")
        )
    }
});

React.render(
    React.createElement(Parent, {username: "pwh"}),
    document.getElementById('example')
);