import React from 'react'
import Sidebar from '../../../components/SideBarD'
import Header from '../../../components/Header'
import GetRestObject from '../../../api/ConnectServerGet'

function syncDelay(milliseconds) {
  var start = new Date().getTime()
  var end = 0
  while (end - start < milliseconds) {
    end = new Date().getTime()
  }
}

export default class DynamicTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      items: [],
      nombres: [],
      amountArray: [],
      priceArray: [],
      calculate: [],
      amount: '',
      price: '',
      co: '',
      aux: [],
      aux2: [],
      results: [],
      priceCalcute: [],
      time: '',
    }
  }
  GetRequestedDetails = () => {
    GetRestObject.GetRestRequest(`/api/factors`, (getResultObj) => {
      //console.log(getResultObj)
      getResultObj.splice(0, 0, 'Names')
      this.setState({ nombres: getResultObj })
    })
  }
  /*
  PostRequestedDetails = () => {
    var postData = {
      RequestType: 'api',
      RequestJson: { param: 'value' },
    }
    PostRestObject.PostRestRequest(`/api/factors`, postData, (postResultObj) => {
      console.log(postResultObj)
    })
  }
  */
  componentDidMount = () => {
    this.GetRequestedDetails()
    //this.PostRequestedDetails()
  }

  updateMessage(event) {
    this.setState({
      message: event.target.value,
    })
  }
  updateAmount(event) {
    this.setState({
      amount: event.target.value,
    })
  }
  updatePrice(event) {
    this.setState({
      price: event.target.value,
    })
  }
  updateCO(event) {
    this.setState({
      co: event.target.value,
    })
  }
  updateTime(event) {
    this.setState({
      time: event.target.value,
    })
  }

  handleClick() {
    var items = this.state.items
    var amountArray = this.state.amountArray
    var priceArray = this.state.priceArray
    var calculate = this.state.calculate

    items.push(this.state.message)
    amountArray.push(this.state.amount)
    priceArray.push(this.state.price)

    this.setState({
      items: items,
      message: '',
      amountArray: amountArray,
      amount: '',
      priceArray: priceArray,
      price: '',
      calculate: calculate,
      co: '',
    })
    console.log('estado de arrays al agregar')
    console.log(items)
    console.log(amountArray)
    console.log(priceArray)
    console.log(calculate)
  }

  calcular() {
    var items = this.state.items
    var amountArray = this.state.amountArray
    var priceArray = this.state.priceArray
    var calculate = this.state.calculate
    var aux = this.state.aux
    var results = this.state.results
    var priceCalcute = this.state.priceCalcute
    var time = this.state.time

    console.log('estado de arrays antes de calcular')
    console.log(items)
    console.log(amountArray)
    console.log(priceArray)
    console.log(calculate)
    console.log(aux)
    console.log(results)
    console.log(priceCalcute)
    console.log(time)

    var targetUrl = '/api/factors'
    const res = fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        requestData: {
          name: items,
          amount: amountArray,
          price: priceArray,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('datos calculados')
        console.log(data)
        calculate = data
        results = data.coePartial
        priceCalcute = data.prices
        this.setState({
          items: items,
          amountArray: amountArray,
          priceArray: priceArray,
          results: results,
          calculate: calculate,
          priceCalcute: priceCalcute,
        })
        //console.log(results)

        console.log('estado de arrays despues de calcular')
        console.log(items)
        console.log(amountArray)
        console.log(priceArray)
        console.log(results)
        console.log(calculate)
        console.log(priceCalcute)
        this.renderRows()
      })
      .catch((err) => console.log(err))
  }

  save() {
    var items = this.state.items
    var results = this.state.results
    var calculate = this.state.calculate
    var priceCalcute = this.state.priceCalcute
    var time = this.state.time
    var stationaryDB = true
    var mobileDB = false
    var energyDB = false

    console.log(items)
    console.log(results)
    console.log(calculate)
    console.log(priceCalcute)
    console.log(time)

    var targetUrl = '/api/reports'
    const res = fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        requestData: {
          items: items,
          coPartial: calculate.coPartial,
          chPartial: calculate.chPartial,
          noPartial: calculate.noPartial,
          coePartial: calculate.coePartial,
          coTotal: calculate.coTotal,
          chTotal: calculate.chTotal,
          noTotal: calculate.noTotal,
          coeTotal: calculate.coeTotal,
          priceCalcute: priceCalcute,
          time: time,
          stationary: stationaryDB,
          mobile: mobileDB,
          energy: energyDB,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => console.log(err))
  }

  handleItemChanged(i, event) {
    var items = this.state.items
    items[i] = event.target.value

    this.setState({
      items: items,
    })
  }

  handleItemDeleted(i) {
    var items = this.state.items
    var amountArray = this.state.amountArray
    var priceArray = this.state.priceArray
    var results = this.state.results
    var priceCalcute = this.state.priceCalcute

    //console.log(i)
    items.splice(i, 1)
    amountArray.splice(i, 1)
    priceArray.splice(i, 1)
    results.splice(i, 1)
    priceCalcute.splice(i, 1)

    this.setState({
      items: items,
      amountArray: amountArray,
      priceArray: priceArray,
      results: results,
      priceCalcute: priceCalcute,
    })
    console.log('estado de arrays despues de eliminar')
    console.log(results)
    console.log(items)
    console.log(amountArray)
    console.log(priceArray)
    console.log(priceCalcute)
  }

  renderRows() {
    var context = this
    var items = this.state.items
    var amountArray = this.state.amountArray
    var priceArray = this.state.priceArray
    var results = this.state.results
    var priceCalcute = this.state.priceCalcute
    //var aux = this.state.aux

    //console.log('render', calculate)
    return this.state.items.map(function (o, i) {
      return (
        <tr key={'item-' + i}>
          <td>{o}</td>
          <td>{amountArray[i]}</td>
          <td>{priceArray[i]}</td>
          <td>{results[i]}</td>
          <td>{priceCalcute[i]}</td>
          <td>
            <button onClick={context.handleItemDeleted.bind(context, i)}>Delete</button>
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <Sidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <Header />
          <table className="">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount (Gal)</th>
                <th>Unit Price (USD/Gal)</th>
                <th>Total Emissions (kg CO2eq)</th>
                <th>Total Price (USD)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
          <hr />
          <label>Select a fuel</label>
          <select type="text" value={this.state.message} onChange={this.updateMessage.bind(this)}>
            {this.state.nombres.map((elemento) => (
              <option key={elemento.id} value={elemento.id}>
                {elemento}
              </option>
            ))}
          </select>
          <label>Enter the amount (Gal)</label>
          <input type="text" value={this.state.amount} onChange={this.updateAmount.bind(this)} />
          <label>Unit Price (USD/Gal)</label>
          <input type="text" value={this.state.price} onChange={this.updatePrice.bind(this)} />
          <label>Select a </label>
          <select type="text" value={this.state.time} onChange={this.updateTime.bind(this)}>
            <option>Month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
          <button onClick={this.handleClick.bind(this)}>Add Item</button>
          <button onClick={this.calcular.bind(this)}>Calculate</button>
          <button onClick={this.save.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}
