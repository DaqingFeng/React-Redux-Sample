import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore, bindActionCreators, combineReducers, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk';
import { prototype } from 'events';
import { ETIME } from 'constants';

// React component
class Counter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: 0
    }
  }

  btnIncreaseClick() {
    this.props.actions(this.state.inputValue);
  }

  onbtnIncreaseClick() {
    this.props.onIncreaseClick(this.state.inputValue);
  }


  handelChange(e) {
    this.setState({
      inputValue: parseInt(e.target.value)
    })
  }

  render() {
    return (
      <div>
        <label>{this.props.isLoding}</label>
        <br></br>
        <span>{this.props.value}</span>
        <br></br>
        <input value={this.props.textValue} onChange={this.handelChange.bind(this)}></input>
        <button onClick={this.btnIncreaseClick.bind(this)}>状态按钮</button>
        <button onClick={this.onbtnIncreaseClick.bind(this)}>按钮</button>
      </div>
    )
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
}

// Action---------------
const actionType = 'increase';
const actionStatus = 'actionsStatus';
const IncreaseAction = (datavalue) => {
  return {
    type: actionType,
    dataValue: datavalue
  }
}

const IncreaseCreateAction = (datavalue) => {
  return dispatch => {
    dispatch({
      type: actionStatus,
      isLoding: '计算中.....'
    });
    setTimeout(() => {

      dispatch({
        type: actionStatus,
        isLoding: '计算结束.....'
      });
      return dispatch(
        {
          type: actionType,
          dataValue: datavalue
        }
      )
    }, 5000);
  }
}
//end Action-----------


// Reducer
function counter(state = { previousValue: 0, dataValue: 0 }, action) {
  const pValue = state.previousValue
  switch (action.type) {
    case actionType:
      return { previousValue: pValue + action.dataValue }
    default:
      return state
  }
}


function statusCounter(state = { isLoding: '' }, action) {
  switch (action.type) {
    case actionStatus:
      return Object.assign({}, state, {
        isLoding: action.isLoding,
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  counter,
  statusCounter,
})
//End Reducer------------------- 



// Store----------------
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

// Map Redux state to component props
function mapStateToProps(state) {
  return {
    value: state.counter.previousValue,
    dataValue: state.counter.dataValue,
    isLoding: state.statusCounter.isLoding
  }
}
//End Store-------------------


// Map Redux actions to component props--
function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: (dataValue) =>
      dispatch(IncreaseAction(dataValue))
  }
}

function matchDispatchToProps(dispatch) {
  return {
    //dispatch inner logic
    actions: bindActionCreators(IncreaseCreateAction, dispatch),
    //dispatch logic
    onIncreaseClick: bindActionCreators(IncreaseAction, dispatch)
  };
}

// Connected Component
const App = connect(
  mapStateToProps,
  matchDispatchToProps,
)(Counter)
//End Map Redux------


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
