import React, { Component, FC, ReactElement, useMemo } from 'react';
import classNames from 'classnames';
import type { PieArcDatum } from 'd3-shape';
import { pie } from 'd3-shape';
import memoize from 'memoize-one';
import { CloneElement } from 'rdk';
import {
  ChartProps,
  ChartContainer,
  ChartContainerChildProps
} from '../common/containers/ChartContainer';
import type { ChartShallowDataShape } from '../common/data';
import { PieArcProps, PieArcSeries, PieArcSeriesProps } from './PieArcSeries';

export type ArcData = PieArcDatum<ChartShallowDataShape>;

export interface PieChartProps extends ChartProps {
  /**
   * Data the chart will receive to render.
   */
  data: ChartShallowDataShape[];

  /**
   * Whether the chart is disabled.
   */
  disabled?: boolean;

  /**
   * Whether to display labels even if their value has a small display radius.
   */
  displayAllLabels?: boolean;

  /**
   * The series component that renders the arc components.
   */
  series: ReactElement<PieArcSeriesProps, typeof PieArcSeries>;
}

// export const PieChart: FC<PieChartProps> = ({
//   id,
//   width,
//   height,
//   className,
//   disabled= false,
//   displayAllLabels= false,
//   data = [],
//   margins= 10,
//   series= <PieArcSeries/>
// }) => {
//
//   const explode = series.props.explode;
//
//   const pieGenerator = useMemo(() => {
//
//     const pieLayout = pie<void,ChartShallowDataShape>();
//     pieLayout.value((d: ChartShallowDataShape) => Number(d.data));
//
//     // Explode sort doesn't work right...
//     if (!explode) {
//       pieLayout.sort(null);
//     }
//
//     return pieLayout(data);
//
//   },[data, explode]);
//
//   const chartData = pieGenerator()
//
//   return (
//     <ChartContainer
//       id={id}
//       width={width}
//       height={height}
//       margins={margins}
//       xAxisVisible={false}
//       yAxisVisible={false}
//       center={true}
//       className={classNames(className)}
//     >
//       {(props) => this.renderChart(props)}
//     </ChartContainer>
//   );
// };

export class PieChart extends Component<PieChartProps> {
  static defaultProps: PieChartProps = {
    disabled: false,
    displayAllLabels: false,
    data: [],
    margins: 10,
    series: <PieArcSeries />
  };

  getData = memoize(
    (data: ChartShallowDataShape[], explode: boolean): ArcData[] => {
      const pieLayout = pie<
        void,
        ChartShallowDataShape
      >().value((d: ChartShallowDataShape) => Number(d.data));

      // Explode sort doesn't work right...
      if (!explode) {
        pieLayout.sort(null);
      }

      return pieLayout(data);
    }
  );

  renderChart(containerProps: ChartContainerChildProps) {
    const { chartWidth, chartHeight } = containerProps;
    const { series, displayAllLabels } = this.props;
    const data = this.getData(this.props.data, this.props.series.props.explode);

    return (
      <CloneElement<PieArcSeriesProps>
        element={series}
        data={data}
        height={chartHeight}
        width={chartWidth}
        displayAllLabels={displayAllLabels}
      />
    );
  }

  render() {
    const { id, width, height, margins, className } = this.props;

    return (
      <ChartContainer
        id={id}
        width={width}
        height={height}
        margins={margins}
        xAxisVisible={false}
        yAxisVisible={false}
        center={true}
        className={classNames(className)}
      >
        {(props) => this.renderChart(props)}
      </ChartContainer>
    );
  }
}
