"use strict";

const fs = require("fs");
const express = require("express");
const app = express();
const port = 4000;

/**
 * Calculates the distance of two points.
 * We just need a number not a real distance, so we are don't calculating the sqrt of points.
 *
 * @param p1
 * @param p2
 * @returns {number}
 */
const calculatePointsDistance = (p1, p2) => {
    return (p2.latitude - p1.latitude)**2 + (p2.longitude - p1.longitude)**2
}

/**
 * Calculating points total distance with given route
 *
 * @param points
 * @param route
 * @returns {number}
 */
const calculateRouteDistance = (points, route) => {
    let len = 0
    for(let i = 0; i < route.length-1; i++) {
        len += calculatePointsDistance(points[route[i]], points[route[i+1]])
    }
    return len
}

/**
 * Calculating shortest route on given points
 *
 * @param points
 * @returns {array}
 */
const calculateBestRoute = (points) => {
    // initialized route with points following sequentially
    let route = points.map((_, i)=> i)
    let hasNewRoute = true
    let routeLength = Number.MAX_VALUE
    let newRoute = null
    let tmpLength = -1
    while(hasNewRoute) {
        hasNewRoute = false
        for(let i = 1; i < points.length; i++) {
            for(let j = i+1; j < points.length+1; j++) {
                newRoute = [route[0], ...route.slice(1, i) , ...route.slice(i, j).reverse() , ...route.slice(j)]
                tmpLength = calculateRouteDistance(points, newRoute)
                if(routeLength > tmpLength) {
                    routeLength = tmpLength
                    route = newRoute
                    hasNewRoute = true
                }
            }
        }
    }

    return route.map(r => points[r])
}

app.get("/", (req, res) => {
    const raw = fs.readFileSync("./data.json");
    const data = JSON.parse(raw);
    const route = calculateBestRoute(data)
    res.json(route)
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});