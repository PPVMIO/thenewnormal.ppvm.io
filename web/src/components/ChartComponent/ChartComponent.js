import React from 'react';
import { ResponsiveLine } from '@nivo/line'

class ChartComponent extends React.Component{

  constructor(props) {
    super(props);
    console.log(props.data)
    this.state = {
      data: props.data
    }
  }

  responsiveLineStyle =  {
    color: 'white'
  }

  theme = {
    axis: {
      ticks: {
        text: {
          fill: '#ffffff'
        }
      }
    },
  };

  render() {
     return <ResponsiveLine
        data={this.state.data}
        margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
        yScale={{ type: 'log', base: 10, max: 1000000 }}
        axisLeft={{ tickValues: [10, 100, 1000, 10000, 100000], tickSize: 2, symbolSize: 18 }}
        axisBottom={{ tickValues: ['3/8/20', '3/22/20', '4/5/20', '4/19/20'], tickSize: 2, symbolSize: 18 }}
        colors={{ scheme: 'greys' }}
        theme={this.theme}
        pointSize={1}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={3}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel='y'
        pointLabelYOffset={-12}
        useMesh={true}
        lineWidth={2}
        enableArea={false}
        gridYValues={[10, 100, 1000, 10000, 100000]}
        enableGridX={false}
        areaBaselineValue={1}
        legends={[
          {
              curve: 'natural',
              anchor: 'top-right',
              color: 'white',
              direction: 'column',
              justify: false,
              translateX: 70,
              translateY: -10,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemTextColor: 'white',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, 1)',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                      }
                  }
              ]
          }
      ]}
      />
  }
}

export default ChartComponent;
