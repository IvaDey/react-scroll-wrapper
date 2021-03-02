import React from 'react';
import PropTypes from 'prop-types';

class InfiniteScroll extends React.Component {
  constructor() {
    super();

    this.scrollWrapperRef = React.createRef();
    this.prevScroll = 0;
  }

  componentDidMount() {
    const { position } = this.props;

    if (position) {
      this.setScrollPosition(position);
    }
  }

  componentDidUpdate(prevProps) {
    const { position } = this.props;

    if (position !== prevProps.position) {
      this.setScrollPosition(position);
    }
  }

  handleHorizontalScroll() {
    const { scrollLeft, scrollWidth, offsetWidth } = this.scrollWrapperRef.current;
    const { onReachRight, onReachLeft, horizontalInfiniteDistance } = this.props;

    const leftEdge = 0;
    const rightEdge = scrollWidth;
    const scrolledLeft = scrollLeft;
    const scrolledRight = scrolledLeft + offsetWidth;

    if (scrolledRight >= rightEdge - horizontalInfiniteDistance) {
      onReachRight(scrolledLeft);
    } else if (scrolledLeft <= leftEdge + horizontalInfiniteDistance) {
      onReachLeft(scrolledLeft);
    }
  }

  handleVerticalScroll() {
    const { scrollTop, scrollHeight, offsetHeight } = this.scrollWrapperRef.current;

    const { onReachTop, onReachBottom, verticalInfiniteDistance } = this.props;

    const topEdge = 0;
    const bottomEdge = scrollHeight;
    const scrolledUp = scrollTop;
    const scrolledDown = scrolledUp + offsetHeight;

    if (scrolledDown >= bottomEdge - verticalInfiniteDistance) {
      onReachBottom();
    } else if (scrolledUp <= topEdge + verticalInfiniteDistance) {
      onReachTop();
    }
  }

  handleScroll() {
    const { horizontal, onScroll } = this.props;

    let scrolledTo;

    if (horizontal) {
      this.handleHorizontalScroll();
      scrolledTo = this.scrollWrapperRef.current.scrollLeft;
    } else {
      this.handleVerticalScroll();
      scrolledTo = this.scrollWrapperRef.current.scrollTop;
    }

    if (scrolledTo === this.prevScroll) return;

    onScroll(scrolledTo, this.prevScroll);
    this.prevScroll = scrolledTo;
  }

  setScrollPosition(position = 0) {
    if (position === this.prevScroll) return;

    if (this.props.horizontal) {
      this.scrollWrapperRef.current.scrollLeft = position;
    } else {
      this.scrollWrapperRef.current.scrollTop = position;
    }

    this.prevScroll = position;
  }

  render() {
    const { children, horizontal } = this.props;
    const style = {
      overflow: 'auto',
      height: 'inherit',
      width: 'inherit',
      WebkitOverflowScrolling: 'inherit',
      whiteSpace: horizontal ? 'nowrap' : 'normal',
      position: 'relative',
    };

    return (
      <div
        ref={this.scrollWrapperRef}
        style={style}
        onScroll={this.handleScroll.bind(this)}
      >
        {children}
      </div>
    );
  }
}

InfiniteScroll.propTypes = {
  children: PropTypes.node.isRequired,
  horizontal: PropTypes.bool,
  onReachBottom: PropTypes.func,
  onReachTop: PropTypes.func,
  onReachLeft: PropTypes.func,
  onReachRight: PropTypes.func,
  onScroll: PropTypes.func,
  position: PropTypes.number,
  horizontalInfiniteDistance: PropTypes.number,
  verticalInfiniteDistance: PropTypes.number,
};
InfiniteScroll.defaultProps = {
  horizontal: false,
  onReachBottom: (f) => f,
  onReachTop: (f) => f,
  onReachLeft: (f) => f,
  onReachRight: (f) => f,
  onScroll: (f) => f,
  position: 0,
  horizontalInfiniteDistance: 0,
  verticalInfiniteDistance: 0,
};

export default InfiniteScroll;
