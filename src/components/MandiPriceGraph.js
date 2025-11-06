import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CustomizedTick = (props) => {
  const { x, y, payload, isDarkTheme} = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={0}
        dx={0}
        textAnchor="end"
        fill={isDarkTheme ? "#fff" : "#79827D"}
        fontSize="14px"
      >
        &#8377;{`${payload.value}`}
      </text>
    </g>
  );
};

function MandiPriceGraph({ data }) {
  const prices = data.map((item) => item?.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const isMobile = useMediaQuery("(max-width:640px)");
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const tooltipFormatter = (value) => [
    <p className="price-trend-custom-tooltip-text">
      &#8377;{value}/{t("PRICE_QUINTOL")}
    </p>, 
    null,
  ];

  if (data && data?.length === 0) {
    return (
      <Box className="flex items-center justify-center h-[300px]">
        <Typography variant="primary">{t("MANDI_NO_MARKET_DATA")}</Typography>
      </Box>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="1%"
              stopColor="rgb(26, 92, 75, 0.7)"
              stopOpacity={1}
            />
            <stop offset="99%" stopColor="#D0F19E99" stopOpacity={1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={"date"}
          padding={isMobile ? { left: 10, right: 10 } : { left: 70, right: 70 }}
          tickLine={false}
          stroke={isDarkTheme ? "#fff" : "#79827D"}
        ></XAxis>
        <YAxis
          dataKey={"price"}
          domain={[minPrice, maxPrice]}
          type="number"
          padding={{ bottom: 30, top: 30 }}
          tickLine={false}
          tick={<CustomizedTick isDarkTheme={isDarkTheme}/>}
        ></YAxis>
        <CartesianGrid stroke="#85BC31" horizontalPoints={[0]} />
        <Tooltip
          formatter={tooltipFormatter}
          labelStyle={{ display: "none" }}
          contentStyle={{
            backgroundColor: "#1A5C4B",
            borderRadius: "4px",
            padding: "4px 12px",
          }}
        />
        <Area
          dataKey="price"
          stroke="#1A5C4B"
          fillOpacity={1}
          fill="url(#colorUv)"
          strokeWidth={3}
          dot={{ stroke: "#1A5C4B", strokeWidth: 3, fill: "#1A5C4B" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default MandiPriceGraph;
