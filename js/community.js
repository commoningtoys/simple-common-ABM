class Community {
  /**
   * 
   * @param {Object} community_args {
                                      num_commoners: Number, | amount of commoners
                                      monthly_hours: Number, | hours the commoner needs to fulfill each month
                                      max_damage_value: Number, | after how much damage a common is not usable
                                      vision: Number, | how attentive the commoner is
                                      commoners_trait: String | describes the decision the commoner may do
                                  }
   */
  constructor(community_args) {

    this.monthly_hours = community_args.monthly_hours

    this.commoners_trait = community_args.commoners_trait

    this.collaborability = community_args.collaborability

    this.usage = community_args.usage

    this.damage_threshold = 255


    this.colors = {
      healty: color('#fff'),//#80dd80
      damaged: color('#000'),
      unusable: color('#f33')
    }

    this.infrastructure = this.init_infrastructure()
    this.commoners = this.init_commoners(community_args.num_commoners, community_args.collaborability)
    this.damaged_infrastructure = []
    this.days = 1
    this.hours = 1;

    this.max_damage_value = 255 + community_args.max_damage_value
    this.vision = community_args.vision
    this.protestant = community_args.protestant()
    // this.display()

    this.plot = new Plot(community_args.num_commoners)
  }

  init_infrastructure() {
    let arr = []
    for (let i = 0; i < sizes.grid; i++) {
      let columns = []
      for (let j = 0; j < sizes.grid; j++) {
        columns[j] = {
          value: 0,
          consumed: false,
          position: {
            x: i,
            y: j
          },
          usable: true
        }
      }
      arr[i] = columns
    }
    return arr
  }

  init_commoners(num, collaborability) {
    const arr = []
    for (let i = 0; i < num; i++) {
      arr[i] = new Commoner(this.commoners_trait, collaborability, this.monthly_hours, i)
    }
    return arr
  }

  display() {
    let x = 0;
    this.infrastructure.forEach(col => {
      let y = 0
      col.forEach(row => {
        stroke(0)
        if (row.consumed || !row.usable) {
          fill(this.colors.damaged)
          if (!row.usable) fill(this.colors.unusable)
        } else {
          const val = Math.floor(Math.pow((row.value / this.damage_threshold), 2) * 10) / 10
          const col = lerpColor(this.colors.healty, this.colors.damaged, val)
          fill(col, 255, 255)
        }
        square(x * sizes.cell, y * sizes.cell, sizes.cell)
        y++
      })
      x++
    })

  }

  use_infrastructure() {
    this.commoners.forEach(commoner => {
      const position = commoner.position
      this.infrastructure[position.x][position.y].value += this.usage
      // check if the position is unusable, if yes happiness decreases
      if (this.infrastructure[position.x][position.y].usable === false) {
        commoner.reduce_happiness(0.5)
      }
      // here we check whether infrastructure is consumed aka value over 255
      if (this.infrastructure[position.x][position.y].value > this.damage_threshold && !this.infrastructure[position.x][position.y].consumed) {
        this.infrastructure[position.x][position.y].consumed = true
      }
    })
  }

  restore_infrastructure() {

    // noLoop()
    const restored = []
    let index = 0
    this.damaged_infrastructure = this.get_damaged_infrastructure()
    this.damaged_infrastructure.forEach(cell => {
      const position = cell.position
      const neighbours = []
      for (let y = -this.vision; y <= this.vision; y++) {
        for (let x = -this.vision; x <= this.vision; x++) {
          noStroke()
          fill(0, 255, 0, 5)
          let pos_x = position.x + x
          let pos_y = position.y + y
          pos_x = (pos_x + sizes.grid) % sizes.grid
          pos_y = (pos_y + sizes.grid) % sizes.grid
          const neighbour = this.commoners.filter(commoner => commoner.position.x === pos_x && commoner.position.y === pos_y)
          // console.log(neighbour);
          if (neighbour.length > 0) neighbours.push(neighbour[0])
          // square(pos_x * sizes.cell, pos_y * sizes.cell, sizes.cell)
        }
      }
      // console.log(neighbours);
      if (this.decision_making(neighbours)) {
        // console.log('community infrastructure is restored');
        this.infrastructure[position.x][position.y].value = 0
        this.infrastructure[position.x][position.y].consumed = false
        // restored.push(index);
      }
      index++
    })
    // restored.forEach(index => this.damaged_infrastructure.splice(index, 1))
    // loop()
  }

  decision_making(neighbours) {
    const available = neighbours.filter(commoner => commoner.decision() === 'work')
    if (available.length < 1) {
      // community loses independency because no one is taking care of this
      // console.log('nooo....nobody is taking care of the community')
      return false
    }
    let chosen_commoner = []
    if (available.length > 1) {
      this.solve_conflict(available)
      // console.log(chosen_commoner);
    } else {
      // the commoner works and the infrastructure gets restored
      // the commoner uses one hour up and 
      available[0].work(0.5)
      // console.log('work', available)
    }
    // console.log(chosen_commoner)
    // chosen commoner uses his monthly hours
    // chosen_commoner.forEach(commoner => commoner.work())
    // chosen_commoner.work()
    return true
  }

  solve_conflict(available) {

    // just pick a random agent and reduce the happiness of the other/s
    const perc = Math.random()
    if (perc <= this.collaborability) {
      // console.log('collaborate');
      const hours = 0.5 / available.length
      available.forEach(commoner => {
        commoner.work(hours)
        commoner.happiness += 0.5
      })
    } else {

      // console.log('work alone');
      const rand_idx = random_int(available.length)
      available[rand_idx].work(0.5)
      // remove chosen from list
      available.splice(rand_idx, 1)
      // reduce happiness of commoners left out
      available.forEach(commoner => commoner.reduce_happiness(1))
    }
  }

  next_day() {
    this.check_infrastructure_usability()


    if (this.days % 10 === 0) {
    }

    this.hours++
    if (this.hours % 13 == 0) {
      this.hours = 1
      this.days++
      this.commoners.forEach(commoner => commoner.resting = false)

      this.set_plot_data()
      this.plot.update_chart()
    }
    if (this.days % 31 === 0 && this.hours % 13 == 1) {
      // this.set_plot_data()
      // this.plot.update_chart()
      this.commoners.forEach(commoner => {

        if (this.protestant) commoner.monthly_hours_leftover()
        commoner.monthly_hours = this.monthly_hours
        commoner.done_for_the_month = false
        // console.log(commoner.get_actions_percentage());
      })
    }
  }

  get_avg_happiness() {
    const happiness = this.commoners.map(commoner => commoner.happiness)
    // console.log(happiness);
    const sum_happiness = happiness.reduce((acc, val) => acc + val, 0)
    // console.log(sum_happiness / this.commoners.length);
    return sum_happiness / this.commoners.length
  }

  get_damaged_infrastructure() {
    const damage = []
    this.infrastructure.forEach(col => col.forEach(el => { if (el.consumed === true && el.usable === true) damage.push(el) }))
    return damage
  }

  get_unusable_infrastructure() {
    const unusable = []
    this.infrastructure.forEach(col => col.forEach(el => { if (el.consumed === true && el.usable === false) unusable.push(el) }))
    return unusable
  }

  check_infrastructure_usability() {
    this.infrastructure.forEach(col => col.forEach(el => { if (el.value > this.max_damage_value) el.usable = false }))
  }

  move_commoners() {
    this.commoners.forEach(commoner => commoner.move())
    this.use_infrastructure()
    this.restore_infrastructure()
  }
  show_commoners() {
    this.commoners.forEach(commoner => commoner.display())
  }

  show_commoners_happiness(){
    this.commoners.forEach(commoner => commoner.show_happiness())
  }

  set_plot_data() {
    const avg_happiness = this.get_avg_happiness()
    const damaged = (this.get_damaged_infrastructure().length / (sizes.grid * sizes.grid)) * 100
    const unusable = (this.get_unusable_infrastructure().length / (sizes.grid * sizes.grid)) * 100
    const commoners_happiness = this.commoners.map(commoner => commoner.happiness)
    this.plot.set_data(avg_happiness, commoners_happiness, damaged, unusable, this.days)
  }
}