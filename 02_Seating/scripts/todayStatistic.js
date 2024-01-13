var completed_by_interviewer_json;
function getToday() // 2023-04-07
{
  var today = new Date();
  var day = '' + today.getDate();
  var month = '' + (today.getMonth() + 1); //month start from 0;
  var year = today.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  
  return ([year, month, day].join('-'));
}

function loadData()
{
  var raw = JSON.parse(completed_by_interviewer);
  completed_by_interviewer_json = [];
  var today = getToday();
  download_time = raw[0].download_time;
  for (i = 0; i < raw.length; i++){
    let row = raw[i];
    //Interview_Date: 2023-04-07
    console.log("Interview_Date", row.Interview_Date );
    console.log("today", today);
    if ((row.Interview_Date == today)) {
      completed_by_interviewer_json.push(row);
    }
  }
}