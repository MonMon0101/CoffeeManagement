const STATUS = {
    ORDERED: "ORDERED",
    TRANSPORTED: "TRANSPORTED",
    COMPLETE: "COMPLETE",
    PROCESSING: "PROCESSING",
};

export const BuyOptions = {
    BACK_HOME: "BACK_HOME",
    AT_TABLE: "AT_TABLE",
};

export const labelBuyOption = (option) => {
    const options = {
        [BuyOptions.BACK_HOME]: "Mang đi",
        [BuyOptions.AT_TABLE]: "Tại quán",
    };
    return options[option];
};

export default STATUS;
