let community
let cnv
const happy_span = document.getElementById('happiness')
const damage_span = document.getElementById('damage')
const unusable_span = document.getElementById('unusable')
function setup() {
  cnv = createCanvas(sizes.grid * sizes.cell, sizes.grid * sizes.cell);
  cnv.parent('p5')
  community = new Community(community_args);
  // frameRate(15)
}

function draw() {
  step()

}

function step(){
  // background(125)

  community.display()
  community.move_commoners()
  community.show_commoners()
  community.next_day()

  const happiness = community.get_avg_happiness()
  happy_span.textContent = happiness
  const damage  = community.get_damaged_infrastructure().length
  damage_span.textContent = damage
  const unusable  = community.get_unusable_infrastructure().length
  unusable_span.textContent = unusable
}

function mouseClicked(){
  step()
}

function restart_model(){
  const selected_trait = document.getElementById('select-traits').value
  community_args.commoners_trait = selected_trait
  community = new Community(community_args);
}