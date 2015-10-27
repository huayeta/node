var HelloWorld=React.createClass({
    getInitialState:function(){
        return{
            backgroundColor:'#ffff'
        };
    },
    handleWheel:function(event){
        console.log(this.isMounted());
        var newBackgroundColor=(parseInt(this.state.backgroundColor.substr(1),16)+event.deltaY*997).toString(16);
        newBackgroundColor='#'+newBackgroundColor.substr(newBackgroundColor.length-6);
        this.setState({backgroundColor:newBackgroundColor});
    },
    render:function(){
        return (
            <div onWheel={this.handleWheel} style={this.state}>Hello World!</div>
        );
    }
});
React.render(<HelloWorld />,document.getElementById('example'));
