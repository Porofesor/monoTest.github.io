class Field {
    constructor(element) {
        this.Field_id = element.id;
            this.Field_name = element.name;
        if (element.field_function == 1) {
            this.Field_ownerId = "None";
        } else {
            this.Field_ownerId = "";
        }
        this.title = element.title;
        this.Field_IsBuyable = (element.buyable);
        this.Field_property_value = (element.property_value);
        this.Field_function = element.field_function;
        this.Field_penalty = (element.field_penalty);
        this.Field_penaltyForEveryHouse = (element.penalty_for_house);
        this.Field_house_ammount = 0;
        this.Field_price_for_house = element.price_for_house;
        this.Field_country = element.country;
    }

    getFieldId() {
        return this.Field_id;
    }

    getFieldOwnerId() {
        return this.Field_ownerId
    }
    getFieldFunction() {
        return this.Field_function
    }
    //TO DO finish it
    getField_penalty() {
        return (this.Field_house_ammount * this.Field_penaltyForEveryHouse) + this.Field_penalty;
    }
    getFieldPropertyValue() {
        return this.Field_property_value;
    }
    getPriceForHouse() {
        return this.Field_price_for_house;
    }
    getHouseAmmount() {
        return this.Field_house_ammount;
    }
    getFieldName() {
        return this.Field_name;
    }
    getFieldTitle() {
        return this.title;
    }
    addHouse() {
        this.Field_house_ammount += 1;
        return
    }
    
    changeOwner(newOwnerId) {
        this.Field_ownerId = newOwnerId;
    }
}