var Myname=React.createClass({
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
            <h1>username:{this.props.username},age:{this.props.age}</h1>
        );
    }
});

React.render(
    <Myname username="huayeta" />,
    document.getElementById('example')
);