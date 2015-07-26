var Logo = React.createClass({
  render: function(){
    return (
      <span className="logo">Hacker News</span>
    );
  }
});

var Link = React.createClass({
  onLinkClick: function (evt) {
    var menu = this.props.menu;
    PubSub.publish('CURRENT_URL', menu);
  },
  render: function() {
    return (<span onClick={this.onLinkClick}> {this.props.menu} </span>);
  }
});

var Menu = React.createClass({
  render: function(){
    return (
      <span>
         <Link menu={"top"} /> | <Link menu={"new"} /> | <Link menu={"best"} />
      </span>
    );
  }
});

var Navi = React.createClass({
  render: function(){
    return (
      <div>
        <Logo /> <Menu />
      </div>
    );
  }
});

var News = React.createClass({
  render: function(){
    return (
      <div>
        <div className="title">
          <span>
          <a href={this.props.news.link}>{this.props.news.title}</a> ({this.props.news.domain})
          </span>
        </div>
        <div className="subtext">
          {this.props.news.points} points by <a herf={this.props.news.submitter_profile}>{this.props.news.submitter}</a> {this.props.news.published_time} |
          <a herf={this.props.news.comments_link}>{this.props.news.num_comments} comments</a>
        </div>
      </div>
    );
  }
});

var NewsList = React.createClass({
  getInitialState: function(){
    return {newslist:[], url:"http://nhnsbdev.herokuapp.com/api/v1/top"};
  },

  getNewsList: function(){
    $.ajax({
      url: this.state.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data);
        this.setState({newslist: data.stories});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.state.url, status, err.toString());
      }.bind(this)
    });
  },

  componentWillMount: function() {
    this.pubsub_token = PubSub.subscribe('CURRENT_URL', function(topic, message) {
      if (message === "top"){
        this.setState({ url: "http://nhnsbdev.herokuapp.com/api/v1/top" });
      } else if (message === "new"){
        this.setState({ url: "http://nhnsbdev.herokuapp.com/api/v1/newest" });
      } else if (message === "best") {
        this.setState({ url: "http://nhnsbdev.herokuapp.com/api/v1/best" });
      }

      this.getNewsList();

    }.bind(this));
  },

  componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
  },

  componentDidMount:function(){
    this.getNewsList();
  },

  render: function() {
    var NewsNodes = this.state.newslist.map(function(news){
      return (
        <li>
          <News news={news}/>
        </li>
      );
    });
    return (
      <ol>{NewsNodes}</ol>
    );
  }
});

React.render(
  <Navi />,
  document.getElementById('navi')
);

React.render(
  <NewsList />,
  document.getElementById('newslist')
);
