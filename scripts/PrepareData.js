var quota_data;
var interview_data;
var today_flight_list;
var this_month_flight_list;
var daily_plan_data;
var removed_ids_data;

var currentMonth;
var currentDate;
var nextDate;
var download_time;

var total_quota = 17000;
var total_completed;

var total_quota_completed;
var total_hard_quota;


/************************************/
function initCurrentTimeVars() {
  var d = new Date();
      
  var month = '' + (d.getMonth() + 1); //month start from 0;
  
  var day = '' + d.getDate();
  var year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  currentMonth =[month,year].join('-')
  currentDate = [day, month,year].join('-');
  
  //next day
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  var tomorrowMonth = '' + (tomorrow.getMonth() + 1); //month start from 0;
  var tomorrowDay = '' + tomorrow.getDate();
  var tomorrowYear = tomorrow.getFullYear();

  if (tomorrowMonth.length < 2) 
  tomorrowMonth = '0' + tomorrowMonth;
  if (tomorrowDay.length < 2) 
  tomorrowDay = '0' + tomorrowDay;
  nextDate  = [tomorrowDay, tomorrowMonth, tomorrowYear].join('-');

  //return [day, month,year].join('-');
}

function isCurrentMonth(interviewEndDate)
{
// Input: "1\/10\/2023 7:21:16 PM"
  var interviewDateParsed = interviewEndDate.split("/")
  var interviewMonth = interviewDateParsed[0];
  var interviewYear = interviewDateParsed[2].substring(0,4);
  var result = false;

  var d = new Date();
  month = '' + (d.getMonth() + 1); //month start from 0; 
  year = d.getFullYear();
  
  if ((month == interviewMonth) && (year==interviewYear))
  {
    result = true;
  }

  return result;
}

function notDeparted(flight_time) {
  var current_time = new Date().toLocaleString('be-BE', { timeZone: 'Europe/Brussels', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;

  var result = (flight_time_value > current_time_value);
  return (result);
}

function isvalid_id(id)
{
  valid = true;

  var i = 0;
  for (i = 0; i < removed_ids_data.length; i++) 
  { 
    if (removed_ids_data[i].removed_id == id)
    {
      valid = false;
    }
  }
  return valid;
}
function prepareInterviewData() {
  quota_data = JSON.parse(Flight_To_Quota);
  removed_ids_data = JSON.parse(removed_ids);

  var interview_data_temp  = JSON.parse(interview_data_raw);
  var flight_list_temp  = JSON.parse(BRU_FlightRawList);

  initCurrentTimeVars();	

  //get relevant interview data
  //empty the list
  interview_data = [];
  interview_data.length = 0;

  download_time = interview_data_temp.download_time;
  for (i = 0; i < interview_data_temp.rows.length; i++) {
    var interview = interview_data_temp.rows[i];
    //only get complete interview & not test
    if ((interview.InterviewState == "Completed")
      && (isCurrentMonth(interview.InterviewEndDate))
      )
    {
 
      if (interview["custom.Q4_destination"] &&  interview["custom.Q4_flight_number"]) {
        var Flight_To = '"Flight_To"' + ":" + '"' +  interview["custom.Q4_flight_number"] + "-" + interview["custom.Q4_destination"] + '", ';
        var InterviewEndDate = '"InterviewEndDate"' + ":" + '"' +  interview["InterviewEndDate"] ;
        var str = '{' + Flight_To + InterviewEndDate + '"}';

        if (isvalid_id(interview["InterviewId"])) //check if valid
        {
          interview_data.push(JSON.parse(str));
        }
        else
        {
          console.log("invalid id: ", interview);
        }
      }
      else{
        console.log("ignored interview: ", interview);
      }
    }
  }

  //prepare flight list
  //empty the list
  today_flight_list = [];
  today_flight_list.length = 0;
  
  this_month_flight_list  = [];
  this_month_flight_list.length = 0;
  
  for (i = 0; i < flight_list_temp.length; i++) {
    let flight = flight_list_temp[i];

    flight.Flight_To = flight.Flight + "-" + flight.Dest;//code for compare
	  flight.Dest = flight.Dest + "-" + flight.DestName;//code for compare
    flight.Next = flight.Next + "-" + flight.NextName;//code for compare

    //currentMonth: 02-2023
    //flight.Date: 08-02-2023
    if (currentMonth == flight.Date.substring(3,10)) { 
      this_month_flight_list.push(flight);
    }	

    //only get today & not departed flight
    if (((currentDate == flight.Date) && notDeparted(flight.Time))
        || (nextDate == flight.Date))
    { 
      flight.Date_Time = flight.Date + " " + flight.Time;

      flight.nextDay = 0; //display two date infor as requester by Didi
      if (nextDate == flight.Date) {
        flight.nextDay = 1;
      }
      today_flight_list.push(flight);
    }
			   
  }

    //add quota data
    //empty the list
  daily_plan_data = [];
  daily_plan_data.length = 0;
  
  for (i = 0; i < today_flight_list.length; i++) {
    let flight = today_flight_list[i];
    for (j = 0; j < quota_data.length; j++) {
      let quota = quota_data[j];
      if ((quota.Flight_To == flight.Flight_To) && (quota.Quota>0))
      {
        flight.Quota = quota.Quota;
        daily_plan_data.push(flight);
       }
    }
  }
}
