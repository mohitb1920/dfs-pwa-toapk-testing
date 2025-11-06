import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
function MandiPriceGraphHigh({ data }) {
  const options = {
    title: {
      text: null,
    },
    series: [
      {
        data: data.map((item) => item.price),
        color: "black",
        showInLegend: false,
        name: "Price",
      },
    ],
    chart: {
      height: 300,
      width: 1000,
    },
    xAxis: {
      categories: data.map((item) => item.day),
      gridLineWidth: 1,
    },
    yAxis: {
      gridLineWidth: 1,
    },
    credits: {
      enabled: false,
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default MandiPriceGraphHigh;
