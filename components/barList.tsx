import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cx, focusRing } from '@/lib/utils';

interface Bar<T> {
  key?: string;
  href?: string;
  value: number;
  name: string;
}

interface BarListProps<T = unknown> extends React.HTMLAttributes<HTMLDivElement> {
  data: Bar<T>[];
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  onValueChange?: (payload: Bar<T>) => void;
  sortOrder?: 'ascending' | 'descending' | 'none';
}

const BarList = React.forwardRef(
  <T,>(
    {
      data = [],
      valueFormatter = (value) => value.toString(),
      showAnimation = false,
      onValueChange,
      sortOrder = 'descending',
      className,
      ...props
    }: BarListProps<T>,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const Component = onValueChange ? 'button' : 'div';
    const sortedData = React.useMemo(() => {
      if (sortOrder === 'none') {
        return data;
      }
      return [...data].sort((a, b) =>
        sortOrder === 'ascending' ? a.value - b.value : b.value - a.value
      );
    }, [data, sortOrder]);

    const widths = React.useMemo(() => {
      const maxValue = Math.max(...sortedData.map((item) => item.value), 0);
      return sortedData.map((item) =>
        item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2)
      );
    }, [sortedData]);

    const rowHeight = 'h-12';

    return (
      <Card className={cx('w-full', className)}>
        <CardHeader>
          <CardTitle>Pages Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={forwardedRef}
            className={cx('flex justify-between space-x-6')}
            aria-sort={sortOrder}
            tremor-id="tremor-raw"
            {...props}
          >
            <div className="relative w-full space-y-2">
              {sortedData.map((item, index) => (
                <Tooltip key={item.key ?? item.name}>
                  <TooltipTrigger asChild>
                    <Component
                      onClick={() => {
                        onValueChange?.(item);
                      }}
                      className={cx(
                        // base
                        'group w-full rounded',
                        // focus
                        focusRing,
                        onValueChange
                          ? [
                              '!-m-0 cursor-pointer',
                              // hover
                              'hover:bg-gray-50 hover:dark:bg-gray-900',
                            ]
                          : ''
                      )}
                    >
                      <div
                        className={cx(
                          // base
                          'flex items-center rounded transition-all',
                          rowHeight,
                          // background color
                          'bg-blue-200 dark:bg-blue-800',
                          onValueChange
                            ? 'group-hover:bg-blue-300 group-hover:dark:bg-blue-700'
                            : '',
                          // margin and duration
                          {
                            'mb-0': index === sortedData.length - 1,
                            'duration-800': showAnimation,
                          }
                        )}
                        style={{ width: `${widths[index]}%` }}
                      >
                        <div className={cx('absolute left-2 flex max-w-full pr-2')}>
                          {item.href ? (
                            <a
                              href={item.href}
                              className={cx(
                                // base
                                'truncate whitespace-nowrap rounded text-sm',
                                // text color
                                'text-gray-900 dark:text-gray-50',
                                // hover
                                'hover:underline hover:underline-offset-2',
                                // focus
                                focusRing
                              )}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {item.name}
                            </a>
                          ) : (
                            <p
                              className={cx(
                                // base
                                'truncate whitespace-nowrap text-sm',
                                // text color
                                'text-gray-900 dark:text-gray-50'
                              )}
                            >
                              {item.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </Component>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span>{valueFormatter(item.value)}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <div>
              {sortedData.map((item, index) => (
                <div
                  key={item.key ?? item.name}
                  className={cx(
                    'flex items-center justify-end',
                    rowHeight,
                    index === sortedData.length - 1 ? 'mb-0' : 'mb-2'
                  )}
                >
                  <p
                    className={cx(
                      // base
                      'truncate whitespace-nowrap text-sm leading-none',
                      // text color
                      'text-gray-900 dark:text-gray-50'
                    )}
                  >
                    {valueFormatter(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

BarList.displayName = 'BarList';

export { BarList, type BarListProps };