import React from 'react';
import PropTypes from 'prop-types';

import {
  isNumber,
  ENTERING,
  ENTERED,
  EXITING,
  EXITED,
  getAnimationStatusState
} from '../../tools';

class Component extends React.PureComponent {
  static displayName = 'Secuence';

  static propTypes = {
    theme: PropTypes.any.isRequired,
    animate: PropTypes.bool,
    show: PropTypes.bool,
    appear: PropTypes.bool,
    stagger: PropTypes.bool,
    children: PropTypes.array.isRequired
  };

  static defaultProps = {
    animate: true,
    show: true,
    appear: true
  };

  constructor () {
    super(...arguments);

    const { animate, appear, children } = this.props;
    const initialStatus = animate && appear ? EXITED : ENTERED;

    this.timeouts = {};

    this.state = {
      childrenStatuses: children.map(() => initialStatus)
    };
  }

  componentDidMount () {
    const { children, animate, show } = this.props;

    if (children.length && animate && show) {
      this.enter();
    }
  }

  componentWillUnmount () {
    this.resetTimeouts();
  }

  componentDidUpdate (prevProps) {
    const { animate, show } = this.props;

    if (animate && show !== prevProps.show) {
      if (show) {
        this.enter();
      } else {
        this.exit();
      }
    }
  }

  resetTimeouts () {
    Object.values(this.timeouts).forEach(clearTimeout);
  }

  schedule (key, time, callback) {
    this.unschedule(key);
    this.timeouts[key] = setTimeout(callback, time);
  }

  unschedule (key) {
    clearTimeout(this.timeouts[key]);
  }

  enter () {
    const { theme, stagger, children } = this.props;
    const staggerTime = theme.animation.stagger;

    this.resetTimeouts();

    if (stagger) {
      children.forEach((item, index) => {
        this.schedule(index, index * staggerTime, () => {
          this.performEntering(index);
        });
      });
    } else {
      this.performEntering(0);
    }
  }

  exit () {
    this.resetTimeouts();
    this.performExiting('all');
  }

  performEntering (key) {
    const { theme, stagger } = this.props;
    const duration = theme.animation.time;

    this.performStatus(key, ENTERING, () => {
      this.schedule(key, duration, () => {
        this.performEntered(key);

        if (!stagger && isNumber(key) && key < this.props.children.length - 1) {
          this.performEntering(key + 1);
        }
      });
    });
  }

  performEntered (key) {
    this.performStatus(key, ENTERED);
  }

  performExiting (key) {
    const duration = this.props.theme.animation.time;

    this.performStatus(key, EXITING, () => {
      this.schedule(key, duration, () => this.performExited(key));
    });
  }

  performExited (key) {
    this.performStatus(key, EXITED);
  }

  performStatus (key, status, callback) {
    const childrenStatuses = this.state.childrenStatuses.map((item, index) => {
      if (key === 'all' || index === key) {
        return status;
      }

      return item;
    });

    this.setState(() => ({ childrenStatuses }), callback);
  }

  render () {
    const { children } = this.props;
    const { childrenStatuses } = this.state;

    return children.map((item, index) => {
      const animationState = getAnimationStatusState(childrenStatuses[index]);
      return item(animationState);
    });
  }
}

export { Component };