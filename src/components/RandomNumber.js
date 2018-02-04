import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class RandomNumber extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired
  }
  handlerPress = () => {
    if (this.props.isDisabled) {return;}
    this.props.onPress(this.props.id);
  };
  render() {
    return (
      <TouchableOpacity onPress={this.handlerPress}>
        <Text style={[styles.random, this.props.isDisabled && styles.disabled]}>{this.props.number}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  random: {
    backgroundColor: '#888',
    color: '#FFF',
    width: 120,
    marginVertical: 25,
    fontSize: 35,
    textAlign: 'center'
  },
  disabled: {
    opacity: 0.3
  }
});

RandomNumber.propTypes = {
};
