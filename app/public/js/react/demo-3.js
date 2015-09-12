var LikeButton= React.createClass({
    getInitialState:function(){
        return {liked:false};
    },
    handleClick:function(){
        this.setState({liked:!this.state.liked});
    },
    render:function(){
        var text=this.state.liked?'liked':'haven\'t liked';
        return (
            <p onClick={this.handleClick}>You {text} this . click to toggle.</p>
        );
    }
});

React.render(
    <LikeButton />,
    document.getElementById('example')
)