export default function filters(coffees, { country, name, type, reference }) {
    if (country) {
        coffees = coffees.filter(coffee => coffee.country_name === country);
    }
    if (name) {
        coffees = coffees.filter(coffee => coffee.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (type) {
        coffees = coffees.filter(coffee => coffee.coffee_type.includes(type));
    }
    if (reference) {
        coffees = coffees.filter(coffee => coffee.reference.includes(reference));
    }
    return coffees;
};