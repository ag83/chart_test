import React, { Fragment, FC, memo } from 'react';
import * as d3 from 'd3';
import { addDays, format, differenceInDays, startOfDay } from 'date-fns';

import './stock-chart.scss';

import { Stock, StockData } from '@test/shared';

interface StockChartProps {
  stock: Stock;
  stockData: StockData[];
}

const chartConfig = {
  width: 800,
  height: 400,
  margin: { top: 60, right: 20, bottom: 70, left: 70 },
  barPadding: 0.1,
  colors: {
    labelColor: '#6f6f6f',
    firstColor: '#d9d9d9',
    secondColor: '#a3a3a3',
    thirdColor: '#f0f0f0'
  },
  patterns: {
    firstPattern: 'first',
    secondPattern: 'second',
    thirdPattern: 'third'
  }
}

const StockChart: FC<StockChartProps> = ({ stock, stockData }) => {

  if (stockData.length === 0) {
    return <div>No data</div>
  }

  const chartlegendConfig = [
    {
      name: 'Actual Stocks',
      fill: chartConfig.colors.firstColor
    },
    {
      name: 'Projected Stocks',
      fill: `url(#${chartConfig.patterns.secondPattern})`
    },
    {
      name: 'Demand',
      fill: 'url(#linePattern)'
    }
  ];

  const maxAmount = Math.max(...stockData.map((item) => item.amount));

  const today = new Date();

  const formatDay = (dataPoint: StockData) => format(new Date(dataPoint.date), 'EEE');

  const getBarColour = (dataPoint: StockData) => {
    const daysDifference = differenceInDays(new Date(dataPoint.date), startOfDay(today));
    if (daysDifference === 0) return `url(#${chartConfig.patterns.firstPattern})`;
    if (daysDifference < 0) return chartConfig.colors.firstColor;
    if (daysDifference > 0 && daysDifference <= 3) return `url(#${chartConfig.patterns.secondPattern})`;
    return `url(#${chartConfig.patterns.thirdPattern})`;
  }
  
  const getYAxis = (ref: SVGGElement): void => {
    const yAxis = d3.axisLeft(getY)
      .ticks(Math.ceil(maxAmount / 10 ))
      .tickPadding(10)
      .tickSize(-chartConfig.width);
    d3.select(ref).call(yAxis);
  };
  
  const getXAxis = (ref: SVGGElement) => {
    const xAxis = d3.axisBottom(getX)
      .ticks(stockData.length)
      .tickFormat((item, index) => {
        const dataPoint = stockData[index];
        return formatDay(dataPoint)
      })
      .tickPadding(10)
      .tickSize(0);
    d3.select(ref).call(xAxis);
  };

  const getY = d3.scaleLinear()
    .domain([0, Math.ceil(maxAmount/10)*10])
    .range([chartConfig.height, 0]);

  const getX = d3.scaleBand()
    .domain(stockData.map(item => item.date))
    .range([0, chartConfig.width])
    .padding(chartConfig.barPadding);
  
  const todayIndex = stockData.findIndex(item => item.date === format(today, 'MM/dd/yyyy'));
  const pastDays = stockData.slice(0, todayIndex + 1);
  const artificialDataPoint = {...stockData[stockData.length - 1]};
  artificialDataPoint.date = format(addDays(new Date(artificialDataPoint.date), 1), 'MM/dd/yyyy');
  const futureDays = [...stockData.slice(todayIndex), artificialDataPoint];

  const demandLinePathActual = d3
    .line<StockData>()
    .x(item => getX(item.date) || 0 )
    .y(item => getY(item.demand))
    .curve(d3.curveStepAfter)(pastDays);

  const demandLinePathProjected = d3
    .line<StockData>()
    .x(item => {
      if (item.date === futureDays[futureDays.length -1].date) {
        return (getX(futureDays[futureDays.length - 2].date) || 0) + getX.bandwidth();
      }
      return getX(item.date) || 0;
    })
    .y(item => getY(item.demand))
    .curve(d3.curveStepAfter)(futureDays);

    const getCurrentDayLabel = () => {
      return format(today, 'MMM do, yyyy')
    }


  return (
    <div className='stock-chart-wrapper'>
      <div className='stock-chart-header'>
        <h3>Stock Level</h3>
      </div>
      <svg 
        width={chartConfig.width  + chartConfig.margin.left + chartConfig.margin.right} 
        height={chartConfig.height  + chartConfig.margin.top + chartConfig.margin.bottom} >
          {
            chartlegendConfig.map((config, index) => (
              <Fragment key={config.name}>
                <rect
                  x={chartConfig.width * 0.4 + index * 200 }
                  y={0}
                  width={30}
                  height={30}
                  fill={config.fill}
                />
                <text
                  x={chartConfig.width * 0.4 + index * 200  + 30 + 10}
                  y={20}
                >{config.name}</text>
              </Fragment>
            ))
          }

        <g transform={`translate(${chartConfig.margin.left}, ${chartConfig.margin.top})`}>
          <g 
            className="axis y-axis"
            ref={getYAxis} />
          <g
            className="axis x-axis"
            ref={getXAxis}
            transform={`translate(0,${getY(0)})`}
          />
          {stockData.map((item) => (
            <rect
              key={`bar-${item.date}`}
              x={getX(item.date)}
              y={getY(item.amount)}
              width={getX.bandwidth()}
              height={chartConfig.height - getY(item.amount)}
              fill={getBarColour(item)}
            />
          ))}
          <path
            transform={`translate(${-(getX.bandwidth() * 0.1) / 2}, 0)`}
            strokeWidth={2}
            fill="none"
            stroke="black"
            d={demandLinePathActual || ""}
          />
          <path
            transform={`translate(${-(getX.bandwidth() * 0.1) / 2}, 0)`}
            strokeWidth={2}
            fill="none"
            stroke="black"
            style={{ strokeDasharray: ('5, 5')}}
            d={demandLinePathProjected || ''}
          />
        </g>
        <text
          transform={`translate(${chartConfig.margin.right + (todayIndex + 1) * getX.bandwidth() + (todayIndex + 1) * chartConfig.barPadding * getX.bandwidth()},${getY(stockData[todayIndex].amount) + 20})`}
          className="label-small" 
        >
          <tspan x="0" dy="1.2em">Today</tspan>
          <tspan x="0" dy="1.2em">{getCurrentDayLabel()}</tspan>
        </text>
        <text
            className="chart-label" 
            fill={chartConfig.colors.labelColor}
            transform={`translate(${chartConfig.width / 2},${getY(0) + chartConfig.margin.bottom * 0.75 + chartConfig.margin.top})`}
        >Days</text>
        <text 
            className="chart-label label-uppercase" 
            fill={chartConfig.colors.labelColor}
            transform='rotate(-90)'
            y={0 + chartConfig.margin.left * 0.3 }
            x={0 - (chartConfig.height + chartConfig.margin.top + chartConfig.margin.bottom )/ 2 }
        >{stock.unit}</text>

        <pattern id={chartConfig.patterns.firstPattern} width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="0" style={{stroke: chartConfig.colors.secondColor, strokeWidth:14}} />
        </pattern>
        <pattern id={chartConfig.patterns.secondPattern} width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="0" style={{stroke: chartConfig.colors.firstColor, strokeWidth:14}} />
        </pattern>
        <pattern id={chartConfig.patterns.thirdPattern} width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="0" style={{stroke: chartConfig.colors.thirdColor, strokeWidth:14}} />
        </pattern>
        <pattern id='linePattern' width="30" height="30" patternUnits="userSpaceOnUse">
          <line x1="0" y1="15" x2="30" y2="15" style={{stroke: 'black', strokeWidth:2}} />
        </pattern>
      </svg>
    </div>
  )
};

export default memo(StockChart);