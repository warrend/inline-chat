import React, { Component } from 'react';
const io = require('socket.io-client')  
const socket = io('http://localhost:8000')

class Chat extends Component {
  constructor(props) {
		super(props);

		this.state = { 
      message: '',
      messages: []
    }
  }

  componentDidMount() {
    socket.on('chat', (data) => {
      console.log("Received from server: " + data)
      this.setState({
        messages: this.state.messages.concat(data)
      })
    })
  }

  handleChange = (event) => {
    this.setState({message: event.target.value})
  }

  handleUserChange = (event) => {
    this.setState({user: event.target.value})
  }

  handleSubmit = (event) => {
    console.log("Submit button clicked to send: ", this.state.message)
    socket.emit('chat', this.state.message)
    // reset form upon send
    document.getElementById('message').value = ''
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
                  <div key={key}>
                    <p>{message}</p>
                    <div id="response"></div>
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

