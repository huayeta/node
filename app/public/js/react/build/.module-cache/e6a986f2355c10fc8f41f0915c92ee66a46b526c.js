var LikeButton= React.createClass({displayName: "LikeButton",
    getInitialState:function(){
        return {liked:false};
    },
    handleClick:function(){
        this.setState({liked:!this.state.liked});
    },
    render:function(){
        var text=this.state.liked?'liked':'haven\'t liked';
        return (
            React.createElement("p", {onClick: this.handleClick}, "You ", text, " this . click to toggle.")
        );
    }
});

React.render(
    React.createElement(LikeButton, null),
    document.getElementById('example')
)