"use client";

import { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default function PieChart() {
    useEffect(() => {
        am4core.useTheme(am4themes_animated);

        const chart = am4core.create("chartdiv2", am4charts.PieChart);
        chart.logo.disabled = true;
        chart.rtl = false;
        chart.innerRadius = am4core.percent(30);


        const pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "label";
        pieSeries.alignLabels = false;

        pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        pieSeries.ticks.template.disabled = true;

        pieSeries.slices.template.stroke = am4core.color("#ffffff");
        pieSeries.slices.template.strokeWidth = 2;

        pieSeries.slices.template.adapter.add("fill", (fill, target) => {
            const colors = ["#2f55a4", "#2f8a5b"];
            return colors[target.dataItem.index % colors.length];
        });

        const shadow = pieSeries.slices.template.filters.push(
            new am4core.DropShadowFilter()
        );
        shadow.opacity = 0;

        const hoverState = pieSeries.slices.template.states.getKey("hover");
        const hoverShadow = hoverState.filters.push(
            new am4core.DropShadowFilter()
        );
        hoverShadow.opacity = 0.7;
        hoverShadow.blur = 5;


        chart.legend = new am4charts.Legend();

        chart.legend.labels.template.fill = am4core.color(getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#171717");
        chart.legend.valueLabels.template.fill = am4core.color(getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#171717");
        pieSeries.labels.template.fill = am4core.color(getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#171717");


        chart.data = [
            { label: "Successful Payments", value: 501.9 },
            { label: "Failed Payments", value: 165.8 },
        ];


        return () => {
            chart.dispose();
        };
    }, []);

    return <div id="chartdiv2" style={{ height: 400 }} />;
}
