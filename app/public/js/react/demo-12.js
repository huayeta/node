var BingingMixin={
    handleChange:function(event){
        var newState={};
        newState[event.target.name]=event.target.value;
        this.setState(newState);
    }
}
var BindingExample=React.createClass({
    mixins:[BingingMixin],
    getInitialState:function(){
        return{}
    },
    render:function(){
        return(
            <div><input type="text" name="text" onChange={this.handleChange} /><p>{this.state.text}</p></div>
        );
    }
});
React.render(<BindingExample />,document.getElementById('example'));
