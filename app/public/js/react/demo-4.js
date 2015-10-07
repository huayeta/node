var Parent=React.createClass({
    render:function(){
        return (
            <div>
                <Children username={this.props.username} />
            </div>
        )
    }
});

var Children=React.createClass({
    render:function(){
        return (
            <div className="children" data-username={this.props.username}>{this.props.username}:children</div>
        )
    }
});

React.render(
    <Parent username="pwh" />,
    document.getElementById('example')
);