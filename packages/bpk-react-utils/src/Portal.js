/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2016-2020 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @flow strict */

import {
  unstable_renderSubtreeIntoContainer, // eslint-disable-line camelcase
  unmountComponentAtNode,
  findDOMNode,
} from 'react-dom';
import { type Node, Component } from 'react';
import assign from 'object-assign';
import PropTypes from 'prop-types';

const KEYCODES = {
  ESCAPE: 27,
};

export type Props = {
  children: Node,
  isOpen: boolean,
  beforeClose: ?(() => void) => void,
  className: ?string,
  onClose: (event: SyntheticEvent<>) => ?void,
  onOpen: (event: SyntheticEvent<>) => ?void,
  onRender: () => mixed,
  style: ?{},
  renderTarget: ?() => mixed,
  target: ?(() => ?HTMLElement) | HTMLElememnt,
  targetRef: ?() => mixed,
  closeOnEscPressed: boolean,
};

export type State = {};

class Portal extends Component<Props, State> {
  shouldClose: boolean;

  portalElement: ?HTMLElement;

  onDocumentMouseUp: () => mixed;

  onDocumentMouseDown: () => mixed;

  onDocumentKeyUp: () => mixed;

  onDocumentKeyDown: () => mixed;

  static propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    beforeClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    className: PropTypes.string,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    onRender: PropTypes.func,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    renderTarget: PropTypes.func,
    target: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    targetRef: PropTypes.func,
    closeOnEscPressed: PropTypes.bool,
  };

  static defaultProps = {
    beforeClose: null,
    className: null,
    onClose: () => null,
    onOpen: () => null,
    onRender: () => null,
    style: null,
    renderTarget: null,
    target: null,
    targetRef: null,
    closeOnEscPressed: true,
  };

  constructor() {
    super();

    this.portalElement = null;

    // shouldClose is used to keep track of the user's mouse-down events in order to
    // prevent the dialog closing if the mouse leaves / enters the portal during the click
    this.shouldClose = false;

    this.close = this.close.bind(this);
    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.getClickEventProperties = this.getClickEventProperties.bind(this);
    this.supportsPassiveEvents = this.supportsPassiveEvents.bind(this);
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.open();
    }

    if (this.props.targetRef) {
      this.props.targetRef(this.getTargetElement());
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isOpen) {
      if (!prevProps.isOpen) {
        this.open();
        return;
      }
    } else if (prevProps.isOpen) {
      if (this.props.beforeClose) {
        this.props.beforeClose(this.close);
      } else {
        this.close();
      }
      return;
    }

    this.renderPortal();
  }

  componentWillUnmount() {
    this.close();
  }

  onDocumentMouseDown(event) {
    const clickEventProperties = this.getClickEventProperties(event);
    if (
      clickEventProperties.isNotLeftClick ||
      clickEventProperties.isTargetClick ||
      clickEventProperties.isPortalClick
    ) {
      this.shouldClose = false;
      return;
    }

    this.shouldClose = true;
  }

  onDocumentMouseUp(event) {
    const clickEventProperties = this.getClickEventProperties(event);

    if (
      clickEventProperties.isNotLeftClick ||
      clickEventProperties.isTargetClick ||
      clickEventProperties.isPortalClick
    ) {
      this.shouldClose = false;
      return;
    }

    if (this.shouldClose) {
      this.props.onClose(event, { source: 'DOCUMENT_CLICK' });
    }
  }

  onDocumentKeyDown(event) {
    if (
      event.keyCode === KEYCODES.ESCAPE &&
      this.props.isOpen &&
      this.props.closeOnEscPressed
    ) {
      this.props.onClose(event, { source: 'ESCAPE' });
    }
  }

  onDocumentMouseMove() {
    this.shouldClose = false;
  }

  getClickEventProperties(event) {
    const isNotLeftClick = event.button && event.button !== 0;

    const targetElement = this.getTargetElement();
    const isTargetClick =
      targetElement &&
      (event.target === targetElement || targetElement.contains(event.target));

    const isPortalClick =
      this.portalElement &&
      (event.target === this.portalElement ||
        this.portalElement.contains(event.target));

    return {
      isNotLeftClick,
      isTargetClick,
      isPortalClick,
    };
  }

  getTargetElement() {
    if (typeof this.props.target === 'function') {
      return this.props.target();
    }

    // Whilst findDOMNode is planned for deprecation in a future implementation of react, since this is the only usage
    // in backpack, we have decided to ignore this instance as it'll be deleted in favour of React 16 first class portal
    // implementation (see https://reactjs.org/docs/portals.html).
    // eslint-disable-next-line react/no-find-dom-node
    return this.props.target && findDOMNode(this);
  }

  getRenderTarget() {
    if (typeof this.props.renderTarget === 'function') {
      return this.props.renderTarget();
    }

    return document.body;
  }

  open() {
    if (this.portalElement) {
      return;
    }

    const doc: window = document;

    this.portalElement = doc.createElement('div');
    this.getRenderTarget().appendChild(this.portalElement);

    const passiveArgs = this.supportsPassiveEvents()
      ? { passive: true }
      : false;
    doc.addEventListener('touchstart', this.onDocumentMouseDown, passiveArgs);
    doc.addEventListener('touchmove', this.onDocumentMouseMove, passiveArgs);
    doc.addEventListener('touchend', this.onDocumentMouseUp, passiveArgs);
    doc.addEventListener('mousedown', this.onDocumentMouseDown, false);
    doc.addEventListener('mouseup', this.onDocumentMouseUp, false);
    doc.addEventListener('keydown', this.onDocumentKeyDown, false);

    if (this.props.style) {
      assign(this.portalElement.style, this.props.style);
    }

    if (this.props.className) {
      this.portalElement.className = this.props.className;
    }

    this.renderPortal(() => {
      this.props.onOpen(this.portalElement, this.getTargetElement());
    });
  }

  close() {
    if (!this.portalElement) {
      return;
    }

    unmountComponentAtNode(this.portalElement);

    const renderTarget = this.getRenderTarget();
    if (renderTarget) {
      renderTarget.removeChild(this.portalElement);
    }

    const doc: window = document;

    doc.removeEventListener('touchstart', this.onDocumentMouseDown);
    doc.removeEventListener('touchmove', this.onDocumentMouseMove);
    doc.removeEventListener('touchend', this.onDocumentMouseUp);
    doc.removeEventListener('mousedown', this.onDocumentMouseDown);
    doc.removeEventListener('mouseup', this.onDocumentMouseUp);
    doc.removeEventListener('keydown', this.onDocumentKeyDown);

    this.portalElement = null;
  }

  // This function is taken from modernizr
  // See https://github.com/modernizr/modernizr
  // eslint-disable-next-line class-methods-use-this
  supportsPassiveEvents() {
    let supportsPassiveOption = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        // eslint-disable-next-line getter-return
        get() {
          supportsPassiveOption = true;
        },
      });
      (window: window).addEventListener('test', null, opts);
    } catch (e) {
      return false;
    }
    return supportsPassiveOption;
  }

  renderPortal(cb: () => mixed = () => {}) {
    // If the `target` prop is null, it's fine that there is no targetElement
    // Otherwise, if a `target` is provided, we don't render if we cannot find the respective element
    const missesExpectedTarget = this.props.target && !this.getTargetElement();

    if (this.portalElement && !missesExpectedTarget) {
      unstable_renderSubtreeIntoContainer(
        this,
        this.props.children,
        this.portalElement,
        () => {
          if (this.props.isOpen) {
            this.props.onRender(this.portalElement, this.getTargetElement());
          }
          cb();
        },
      );
    } else {
      setImmediate(cb);
    }
  }

  render() {
    return typeof this.props.target === 'function' ? null : this.props.target;
  }
}

export default Portal;
