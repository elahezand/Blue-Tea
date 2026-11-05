"use client";

import { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default function ParetoChart() {
    useEffect(() => {
        am4core.useTheme(am4themes_animated);

        const chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.logo.disabled = true;
        chart.scrollbarX = new am4core.Scrollbar();

        chart.data = [
            { month: "January", visits: 3025 },
            { month: "February", visits: 1882 },
            { month: "March", visits: 1809 },
            { month: "April", visits: 1322 },
            { month: "May", visits: 1122 },
            { month: "June", visits: 1114 },
            { month: "July", visits: 984 },
            { month: "August", visits: 711 },
        ];

        const total = chart.data.reduce((sum, item) => sum + item.visits, 0);
        let sumVisits = 0;
        chart.data.forEach((item) => {
            sumVisits += item.visits;
            item.pareto = (sumVisits / total) * 100;
        });

        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "month";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 60;
        categoryAxis.tooltip.disabled = true;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;

        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "month";
        series.columns.template.cornerRadiusTopLeft = 10;
        series.columns.template.cornerRadiusTopRight = 10;
        series.columns.template.fillOpacity = 0.8;
        series.tooltipText = "[{categoryX}: bold]{valueY}[/]";

        const colors = ["#2f55a4", "#2f8a5b", "#9cc0ff"];
        series.columns.template.adapter.add("fill", (fill, target) =>
            colors[target.dataItem.index % colors.length]
        );

        const hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.fillOpacity = 1;
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;

        const paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        paretoValueAxis.renderer.opposite = true;
        paretoValueAxis.min = 0;
        paretoValueAxis.max = 100;
        paretoValueAxis.strictMinMax = true;
        paretoValueAxis.renderer.grid.template.disabled = true;
        paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
        paretoValueAxis.numberFormatter.numberFormat = "#'%'";
        paretoValueAxis.cursorTooltipEnabled = false;

        const paretoSeries = chart.series.push(new am4charts.LineSeries());
        paretoSeries.dataFields.valueY = "pareto";
        paretoSeries.dataFields.categoryX = "month";
        paretoSeries.yAxis = paretoValueAxis;
        paretoSeries.strokeWidth = 2;
        paretoSeries.strokeOpacity = 0.5;

        paretoSeries.stroke = am4core.color(getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#171717");
        paretoSeries.bullets.push(new am4charts.CircleBullet());

        paretoSeries.bullets.template.fill = am4core.color("#2f55a4");
        paretoSeries.tooltipText = "Percentage: {valueY.formatNumber('#.0')}%";

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "panX";

        categoryAxis.renderer.labels.template.fill = am4core.color(getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#171717");
        valueAxis.renderer.labels.template.fill = am4core.color(getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#171717");
        paretoValueAxis.renderer.labels.template.fill = am4core.color(getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#171717");

        return () => {
            chart.dispose();
        };
    }, []);

    return <div id="chartdiv"
        style={{ height: 500, border: "var(--border)" }} />;
}
