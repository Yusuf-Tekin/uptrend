import DateDiff from "date-diff";



export default function dateDiff(date:string):string {

    const date1 = new Date();
    const date2 = new Date(date);

    const diff = new DateDiff(date1,date2);

    const second = diff.seconds();
    const minute = diff.minutes();
    const hour = diff.hours();
    const day = diff.days();
    const week = diff.weeks();
    const month = diff.months();
    const year = diff.years();


    let dateDiffResult = "Just Now"

    if(second > 59) {
        dateDiffResult = parseInt(minute+"") + " minute ago"
    }
    if(minute > 59) {
        dateDiffResult = parseInt(hour+"") + " hour ago"
    }
    if(hour > 24) {
        dateDiffResult = parseInt(day+"") + " day ago"
    }
    if(day > 7) {
        dateDiffResult = parseInt(week+"") + " week"
    }
    if(week > 4) {
        dateDiffResult = parseInt(month+"") + " month"
    }
    if(month > 12) {
        dateDiffResult = parseInt(year+"") + " year"
    }



    return dateDiffResult;
}