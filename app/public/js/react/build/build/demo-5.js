var Myname=React.createClass({displayName: "Myname",
    propTypes:{
        username:React.PropTypes.array
    },
    getDefaultProps:function(){
        return{
            age:24
        }
    },
    render:function(){
        return (
            React.createElement("h1", null, "username:", this.props.username, ",age:", this.props.age)
        );
    }
});

React.render(
    React.createElement(Myname, {username: "huayeta"}),
    document.getElementById('example')
);