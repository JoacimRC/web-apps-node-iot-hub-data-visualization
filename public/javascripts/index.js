$(document).ready(function () {
  var timeData = [],
    distanceData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Distance',
        yAxisID: 'Distance',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: distanceData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Distance Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Distance',
        type: 'linear',
        scaleLabel: {
          labelString: 'Distance',
          display: true
        },
        position: 'left',
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.published_at || !obj.data) {
        return;
      }
      timeData.push(obj.published_at);
      distanceData.push(obj.data);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        distanceData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
