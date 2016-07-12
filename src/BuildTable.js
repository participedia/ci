import React from 'react'
import 'aws-sdk/dist/aws-sdk'
const AWS = window.AWS

// These are for a public user, with only read rights to a non-sensitive resource
AWS.config.update({accessKeyId: __AWS_ACCESS_KEY_ID__, secretAccessKey: __AWS_SECRET_ACCESS_KEY__})
AWS.config.update({region: 'us-east-1'})

var db = new AWS.DynamoDB()

var Build = React.createClass({
  render: function () {
    console.log(this.props)
    let num = this.props.build.buildNum ? this.props.build.buildNum.N : 'no number'
    let status = this.props.build.status ? this.props.build.status.S : 'NA'
    let comment = this.props.build.comment.S
    let contributors = this.props.build.committers.SS.map(function(username) {
      let usernameurl = 'https://github.com/'+username
      return (<a href={usernameurl}>{username}</a>)}
    ) // can we have multiple contributors?

    return (
      <div className="build pure-g">
        <div className="pure-u-1-8">
          Build {num}
        </div>
        <div className="pure-u-1-8">
          <span className={status}>{status}</span>&nbsp;
        </div>
        <div className="pure-u-3-4">
          (<span className="comment">“{comment}”</span> by {contributors})
        </div>
      </div>
    )
  }

})

var BuildList = React.createClass({
  render: function () {
    if (!this.props.data.length) {
      return (<div />)
    }
    let key = 0
    let builds = this.props.data
    var commentNodes = builds.map(function (build) {
      if (!build.status) {
        let projecturl = 'https://github.com/' + build.project.S.slice(3, build.project.S.length)
        return (
          <h2>For <a href={projecturl}>{build.project.S}</a></h2>
        )
      } else {
        key = key + 1
        return (
          <Build key={key} build={build} />
        )
      }
    })
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    )
  }
})

var BuildTable = React.createClass({
  getInitialState: function () {
    return {data: []}
  },
  componentDidMount: function () {
    let component = this
    db.scan({
      TableName: 'lambci-builds',
      Limit: 50
    }, function (err, data) {
      if (!err) {
        component.setState({data: data.Items})
      } else {
        console.error(err)
      }
    })
  },

  render: function () {
    return (
      <div className="container">
        <header role="banner">
          <h1>Continuous Integration Dashboard</h1>
        </header>
        <BuildList data={this.state.data} />
      </div>
    )
  }
})

export default BuildTable
