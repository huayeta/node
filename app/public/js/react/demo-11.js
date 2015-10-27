var BingingMixin={
    handleChange:function(name,event){
        var newState={};
        newState[name]=event.target.value;
        this.setState(newState);
    }
}
var BindingExample=React.createClass({
    mixins:[BingingMixin],
    getInitialState:function(){
        return{
            // text:''
        }
    },
    render:function(){
        return(
            <div><input type="text" onInput={this.handleChange.bind(this,'text')} /><p>{this.state.text}</p></div>
        );
    }
});
React.render(<BindingExample />,document.getElementById('example'));
