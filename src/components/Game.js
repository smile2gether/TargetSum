import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, StyleSheet } from 'react-native';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

export default class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain:PropTypes.func.isRequired
  }
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  }
  gameStatus = 'PLAYING'
  randomNumbers = Array.from({ length: this.props.randomNumberCount })
    .map(() => 1 + Math.floor(10 * Math.random()));
  shuffleRandomNumbers = shuffle(this.randomNumbers);
  target = this.randomNumbers.slice(0, this.props.randomNumberCount -2)
    .reduce((acc, curr) => acc + curr, 0);

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        return { remainingSeconds: prevState.remainingSeconds - 1 };
      }, () => {
        if (this.state.remainingSeconds === 0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  }
  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex]
    }));
  }
  componentWillUpdate(nextPros, nextState) {
    if (nextState.selectedIds !== this.state.selectedIds ||
        nextState.remainingSeconds === 0) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }
  calcGameStatus = (status) => {
    const sumSelected = status.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffleRandomNumbers[curr];
    }, 0);
    if (status.remainingSeconds === 0) {
      return 'LOST';
    } 
    if (sumSelected < this.target) {
      return 'PLAYING';
    } else if (sumSelected === this.target) {
      return 'WIN';
    } else {
      return 'LOST';
    }
  }
  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
        <View style={styles.randomContainer}>
          {this.shuffleRandomNumbers.map((randomNumber, index) =>
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
              onPress={this.selectNumber}/>
          )}
        </View>
        { this.gameStatus === 'PLAYING' && (
          <Text style={styles.remainingTime}>Time left {this.state.remainingSeconds}</Text>
        )}
        {this.gameStatus !== 'PLAYING' && (
          <Button title="Play Again" onPress={this.props.onPlayAgain} style={styles.playAgainBtn}/>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#add8e6',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 50,
  },
  target: {
    fontSize: 40,
    textAlign: 'center'
  },
  randomContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  remainingTime: {
    fontSize: 25,
    textAlign: 'center',
    color: 'white'
  },
  playAgainBtn: {
    backgroundColor: '#FFF'
  },
  STATUS_PLAYING: {
    backgroundColor: 'white',
    color: '#add8e6',
  },
  STATUS_WIN: {
    backgroundColor: '#ACE8D9',
    color: '#FDFFFE'
  },
  STATUS_LOST: {
    backgroundColor: '#FFD4BD',
    color: '#FFFEFD'
  }
});

Game.propTypes = {
};
