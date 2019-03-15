import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';

const checkURLExternal = /^https?:\/\//;

let globalLinkTimeout = null;

class Component extends React.PureComponent {
  static displayName = 'Link';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired,
    sounds: PropTypes.object.isRequired,
    className: PropTypes.any,
    children: PropTypes.any,
    href: PropTypes.string.isRequired,
    target: PropTypes.string,
    delay: PropTypes.number,
    onClick: PropTypes.func,
    onLinkStart: PropTypes.func,
    onLinkEnd: PropTypes.func
  };

  render () {
    const {
      theme,
      classes,
      audio,
      sounds,
      href,
      target,
      delay,
      children,
      onClick,
      onLinkStart,
      onLinkEnd,
      ...etc
    } = this.props;

    const linkTrigger = event => {
      event.preventDefault();
      sounds.click.play();

      const { pathname, search } = window.location;
      const isSame = pathname + search === href;
      const isExternalURL = checkURLExternal.test(href);
      const isOut = !!target;
      const isInternal = !isOut && !isSame;
      const linkProps = { isOut, isExternalURL, isSame, isInternal };

      onClick && onClick(event);
      onLinkStart && onLinkStart(event, linkProps);

      if (isSame) {
        return;
      }

      const timeout = delay || theme.animation.time;

      clearTimeout(globalLinkTimeout);
      globalLinkTimeout = setTimeout(() => {
        if (target) {
          window.open(href);
        } else if (isExternalURL) {
          window.location.href = href;
        } else {
          navigate(href);
        }

        onLinkEnd && onLinkEnd(event, linkProps);
      }, timeout);
    };

    return (
      <a {...etc} href={href} target={target} onClick={linkTrigger}>
        {children}
      </a>
    );
  }
}

export { Component };