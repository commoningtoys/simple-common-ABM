class Plot {
  constructor(commoner_num) {
    this.data = {
      general_happyness: [],
      agents_happyness: this.init_happyness(),
      damage: [],
      unusable: [],
      datum: []
    }
    // console.log(this.data.agents_happyness);
    // this.data.agents_happyness.forEach( row => console.log(row))
    for (let i = 0; i < commoner_num; i++) {
      this.data.agents_happyness[i] = []
    }
    this.max_data_points = 200
    this.chart
    this.init_chart()
  }

  init_happyness(num){

    let arr = []
    for (let i = 0; i < num; i++) {
      let columns = []
      for (let j = 0; j < 1; j++) {
        columns[j] = []
      }
      arr[i] = columns
    }
    return arr
  }

  set_data(general_happyness, agents_happyness, damage, unusable, days) {
    this.data.general_happyness.push(general_happyness)
    this.check_overflow_data(this.data.general_happyness)
    // change this to make add array as a column
    let idx = 0
    this.data.agents_happyness.forEach(row => {
      row.push(agents_happyness[idx])
      this.check_overflow_data(row)
      idx++
    })
    // this.data.agents_happyness.push(agents_happyness)
    this.data.damage.push(damage)
    this.check_overflow_data(this.data.damage)
    this.data.unusable.push(unusable)
    this.check_overflow_data(this.data.unusable)
    this.data.datum.push(days)
    this.check_overflow_data(this.data.datum)
  }

  check_overflow_data(arr){
    if(arr.length > this.max_data_points){
      arr.splice(0, 1)
    }
  }

  get_dims() {
    return {
      w: document.getElementById('chart').getBoundingClientRect().width,
      h: innerHeight - 100
    }
  }

  init_chart() {
    this.chart = c3.generate({
      bindto: '#chart',
      size: {
        width: 1000,
        height: 650
        // width: this.get_dims().w * 0.95,
        // height: this.get_dims().h * 0.95
      },
      padding: {
        top: 20,
        right: 75,
        bottom: 20,
        left: 75
      },
      data: {
        x: 'datum',
        columns: [],
      },
      // axis: {
      //   x: {
      //     type: 'timeseries',
      //     // tick: {
      //     //   format: this.date_format,
      //     //   multiline: true,
      //     //   count: 10
      //     // },
      //   },
      // },
      subchart: {
        show: true
      },
      point: {
        r: 2,
        focus: {
          expand: {
            r: 5
          }
        }
      },
      transition: {
        duration: null
      },
      // onresize: () => {
      //   this.chart.resize({
      //     width: this.get_dims().w * 0.95,
      //     height: this.get_dims().h * 0.95
      //   })
      // }
    })
  }

  update_chart() {
    // this.parse_data(this.data)
    // console.log(this.parse_data(this.data))
    const data = JSON.parse(JSON.stringify(this.data))
    this.chart.load({
      columns: this.parse_data(data)
    });
  }


  parse_data(obj) {
    const values = []
    Object.keys(obj).forEach(key => {
      if (key === 'agents_happyness') {
        // const agents_happyness = [...obj[key]]
        // let idx = 0
        // agents_happyness.forEach(arr => {
        //   arr.unshift('commoner-' + idx)
        //   values.push(arr)
        //   idx++
        // })
      } else {
        const arr = [...obj[key]]
        arr.unshift(key);
        values.push(arr);
      }
    })
    return values
  }
}