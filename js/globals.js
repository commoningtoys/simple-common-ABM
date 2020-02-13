const sizes = {
    grid: 25,
    cell: 25,
    set_div: () => document.getElementById('total').textContent = sizes.grid * sizes.grid
}
sizes.set_div()

const actions = ['work', 'swap', 'rest']

const community_args = {
    num_commoners: 100, 
    monthly_hours: 5, 
    max_damage_value: 100, 
    vision: 1, 
    commoners_trait: 'work'
}

