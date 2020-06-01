import React from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myId:'',
      myBalance:0,
      chain:[],
      myTransactions:[],
      transactionsNotIn:true,
    }
  }

  handleChange = (evt) => {
    evt.preventDefault();
    this.setState({
      myId: evt.target.value
    })
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    localStorage.setItem('myId', this.state.myId)
    const { myId } = this.state
    let myBalance = 0
    let myTxns = []
    console.log('this.state.chain', this.state.chain)
    this.state.chain.map(block => {
      console.log('block', block)
      block.transactions.forEach(tx => {
        console.log('tx', tx)
        if(tx.recipient === myId){
          myBalance = myBalance + tx.amount
          myTxns.push(tx)
        }
        if(tx.sender === myId){
          myBalance = myBalance - tx.amount
          myTxns.push(tx)
        }
        else{
          console.log('not your transaction')
        }        
      })
    })
    // this.state.chain.filter(blocks => blocks.transactions.recipient == localStorage.getItem('myId'))
    console.log('myBalance', myBalance)
    console.log('myTxns', myTxns)
    let displayReadyTransactions = myTxns.map((transaction) => {
      // {console.log('adding in transaction', transaction)}
      return (
        <div >
          <br /><hr /><br />
          <p>Transaction:</p>
          <p>From: {transaction.sender}</p>
          <p>To: {transaction.recipient}</p>
          <p>Amount: {transaction.amount}</p>
          <br /><hr /><br />
        </div>
      )
    })
    console.log('displayReadyTransactions', displayReadyTransactions)
    this.setState({ myBalance: myBalance, myTransactions: displayReadyTransactions, transactionsNotIn:false})
    // this.setState({myTransactions: myTxns})
  }

  UNSAFE_componentWillMount(){
    return axios.get('http://0.0.0.0:8000/chain')
    .then(response => {
      console.log(response)
      this.setState({chain: response.data.chain})
    })
  }

  render() {
    const {myId} = this.state
    return (
      <div className="App">
        <br />
        <form onSubmit={this.handleSubmit}>
          <label>MyWalletId</label> <br />
          <input type="text" value={myId} placeholder="myWalletId" onChange={this.handleChange} required /> <br />
          <button type="submit">See Transactions for WalletID</button>
        </form>
        <br /><hr /><br />
        <div>
          {this.state.myBalance === 0 ? <p>Enter Your Id To View Your Balance</p> : <p>Your Balance is: {this.state.myBalance}</p>}
        </div>
        <div>
          {console.log('this.state.myTransactions', this.state.myTransactions)}
          {this.state.transactionsNotIn ? <p>Enter Your Id To View Your Transactions</p> : <p>Your Transactions: {this.state.myTransactions}</p>}
        </div>
      </div>
    );
  }
  
}

export default App;
