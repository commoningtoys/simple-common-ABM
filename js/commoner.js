class Commoner {
  /**
   * @param {Object} trait object containing the tendency to work, swap or rest
   */
  constructor(trait, collabirability, monthly_hours, id) {
    this.trait = trait || null
    this.position = {
      x: 0,
      y: 0
    }
    this.monthly_hours = monthly_hours
    this.happyness = random_int(100)
    this.id = nf(id, 4)
    // this.collabirability = collabirability

    this.resting = false
    this.swapping = false
    this.done_for_the_month = false

    this.probabilities = {
      work: [0, 0, 0, 0, 0, 0, 1, 2],
      swap: [0, 1, 1, 1, 1, 1, 1, 2],
      rest: [0, 1, 2, 2, 2, 2, 2, 2],
      mixed: [0, 1, 2]
    }

    this.actions_memory = []
    this.init();
  }
  init() {
    this.position.x = random_int(sizes.grid)
    this.position.y = random_int(sizes.grid)
  }
  move() {
    this.position.x += this.step()
    this.position.y += this.step()
    this.edge()
  }

  edge() {
    // wrap around with modulo
    this.position.x = (this.position.x + sizes.grid) % sizes.grid
    this.position.y = (this.position.y + sizes.grid) % sizes.grid
  }

  step() {
    return -1 + random_int(3)
  }
  decision() {
    // here we use step as it returns a value between -1 and 1 
    // there is only the need to map those values to swap, work or rest
    if (this.done_for_the_month || this.resting) {
      return 'rest'
    } else if (this.swapping) {
      this.swapping = false
      return 'work'
    } else {
      const action = this.decide_action();
      // console.log(action, this.trait);
      this.actions_memory.push(action)
      if (action === 'swap') {
        this.swapping = true
      } else if (action === 'rest') {
        // console.log('rest');
        this.resting = true
        this.happyness++
      }
      return action
    }
  }

  decide_action(){
    // console.log(this.probabilities[this.trait]);
    const probability = this.probabilities[this.trait]
    const prob_idx = random_int(probability.length)
    const idx = probability[prob_idx]
    // console.log(this.trait, probability[prob_idx], actions[idx]);
    return actions[idx]
  }

  reduce_happyness(val) {
    this.happyness -= val
    if(this.happyness < 0) this.happyness = 0
  }

  monthly_hours_leftover() {
    console.log('///////////////////////////');
    console.log(this.monthly_hours, this.id);
    console.log(this.happyness);
    this.happyness -= this.monthly_hours
    console.log(this.happyness);
  }

  work(hours) {
    this.monthly_hours -= hours
    if (this.monthly_hours <= 0) {
      this.done_for_the_month = true
    }
  }

  get_actions_percentage(){
    const work = (this.actions_memory.filter(memory => memory === 'work').length / this.actions_memory.length) * 100
    const swap = (this.actions_memory.filter(memory => memory === 'swap').length / this.actions_memory.length) * 100
    const rest = (this.actions_memory.filter(memory => memory === 'rest').length / this.actions_memory.length) * 100
    return {work, swap, rest}
  }

  display() {
    noStroke()
    if (this.done_for_the_month) {
      fill(255, 255, 120)
    } else if(this.resting){
      fill(0, 255, 0)
    }else if(this.swapping){
      fill(255, 120, 255)
    }else{
      fill(0, 0, 255)
    }
    ellipse((this.position.x * sizes.cell) + (sizes.cell / 2), (this.position.y * sizes.cell) + (sizes.cell / 2), sizes.cell * 0.9)
  }
}