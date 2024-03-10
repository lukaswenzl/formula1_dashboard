import { Card, } from '@tremor/react';


export function TopThreeCard({laps, drivers, key_metric, unit, title, bigger = "False"}) {

    let sort_func = (a,b) => a[key_metric] - b[key_metric]
    if (bigger === "True") {
        sort_func = (a,b) => b[key_metric] - a[key_metric]
    }

return (
    <Card className="mx-auto max-w-sm">
      <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{title} </p>
      {laps.filter(a => a[key_metric] >0.).sort(sort_func).slice(0,3).map((lap, index) => (<p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">
      {index+1}. {drivers[lap["driver_number"]]} - {lap[key_metric]}{unit} </p>))}
    </Card>
    );

}