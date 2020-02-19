const sizes = {
    grid: 25,
    cell: 25,
    set_div: () => {
        const totals = document.getElementsByClassName('total')
        for (const element of totals) {
            element.textContent = sizes.grid * sizes.grid
        }
    }
}
sizes.set_div()

const actions = ['work', 'swap', 'rest']

const community_args = {
    num_commoners: 100,
    monthly_hours: 5,
    max_damage_value: 100,
    vision: 1,
    commoners_trait: 'work',
    protestant: () => {
        const protestant = document.getElementById('protestant')
        if(protestant != undefined){
            return protestant.checked
        }else{
            return false
        }
    }
}

