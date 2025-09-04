const schoolMachineData = {
    "Hoa Sen": {
        "soMayGV": 1,
        "soMayHS": 49,
	"phongMay": "PM1"
    },
    "Trần Quốc Toản": {
        "soMayGV": 1,
        "soMayHS": 29,
	"phongMay": "PM1"
    },
    // Add other schools here
};

function getSoMayByTruong(truongName) {
    return schoolMachineData[truongName];
}