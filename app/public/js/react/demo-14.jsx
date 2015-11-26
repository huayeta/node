var LeftMove=React.createClass({
    // mixins:[logMixin],
    setAni:function(){
        if(this.props.positionLeft){
            setTimeout(this.resolvePositionLeft,this.props.positionDalay);
        }
    },
    getInitialState:function(){
        return{
            positionLeft:0
        }
    },
    resolvePositionLeft:function(){
        if(this.state.positionLeft<this.props.positionLeft){
            this.setState({
                positionLeft:this.state.positionLeft+1
            });
        }
    },
    componentDidMount:function(){
        this.setAni();
    },
    componentDidUpdate:function(){
        this.setAni();
    },
    render:function(){
        return (
            <div style={{marginLeft:this.state.positionLeft}}>I\m LeftMove</div>
        );
    }
});
React.render(<div><LeftMove positionLeft={100} positionDalay={10}  /><LeftMove positionLeft={500} positionDalay={1}  /></div>,document.getElementById('example'));
