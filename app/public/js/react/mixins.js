var logMixin={
    getDefaultProps:function(){
        console.log('getDefaultProps 1');
        return {};
    },
    getInitialState:function(){
        console.log('getInitialState 2');
        return {ready:false};
    },
    componentWillMount:function(){
        console.log('componentWillMount 3');
        this.setState({ready:true});
    },
    componentWillReceiveProps:function(nextProps){
        console.log('componentWillReceiveProps 6');
        // console.log(nextProps);
        // console.log(this.props);
    },
    shouldComponentUpdate:function(){
        console.log('shouldComponentUpdate 7');
        return true;
    },
    componentWillUpdate:function(){
        console.log('componentWillupdate 8');
    },
    componentDidMount:function(){
        console.log('componentDidMount 5');
        // console.log(this.getDOMNode());
    },
    componentDidUpdate:function(){
        console.log('componentDidUpdate 9');
        // console.log(this.getDOMNode());
    },
    componentWillUnmount:function(){
        console.log('componentWillUnmount 10');
    }
}
