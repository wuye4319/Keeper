import '<%= myless %>';

var imgSrc=window.supervar.imgsrc_cn;
var apiUrl=window.supervar.apiURL;
var domain="//www."+window.supervar.domain;
var hrefUrl=domain+"/cn/page/";

/* your logic code */
class Content extends React.Component{
    componentWillMount(){
        document.getElementById("container").style.opacity=1;
    }
    render(){
        return(
            <div>this is your page content</div>
        )
    }
}

var Wrap = window.supervar.Wrap;
var content=ReactDOM.render(
    <Wrap content={Content} />,
    document.getElementById("container")
);