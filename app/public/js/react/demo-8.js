var style={
    color:'red',
    border:'1px solid #000'
};

var rawHTML={
    __html:"<h1>I'm inner HTML</h1>"
}
var count=0;
var HelloWorld=React.createClass({
    getDefaultProps:function(){
        console.log('getDefaultProps 1');
        return {name:'World'};
    },
    getInitialState:function(){
        console.log('getInitialState 2');
        return {count:++count,ready:false};
    },
    componentWillMount:function(){
        console.log('componentWillMount 3');
        this.setState({ready:true});
    },
    componentWillReceiveProps:function(nextProps){
        console.log('componentWillReceiveProps 6');
        console.log(nextProps);
        console.log(this.props);
        nextProps.name=nextProps.name+nextProps.name;
        if(nextProps.name=='')nextProps.name='World';
    },
    shouldComponentUpdate:function(){
        console.log('shouldComponentUpdate 7');
        return true;
    },
    componentWillUpdate:function(){
        console.log('componentWillupdate 8');
    },
    render:function(){
        console.log('render 4');
        return (<p ref="childP" className="lei" htmlFor="forlei">Hello , {this.props.name} {this.state.count}  {''+this.state.ready}</p>);
    },
    componentDidMount:function(){
        console.log('componentDidMount 5');
        console.log(this.getDOMNode());
    },
    componentDidUpdate:function(){
        console.log('componentDidUpdate 9');
        console.log(this.getDOMNode());
    },
    componentWillUnmount:function(){
        console.log('componentWillUnmount 10');
    }
});
var HelloWorldParent=React.createClass({
    getInitialState:function(){
        return {name:undefined};
    },
    handleChange:function(event){
        var val=event.target.value;
        if(val=='123'){
            React.unmountComponentAtNode(document.getElementById('example'));
            return;
        }
        this.setState({name:event.target.value});
    },
    render:function(){
        return(
            <div>
                <span dangerouslySetInnerHTML={rawHTML}></span>
                <HelloWorld name={this.state.name} />
                <br />
                {
                    //注释
                    /*
                        多行注释
                    */
                }
                <input type="text" onChange={this.handleChange} />
            </div>
        );
    }
});

React.render(<div style={style}><HelloWorldParent /></div>,document.getElementById('example'));
