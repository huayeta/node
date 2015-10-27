var HelloWorld=React.createClass({
    getInitialState:function(){
        return{x:'0',y:'0',isClick:false}
    },
    handleMouseMove:function(event){
        if(this.state.isClick)return;
        this.setState({
            x:event.clientX,
            y:event.clientY
        });
    },
    handleMouseLeave:function(){
        // this.setState({
        //     x:'0',
        //     y:'0'
        // });
    },
    handleClick:function(event){
        this.setState({
            isClick:!this.state.isClick,
            x:event.clientX,
            y:event.clientY
        });
    },
    render:function(){
        console.log('render 1');
        return (
            <div style={{'width':'500px','height':'500px','backgroundColor':'#bbb'}} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave} onMouseOver={this.handleMouseOver} onClick={this.handleClick}>{'x：'+this.state.x+'，y：'+this.state.y}</div>
        );
    }
});
React.render(<div><HelloWorld /><HelloWorld /></div>,document.getElementById('example'));
