import React, { Component } from 'react';
const io = require('socket.io-client')  
const socket = io('http://localhost:8000')

class Chat extends Component {
  constructor(props) {
		super(props);

		this.state = { 
      response: false,
      selected: null,
      message: '',
      user: '',
      messages: []
    }
  }

  componentDidMount() {
    // if response is false, concat message
    // if response is true, find message using replyToId
    // add message to responses []
    let isResponse = this.state.response
    if (isResponse) {
      socket.on('chat', (data) => {
        let messages = Object.assign({}, this.state.messages)
        messages[data.replyToId].responses.concat(data)
        this.setState({
          messages: messages,
          response: false
        })
      })
    } else {
      socket.on('chat', (data) => {
      console.log("Received from server: " + data)
        this.setState({
          messages: this.state.messages.concat(data)
        })
      })
    }
  }

  handleChange = (event) => {
    this.setState({message: event.target.value})
  }

  handleUserChange = (event) => {
    this.setState({user: event.target.value})
  }

  handleSubmit = (event) => {
    if (!this.state.response) {
      console.log("Submit button clicked to send: ", this.state.message)
      socket.emit('chat', {
        message: this.state.message, 
        user: this.state.user,
        responses: []
      })
    } else {
      let id = this.state.selected
      socket.emit('chat',{
        message: this.state.message,
        user: this.state.user,
        replyToId: id
      })
    }
    // reset form upon send
    document.getElementById('message').value = ''
  }

  handleClickMessage = (event) => {
    let id = event.currentTarget.dataset.id
    this.setState({
      response: !this.state.response,
      selected: id
    })
    //let id = event.currentTarget.dataset.id 
    //console.log("Message clicked: " + id)
  }
  
  render() {
    const messages = this.state.messages
    return (
      <div>
        <div id="chat-container">
          <div id="chat-window">
            <div id="output">
              {messages.map((message, key) => {
                return (
                  <div onClick={this.handleClickMessage.bind(this)} data-id={key} key={key}>
                    <p>{message.user}: {message.message}</p>
                    <div className={"response-" + key}></div>
                  </div>
                )
              })}
            </div>
            <div id="feedback"></div>
          </div>
          <input type="text" id="user" value={this.state.value} onChange={this.handleUserChange} />
          <input type="text" id="message" value={this.state.value} onChange={this.handleChange} />
          <button type="submit" onClick={this.handleSubmit}>Send</button>
        </div>
      </div>
    )
  }
}

export default Chat

