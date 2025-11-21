function getRandomItems(array, count) {
  if (count > array.length) {
    throw new Error("Count cannot be greater than the array length.");
  }

  const shuffledArray = array.slice().sort(() => 0.5 - Math.random());
  return shuffledArray.slice(0, count);
}

function getRandomServices ()
{
    var depArray = ["1", "2", "3", "4", "5", "6" , "7", "8", "9", "10", "11", "12",  "13", "14", "15"];
    var randomItems = getRandomItems(depArray, 5);

    //clear default value  
    api.fn.answers({selected_services1: 0});
    api.fn.answers({selected_services2: 0});
    api.fn.answers({selected_services3: 0});
    api.fn.answers({selected_services4: 0});
    api.fn.answers({selected_services5: 0});
    api.fn.answers({selected_services6: 0});
    api.fn.answers({selected_services7: 0});
    api.fn.answers({selected_services8: 0});
    api.fn.answers({selected_services9: 0});
    api.fn.answers({selected_services10: 0});
    api.fn.answers({selected_services11: 0});
    api.fn.answers({selected_services12: 0});
    api.fn.answers({selected_services13: 0});
    api.fn.answers({selected_services14: 0});
    api.fn.answers({selected_services15: 0});


    //turn on flag for selected items
    for (i=0; i<randomItems.length; i++)
    {
      var flag_id = randomItems[i];
      switch(flag_id) {
        case "1":
          api.fn.answers({selected_services1:  1});  
          break;
        case "2":
          api.fn.answers({selected_services2:  1});  
          break;
        case "3":
          api.fn.answers({selected_services3:  1});  
          break;
        case "4":
          api.fn.answers({selected_services4:  1});  
          break;
        case "5":
          api.fn.answers({selected_services5:  1});  
          break;
        case "6":
          api.fn.answers({selected_services6:  1});  
          break;
        case "7":
          api.fn.answers({selected_services7:  1});  
          break;
        case "8":
          api.fn.answers({selected_services8:  1});  
          break;

        case "9":
          api.fn.answers({selected_services9:  1});  
          break;
        case "10":
          api.fn.answers({selected_services10:  1});  
          break;
        case "11":
          api.fn.answers({selected_services11:  1});  
          break;
        case "12":
          api.fn.answers({selected_services12:  1});  
          break;
        case "13":
          api.fn.answers({selected_services13:  1});  
          break;
        case "14":
          api.fn.answers({selected_services14:  1});  
          break;
        case "15":
          api.fn.answers({selected_services15:  1});  
          break;


        default:
          break;
      }
      //console.log("random", flag_id); 
    }
    
  } 
