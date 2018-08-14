module.exports = function(bot) {
  
  bot.setTask("defaultTask", {
    action: function(dialog, context, callback) {
      console.log('asdfasdfsafsdfsafsadf')
      callback();
    }
  });

  bot.setTask('saveMenuDate', {
    action: function(dialog, context, callback) {
      context.session.dateQuery = dialog.userInput.text;
      callback();
    }
  });
  bot.setTask('saveMenuStore', {
    action: function(dialog, context, callback) {
      context.session.storeQuery = dialog.userInput.text;
      callback();
    }
  });
  bot.setTask('searchMenu', {
    action: function(dialog, context, callback) {
      
      

          var request = require('request');
          var cheerio = require('cheerio');

          // Variables
          if (context.session.dateQuery === '오늘') {
            var requestDate = 'today';
          } else {
            var requestDate = 'tomorrow';
          };
          
          var searchQuery = context.session.storeQuery; // User input query preset

          //Stores id
          var storesDict = {
            "학생회관 식당": "NTUzMDI1",
            "대학원 기숙사 식당": "MjEzNTQ4MDI1",
            "전망대(3식당)": "NTczMjQ5",
            "자하연 식당": "NjEzNzIx",
            "학부 기숙사 식당": "NTkzNDgx",
            "동원생활관식당(113동)": "NjAzNjAw",
            "220동 식당": "Njc0NDg5",
            "아름드리(예술계식당)": "NjU0MjI1",
            "서당골(4식당)": "NjQ0MDk2",
            "감골식당": "NTYzMTM2",
            "제2공학관식당(302동)": "NTgzMzY0",
            "두레미담": "NjIzODQ0",
            "제1공학관식당(301동)": "NjMzOTY5",
            "공대간이식당": "NzA0OTAw",
            "수의대식당": "MjEzNjA5ODA5"
          };

          var storeTag = storesDict[searchQuery];


          //Functions
          function formatDate(todayOrTomorrow) {
            var d = new Date();
            var today = new Date(d.getTime() + 32400000); // Timezone offset
            var day = ("0" + today.getDate()).slice(-2);
            var dPlus2 = new Date(today.getTime() + 86400000);
            var tomorrow = ("0" + dPlus2.getDate()).slice(-2);
            var month = ("0" + (today.getMonth() + 1)).slice(-2);
            var year = today.getFullYear();
            if (todayOrTomorrow === 'today') {
              return year + '-' + month + '-' + day;
            } else if (todayOrTomorrow === 'tomorrow') {
              return year + '-' + month + '-' + tomorrow;
            } else {
              return year + '-' + month + '-' + day;
            };
          }

          function stringDate(todayOrTomorrow) {
            var d = new Date();
            var today = new Date(d.getTime() + 32400000);
            var day = ("0" + today.getDate()).slice(-2);
            var dPlus2 = new Date(today.getTime() + 86400000);
            var tomorrow = ("0" + dPlus2.getDate()).slice(-2);
            var month = ("0" + (today.getMonth() + 1)).slice(-2);
            var year = today.getFullYear();
            if (todayOrTomorrow === 'today') {
              return year + '년 ' + month + '월 ' + day + '일\n';
            } else if (todayOrTomorrow === 'tomorrow') {
              return year + '년 ' + month + '월 ' + tomorrow + '일\n';
            } else {
              return year + '년 ' + month + '월 ' + day + '일\n';
            };
          }

          function getMenuTime(num) {
            switch (num) {
              case 0:
                return '-아침-';
                break;
              case 1:
                return '--점심--';
                break;
              case 2:
                return '---저녁---';
                break;
              case 3:
                return '~종일~';
                break;
              case 4:
                return '기타';
                break;
              default:
                return '--점심--';
            }
          }

          function menuPresenter(menuList) {
            var menu_string = '';
            if (menuList.length > 1) {
              menuList.forEach(function(value) {
                if (!!value.name == true && !!value.description == true) {
                  // Case have both
                  var servingTime = getMenuTime(value.time);
                  var menuName = value.name;
                  var menuDescription = value.description;
                  if (!value.price) {
                    var menuPrice = '-';
                  } else {
                    var menuPrice = value.price;
                  };
                  menu_string = menu_string + servingTime + '\n' + menuName + ' (' + menuDescription + '): ' + menuPrice + '원\n';
                } else if (!!value.description == true && !!value.name == false) {
                  // Case only description
                  var servingTime = getMenuTime(value.time);
                  var menuDescription = value.description;
                  if (!value.price) {
                    var menuPrice = '-';
                  } else {
                    var menuPrice = value.price;
                  };
                  menu_string = menu_string + servingTime + '\n' + menuDescription + ': ' + menuPrice + '원\n';
                } else if (!!value.name == true && !!value.description == false) {
                  // Case only name
                  var servingTime = getMenuTime(value.time);
                  var menuName = value.name;
                  if (!value.price) {
                    var menuPrice = '-';
                  } else {
                    var menuPrice = value.price;
                  };
                  menu_string = menu_string + servingTime + '\n' + menuName + ': ' + menuPrice + '원\n';
                };
              });
              return removeDuplicated(menu_string);
            } else {
              if (!!menuList.name == true && !!menuList.description == true) {
                // Case have both
                var servingTime = getMenuTime(menuList.time);
                var menuName = menuList.name;
                var menuDescription = menuList.description;
                if (!value.price) {
                  var menuPrice = '-';
                } else {
                  var menuPrice = value.price;
                };
                menu_string = menu_string + servingTime + '\n' + menuName + ' (' + menuDescription + '): ' + menuPrice + '원\n';
              } else if (!!menuList.description == true && !!menuList.name == false) {
                // Case only description
                var servingTime = getMenuTime(menuList.time);
                var menuDescription = menuList.description;
                if (!value.price) {
                  var menuPrice = '-';
                } else {
                  var menuPrice = value.price;
                };
                menu_string = menu_string + servingTime + '\n' + menuDescription + ': ' + menuPrice + '원\n';
              } else if (!!menuList.name == true && !!menuList.description == false) {
                // Case only name
                var servingTime = getMenuTime(menuList.time);
                var menuName = menuList.name;
                if (!value.price) {
                  var menuPrice = '-';
                } else {
                  var menuPrice = value.price;
                };
                menu_string = menu_string + servingTime + '\n' + menuName + ': ' + menuPrice + '원\n';
              };
            };
            return removeDuplicated(menu_string);
          }

          function removeDuplicated(source_text) {
            var temp_arr = source_text.split(/\r?\n/);
            var new_set = new Set(temp_arr);
            let array = Array.from(new_set);
            return array.join('\n');
          }

          function receiveMenu(body_raw) {
            var body = JSON.parse(body_raw);
            if (body.store.menus.length > 0) {
              body.store.menus.forEach(function(value) {
                delete value.type;
                delete value.date;
                if (value.description === '#' || !value.description) {
                  delete value.description;
                };
                if (value.name === '#' || !value.name) {
                  delete value.name;
                };
              });
              return menuPresenter(body.store.menus);
            } else {
              return '메뉴가 업로드되지 않았어ㅠ';
            };
          }

          function formatDate_Gamgol(todayOrTomorrow) {
            var d = new Date();
            var today = new Date(d.getTime() + 32400000); // +32400000;
            var dPlus2 = new Date(today.getTime() + 86400000);

            var day = today.getDate();
            var tomorrow = dPlus2.getDate();
            var month = today.getMonth() + 1;
            var year = today.getFullYear();

            if (todayOrTomorrow === 'today') {
              return year + '-' + month + '-' + day;
            } else if (todayOrTomorrow === 'tomorrow') {
              return year + '-' + month + '-' + tomorrow;
            } else {
              return year + '-' + month + '-' + day;
            };
          }

          function checkGamgolRestaurant(raw_string) {
            //Check if right restaurant
            if (raw_string.slice(0, 4) == '감골식당') {
              return true;
            } else {
              return false;
            };
          }

          function getGamgolMenu(html_menu) {
            var menu_preprocess_1 = html_menu.replace(/-|-/g, '');
            var menu_preprocess_2 = menu_preprocess_1.replace(/\n|,/g, ' ');
            var menu_preprocess_3 = menu_preprocess_2.replace('감골식당', '');
            var menu_preprocess_4 = menu_preprocess_3.replace(/ +(?= )/g, '');
            var menu_preprocess_5 = menu_preprocess_4.slice(1);
            var menu_list = menu_preprocess_5.split(' ');

            for (i = 0; i < menu_list.length; i++) {
              if (menu_list[i].match(/^\d\d/)) {
                var price = menu_list[i].slice(0, 2) + '00원';
                var menu_name = menu_list[i].slice(2);
                var final_menu = menu_name + ' (' + price + ')';
                menu_list[i] = final_menu;
              }
              if (menu_list[i] == 'ⓚ채식') {
                menu_list[i] = 'ⓚ채식 (6500원)';
              }
            };

            var gamgol_menu = menu_list.join('\n');
            return gamgol_menu;
          }

          // Check if request for Gamgol
          if (searchQuery != '감골식당') {

            // Get regular cafeteria menus
            var dateReq = formatDate(requestDate);

            //Query
            var queryObject = {
              date: dateReq //Date
            };

            //API Access token
            let req = request.defaults({
              headers: {
                'Accesstoken': 'rJmmySxpKPHpgnCQho8R6LMZ65iCstLMQ81j4gWjwS7lmgmpCE'
              }
            });

            req({
              uri: 'https://bablabs.com/openapi/v1/campuses/spgIiBzSj0/stores/' + storeTag,
              qs: queryObject,
            }, function(err, res, body) {
              if (err) {

                //console.log(err.message);
                context.session.result = err.message;

              } else {

                //var outputText = searchQuery + '\n' + stringDate(requestDate) + '\n' + receiveMenu(body);
                //console.log(outputText);
                context.session.result = searchQuery + '\n' + stringDate(requestDate) + '\n' + receiveMenu(body);

              };

              callback();

            });
          } else {

            var url_gamgol = 'http://mini.snu.kr/cafe/set/';
            var gamgol_day_request = formatDate_Gamgol(requestDate);
            var url_day_gamgol = url_gamgol + gamgol_day_request;

            request({
              method: 'POST',
              url: url_day_gamgol
            }, function(err, res, body) {
              if (err) return console.error(err);

              let menu_data_gamgol = cheerio.load(body);

              //Check if right restaurant
              if (checkGamgolRestaurant(menu_data_gamgol('table tr:nth-child(11)').text()) === true) {
                var gamgol_menu_final = menu_data_gamgol('table tr:nth-child(11)').text();
                var gamgol_menu_text = searchQuery + '\n' + stringDate(requestDate) + '\n' + getGamgolMenu(gamgol_menu_final);

                //console.log(gamgol_menu_text);
                context.session.result = gamgol_menu_text;

              } else if (checkGamgolRestaurant(menu_data_gamgol('table tr:nth-child(10)').text()) === true) {
                var gamgol_menu_final = menu_data_gamgol('table tr:nth-child(10)').text();
                var gamgol_menu_text = searchQuery + '\n' + stringDate(requestDate) + '\n' + getGamgolMenu(gamgol_menu_final);

                //console.log(gamgol_menu_text);
                context.session.result = gamgol_menu_text;

              } else {

                //console.log('메뉴가 없습니다.');
                context.session.result = '메뉴가 없어.';
              };

              callback();

            });
          };

         
      
    }
  });
bot.setTask('searchShuttleTime', {
  action: function(dialog, context, callback) {

    var shuttles = {

      "time_line_01": {
        "start_hour": 7,
        "start_min": 0,
        "end_hour": 8,
        "end_min": 0,
        "time_window": 15
      },

      "time_line_02": {
        "start_hour": 8,
        "start_min": 0,
        "end_hour": 8,
        "end_min": 30,
        "time_window": 5
      },
      "time_line_03": {
        "start_hour": 8,
        "start_min": 30,
        "end_hour": 10,
        "end_min": 0,
        "time_window": 3
      },

      "time_line_04": {
        "start_hour": 10,
        "start_min": 0,
        "end_hour": 11,
        "end_min": 0,
        "time_window": 5
      },

      "time_line_05": {
        "start_hour": 11,
        "start_min": 0,
        "end_hour": 15,
        "end_min": 30,
        "time_window": 10
      },

      "time_line_06": {
        "start_hour": 15,
        "start_min": 30,
        "end_hour": 17,
        "end_min": 0,
        "time_window": 4
      },

      "time_line_07": {
        "start_hour": 17,
        "start_min": 0,
        "end_hour": 18,
        "end_min": 0,
        "time_window": 4
      },

      "time_line_08": {
        "start_hour": 18,
        "start_min": 0,
        "end_hour": 19,
        "end_min": 0,
        "time_window": 6
      },

      "time_line_09": {
        "start_hour": 19,
        "start_min": 0,
        "end_hour": 21,
        "end_min": 10,
        "time_window": 1
      },
      "time_line_10": {
        "start_hour": 21,
        "start_min": 10,
        "end_hour": 21,
        "end_min": 40,
        "time_window": 6
      },
      "time_line_11": {
        "start_hour": 21,
        "start_min": 40,
        "end_hour": 22,
        "end_min": 10,
        "time_window": 6
      },
      "time_line_12": {
        "start_hour": 22,
        "start_min": 10,
        "end_hour": 22,
        "end_min": 40,
        "time_window": 6
      },
      "time_line_13": {
        "start_hour": 22,
        "start_min": 40,
        "end_hour": 23,
        "end_min": 10,
        "time_window": 6
      },
      "time_line_14": {
        "start_hour": 22,
        "start_min": 40,
        "end_hour": 23,
        "end_min": 10,
        "time_window": 6
      }
    };


    var d = new Date();
    var d2 = new Date(d.getTime() + 32400000);

    var parsed_object = JSON.parse(JSON.stringify(shuttles));


    function getTimeInMin() {
      var time_hr = d2.getHours();
      var minute_min = d2.getMinutes();
      var timeInMin = time2min(time_hr, minute_min);
      return timeInMin;
    }

    function time2min(hours, minutes) {
      var minutes_num = hours * 60 + minutes;
      return minutes_num
    }

    function generateSchedule(window_min) {
      var bus_times_min = 60 / window_min;
      var schedules = [];
      for (var min = 0; min < bus_times_min + 1; min++) {
        schedules.push(min * window_min);
      }
      return schedules;
    }

    var current_time = getTimeInMin();

    for (var bus in parsed_object) {
      var st_hour = shuttles[bus].start_hour;
      var st_minute = shuttles[bus].start_min;
      var end_hour = shuttles[bus].end_hour;
      var end_minute = shuttles[bus].end_min;
      var zone_start_time = time2min(st_hour, st_minute);
      var zone_end_time = time2min(end_hour, end_minute);
      //추가
      if (current_time >= 7 * 60 && current_time < 19 * 60) {
        if (current_time >= zone_start_time && current_time < zone_end_time) {
          var currentschedule_min = generateSchedule(parsed_object[bus].time_window);

          // Get time left
          var cur_time_min = d2.getMinutes();
          // Calculate minutes left
          for (var schedule = 0; schedule < currentschedule_min.length; schedule++) {
            if (cur_time_min > currentschedule_min[schedule] && cur_time_min < currentschedule_min[schedule + 1]) {
              var mins_left = currentschedule_min[schedule + 1] - cur_time_min;
              context.session.shuttleTime = "현재 시각에 배차 간격은" + parsed_object[bus].time_window + "분이고, 서울대 입구역에서 출발시 약 " + mins_left + "분 남았어!!";
            };
          };
        }
      } else if (current_time >= 19 * 60 && current_time < 23 * 60 + 10) {
        if (current_time >= zone_start_time && current_time < zone_end_time) {
          var cur_time_min = d2.getMinutes();
          // Calculate minutes left
          var mins_left = zone_end_time - current_time;
          var converted_mins_left;
          
          if (mins_left > 60) {
          	var h = Math.floor(mins_left / 60);
            var m = mins_left % 60;
            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            converted_mins_left = h + '시간 ' + m;
          } else {
          	converted_mins_left = mins_left;
          };
          
          context.session.shuttleTime = end_hour + "시" + end_minute + "분 야간 셔틀이 " + converted_mins_left + " 분 남았어! 오늘 하루도 수고했구나~~";
        }
      } else {
        context.session.shuttleTime = "운행 중인 셔틀이 없어ㅠㅠ";
        break;
      }
    }

    callback();

  }
});
  
	bot.setTask('searchWeather_new', 
	{
		action: function (dialog, context, callback)
		{
     
          
        //Load modules
        var req_weather = require('request');

        var key = '77428235b3bf2576ca36a15f9692486f';
        var appId = '&appid=' + key;
        var url = 'http://api.openweathermap.org/data/2.5/weather?lat=37.459814&lon=126.953166';
        var requestURL = url + appId + "&lang=kr";

        req_weather({
          uri: requestURL
        }, function(err, res, body) {
          var body = JSON.parse(body);
          var title = "서울대 현재 날씨";
          var description;
          if (body.weather[0].description == '연무') {
            description = '옅은 안개';
          } else {
            description = body.weather[0].description;
          };
          var summary = description + " (" + (body.main.temp - 273.15).toFixed(2) + "°C" + ")";
          var humidity = "습도: " + body.main.humidity + "%";
          var wind = "풍속: " + body.wind.speed + "m/s";
          //var weather_text = title + '\n' + summary + '\n' + humidity + '\n' + wind;

          context.session.weatherSnu = title + '\n' + summary + '\n' + humidity + '\n' + wind;
          //console.log(weather_text); 
			callback();
        });

		}
	});

	bot.setTask('searchWeatherForcast', 
	{
		action: function (dialog, context, callback)
		{

            //Load modules
            var req_forecast = require('request');

            var key = '77428235b3bf2576ca36a15f9692486f';
            var appId = '&appid=' + key;
            var url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?lat=37.459814&lon=126.953166';
            var requestForecastURL = url_forecast + "&lang=kr" + appId;

            // English version
            //var requestForecastURL = url_forecast + appId;

            function getDateToday() {
              var d = new Date();
              var d2 = new Date(d.getTime() + 32400000);
              //var d2 = new Date(d.getTime() + 0);
              var day = ("0" + d2.getDate()).slice(-2);
              var month = ("0" + (d.getMonth() + 1)).slice(-2);
              var year = d.getFullYear();
              return year + '-' + month + '-' + day;
            }

            function compareDays(source, target) {
              var source_day = parseInt(source.split("-")[2]);
              var target_day = parseInt(target.split("-")[2]);
              var target_month = parseInt(target.split("-")[1]);

              if (source_day === target_day) {
                return '오늘';
              } else if (source_day + 1 === target_day) {
                return '내일';
              } else {
                return target_month + '월' + target_day + '일';
              };
            }

            function getForcasts(body_data, start_index, end_index, step) {
              var body_parsed = JSON.parse(body_data);
              var today = getDateToday();
              var forcast_title = "일기예보";
              var forcast_text = '';

              for (var i = start_index; i <= end_index; i += step) {
                var forcast_date = body_parsed.list[i].dt_txt.slice(0, 10);
                var forcast_date_hr = body_parsed.list[i].dt_txt.slice(11, 13);
                var forcast_descr = body_parsed.list[i].weather[0].description;
                var forcast_temp = " (" + (body_parsed.list[i].main.temp - 273.15).toFixed(2) + "°C" + ")";
                var day_text = compareDays(today, forcast_date);
                var forcast =  '\n' + day_text + ' ' + forcast_date_hr + '시: ' + forcast_descr + forcast_temp;
                forcast_text = forcast_text + forcast;
              };

              return forcast_text;
            }

            req_forecast({
              uri: requestForecastURL
            }, function(err, res, body) {
              var forcast_data = getForcasts(body, 2, 11, 1);

              //console.log(forcast_data);

              context.session.weatherForecast = forcast_data;
              callback();

            });     
          
		}
	});

	bot.setTask('getLotto', 
	{
		action: function (dialog, context, callback)
		{

          
          function Lotto() {
            var lotto = new Array(6); // New array
            var count = 0; // Num of generated lottery
            var overl = true; // Check duplicate numbers

            while (count < 6) {
              var number = 0;
              number = parseInt(Math.random() * 45) + 1; // Get random number between 1~45

              for (var i = 0; i < count; i++) { // check duplicates
                if (lotto[i] == number) { // If not duplicate continue
                  overl = false;
                }
              }

              if (overl) { // Increase count
                lotto[count] = number; // Append number
                count++;
              }

              overl = true;
            }

            var lottery_numbers = lotto[0] + ', ' + lotto[1] + ', ' + lotto[2] + ', ' + lotto[3] + ', ' + lotto[4] + ', ' + lotto[5];
            return lottery_numbers;

          }

          context.session.randomLotto = Lotto();
          //var new_lottery = Lotto();
          //console.log(Lotto());

          callback();  
          
		}
	});

	bot.setTask('getFineDustInfo', 
	{
		action: function (dialog, context, callback)
		{

          
         // Load dependencies
          var request = require('request');
          var location = '동작구';

          // Request URL
          var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty';
          var queryParams = '?' + encodeURIComponent('ServiceKey') + '=LQEeedADdiA6byfN6ia7PA%2FumVSCjlSD2fcAPmEOEBraTeuxFXxN8jlKHnCvy%2Bqswni1rTf0q6hYmBapF4Nsdg%3D%3D';
          queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1'); /* 한 페이지 결과 수 */
          queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */
          queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(location); /* 측정소 이름 */
          queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('DAILY'); /* 요청 데이터기간 (하루 : DAILY, 한달 : MONTH, 3달 : 3MONTH) */
          queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3'); /* 버전별 상세 결과 참고문서 참조 */

          function stripHtmlTag(source_text, html_tag) {
            var start_tag = '<' + html_tag + '>';
            var end_tag = '</' + html_tag + '>';
            var clean_stage1 = source_text.replace(start_tag, '');
            var clean_value = parseInt(clean_stage1.replace(end_tag, ''));
            return clean_value;
          }

          function checkStatus(pmVal) {
            if (pmVal <= 30) {
              return '좋음';
            } else if (pmVal > 30 && pmVal <= 80) {
              return '보통';
            } else if (pmVal > 80 && pmVal <= 150) {
              return '나쁨';
            } else if (pmVal > 150){
              return '매우 나쁨';
            } else {
              return '정보 없음';
            }
          }

          function getMessage(value_string) {
            switch (value_string) {
              case "좋음":
                  return "오늘 미세먼지 상태는 '좋음' 이구나.\n나들이 하기 딱 좋은 날씨구먼!\n시간 나면 자하연 와서 나를 보고 가려무나~\n\n";
                  break;
              case "보통":
                  return "오늘 미세먼지 상태는 '보통' 이구나. 마스크는 안 써도 되겠어.\n";
                  break;
              case "나쁨":
                  return "오늘은 미세먼지 상태가 나쁘네.. 마스크를 쓰는게 좋겠군.\n";
                  break;
              case "매우 나쁨":
                  return "오늘은 미세먼지 상태가 매우 나쁨이야!! 마스크를 꼭 쓰고 나가게~\n"
              default:
                  return "미세먼지 정보가 없다..\n"
              };
          }


          request({
              url: url + queryParams,
              method: 'GET'
          }, function (error, response, body) {
              var tag = '㎍/㎥';
              var microDust_xml = body.match(/<\s*pm10Value[^>]*>(.*?)<\s*\/\s*pm10Value>/g);
              var ultraMicroDust_xml = body.match(/<\s*pm25Value[^>]*>(.*?)<\s*\/\s*pm25Value>/g);
              var microDust = stripHtmlTag(microDust_xml[0], 'pm10Value');
              var ultraMicroDust = stripHtmlTag(ultraMicroDust_xml[0], 'pm25Value');

              var microDust_notif = '미세먼지: ' + microDust + tag;
              var ultraMicroDust_notif = '초미세먼지: ' + ultraMicroDust + tag;
              var footnote = '(' + location + ' 측정소)';

              //var final_alert = getMessage(checkStatus(microDust)) + microDust_notif + '\n' + ultraMicroDust_notif + '\n' + footnote;
              //console.log(final_alert);

              context.session.fineDustResult = getMessage(checkStatus(microDust)) + microDust_notif + '\n' + ultraMicroDust_notif + '\n' + footnote;
            
              callback();
          });

          
		}
	});

	bot.setTask('getLibrarySeatsInfo', 
	{
		action: function (dialog, context, callback)
		{

           //Load modules
          var request = require('request');
          var cheerio = require('cheerio');

          var url = 'http://libseat.snu.ac.kr/domain5_lib.asp';

          function split_table_data(tableRow) {
            var total_seats = tableRow[0];
            var occupied_seats = tableRow[1];
            var free_seats = tableRow[2];
            var occupancy = tableRow[3];
            var line = '\n----------\n'
            return '전체 좌석수: ' + total_seats + '\n사용 좌석수: ' +  occupied_seats + '\n잔여 좌석수: ' + free_seats + '\n이용율: ' + occupancy + line;
          }


          request({
            method: 'POST',
            url: url
          }, function(err, res, body) {
            if (err) return console.error(err);
            let lib_data = cheerio.load(body);
            var final_library_info = '';

            for (var i = 3; i < 13; i++) {
              var table_tag = 'table tr:nth-child(' + i + ')';
              var table_row = lib_data(table_tag).text();
              if (i < 9) {
                var room_name = table_row.slice(2, 11);
                var room_data = table_row.slice(12).split(' ');
                var room_info = split_table_data(room_data);
                var room_info_text = '<' + room_name + '>\n' + room_info;
                final_library_info += room_info_text;
              } else if (i > 8 && i < 12) {
                var room_name = table_row.slice(2, 12);
                var room_data = table_row.slice(13).split(' ');
                var room_info = split_table_data(room_data);
                var room_info_text = '<' + room_name + '>\n' + room_info;
                final_library_info += room_info_text;
              } else if (i == 12) {
                var room_name = table_row.slice(3, 13);
                var room_data = table_row.slice(14).split(' ');
                var room_info = split_table_data(room_data);
                var room_info_text = '<' + room_name + '>\n' + room_info;
                final_library_info += room_info_text;
              };
            };

            //console.log(final_library_info);
            context.session.librarySeatsInfo = final_library_info;
            callback();
          });
          

          
		}
	});
};