/**
 * VirtualList.tsx - Virtual Scrolling Component for Large Lists
 *
 * High-performance virtual scrolling component that only renders visible items
 * Prevents performance issues when rendering thousands of items
 *
 * Features:
 * - Only renders visible items + overscan
 * - Automatic height calculation
 * - Smooth scrolling integration
 * - Memory efficient
 * - Works with dynamic item heights
 */

import { useRef, useEffect, useState, ReactNode, CSSProperties } from 'react';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemHeight?: number | ((index: number) => number);
  overscan?: number;
  className?: string;
  containerStyle?: CSSProperties;
  gap?: number;
}

function VirtualList<T>({
  items,
  renderItem,
  itemHeight = 100,
  overscan = 5,
  className = '',
  containerStyle = {},
  gap = 0,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate item height
  const getItemHeight = (index: number): number => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
  };

  // Calculate visible range
  const calculateVisibleRange = () => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / (getItemHeight(0) + gap)) - overscan
    );

    const visibleItemCount = Math.ceil(containerHeight / (getItemHeight(0) + gap));
    const endIndex = Math.min(
      items.length - 1,
      startIndex + visibleItemCount + overscan * 2
    );

    return { startIndex, endIndex };
  };

  const { startIndex, endIndex } = calculateVisibleRange();

  // Calculate total height
  const totalHeight = items.reduce((acc, _, index) => {
    return acc + getItemHeight(index) + gap;
  }, 0);

  // Calculate offset for first visible item
  const getOffsetForIndex = (index: number): number => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i) + gap;
    }
    return offset;
  };

  const offsetY = getOffsetForIndex(startIndex);

  // Handle scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    const handleResize = () => {
      setContainerHeight(container.clientHeight);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial measurement
    setContainerHeight(container.clientHeight);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render visible items
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    if (items[i]) {
      visibleItems.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${getOffsetForIndex(i)}px)`,
          }}
        >
          {renderItem(items[i], i)}
        </div>
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className={`virtual-list-container ${className}`}
      style={{
        position: 'relative',
        height: '100%',
        overflow: 'auto',
        ...containerStyle,
      }}
    >
      <div
        className="virtual-list-spacer"
        style={{
          position: 'relative',
          height: `${totalHeight}px`,
          width: '100%',
        }}
      >
        {visibleItems}
      </div>
    </div>
  );
}

export default VirtualList;
