import React, { Component } from 'react'
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
    socket.on('chat', (data) => {
      if (this.state.response === true) {
        let selected = parseInt(this.state.selected, 10)
        let copyState = Object.assign({}, this.state)
        let leftState = copyState.messages.slice(0, selected + 1)
        let rightState = copyState.messages.slice(selected + 1)
        let newState = [...leftState, data, ...rightState]
        console.log("Response fired")
        this.setState({
          messages: newState,
          response: false,
          selected: null
        })
        let highlight = document.querySelector(".response-" + selected + " p")
        highlight.style.cssText = "border: none"
      } else {
          console.log("Regular fired")
          this.setState({
            messages: this.state.messages.concat(data)
          })
        }
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
    socket.emit('chat', {
      message: this.state.message, 
      user: this.state.user,
    })
    // reset form upon send
    document.getElementById('message').value = ''
  }

  handleClickMessage = (event) => {
    let id = event.currentTarget.dataset.id
    let highlight = document.querySelector(".response-" + id + " p")
    highlight.style.cssText = "border: 1px solid"
    this.setState({
      response: true,
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
                  <div onClick={this.handleClickMessage.bind(this)} className={"response-" + key} data-id={key} key={key}>
                    <p>{message.user}: {message.message}</p>
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

