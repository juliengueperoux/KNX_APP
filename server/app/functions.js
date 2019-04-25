const KNXConfigModel = require('./models/knxConfig');
const ScenarioModel = require('./models/scenario');
const CronJob = require('cron').CronJob;
const connectionsList = []
let scenarioList = []

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.initConnections = async () => {
    const allConfigs = await KNXConfigModel.find({}, (err, results) => {
        if (err) return []
        return results
    })
    allConfigs.forEach((config) => {
        const connection = new (require('./connection'))()
        connection.ipPort = config.port
        connection.ipAddr = config.ipAddr
        connection._id = config._id
        connection.interval = 1000
        connection.startChain = false,
        connection.arrayLamp = config.lights
        connection.sensDirect = true
        connection.Connect()
        connectionsList.push(connection)
       // connection.connect()
    })
}

exports.addConnection = async (config) => {
    const connection = new (require('./connection'))()
    connection.ipPort = config.port
    connection.ipAddr = config.ipAddr
    connection._id = config._id
    connection.interval = 1000
    connection.startChain = false,
        connection.arrayLamp = config.lights
    connection.sensDirect = true
    connection.Connect()
    connectionsList.push(connection)
}

exports.initScenarios = async () => {
    scenarioList = await ScenarioModel.find({}, (err, results) => {
        if (err) return []
        return results
    })
    const DayInt = [{
        name: "Lundi",
        int: "1"
    }, {
        name: "Mardi",
        int: "2"
    }, {
        name: "Mercredi",
        int: "3"
    }, {
        name: "Jeudi",
        int: "4"
    }, {
        name: "Vendredi",
        int: "5"
    }, {
        name: "Samedi",
        int: "6"
    }, {
        name: "Dimanche",
        int: "7"
    }]
    scenarioList.forEach((scenario) => {
        const cron = new CronJob(setCronTime(scenario, DayInt), function () {
            if (scenario.action) startLights(scenario.idKnx, scenario.lights)
            else stopLights(scenario.idKnx, scenario.lights)
        }, null, false, 'Europe/Paris');
        cron.start()
        scenario.cron = cron
    })
}

exports.addScenario = async (scenario) => {
    const DayInt = [{
        name: "Lundi",
        int: "1"
    }, {
        name: "Mardi",
        int: "2"
    }, {
        name: "Mercredi",
        int: "3"
    }, {
        name: "Jeudi",
        int: "4"
    }, {
        name: "Vendredi",
        int: "5"
    }, {
        name: "Samedi",
        int: "6"
    }, {
        name: "Dimanche",
        int: "7"
    }]
    const cron = new CronJob(setCronTime(scenario, DayInt), function () {
        if (scenario.action) startLights(scenario.idKnx, scenario.lights)
        else stopLights(scenario.idKnx, scenario.lights)
    }, null, false, 'Europe/Paris');
    cron.start()
    scenario.cron = cron
    scenarioList.push(scenario)
    return true
}


exports.connectionKnx = (idUser, idKnx) => {
    try {
        const connection = getKNXConfig(idKnx)
        connection.connected();
        return true;
    } catch (error) {
        return error;
    }
}

exports.deconnectionKnx = (idKnx) => {
    try {
        const connection = getKNXConfig(idKnx)
        connection.Disconnect();
        return true;
    } catch (error) {
        return error;
    }
}

exports.startLight = (id, idKnx) => {
    try {
        const connection = getKNXConfig(idKnx)
        connection.write(id, 1);
        return true;
    } catch (error) {
        return error;
    }
}

exports.stopLight = (id, idKnx) => {
    try {
        const connection = getKNXConfig(idKnx)
        connection.write(id, 0);
        return true;
    } catch (error) {
        return error;
    }
}

const startAllLights = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    for (i = 0; i < connection.arrayLamp.length; i++) {
        try {
            connection.write(connection.arrayLamp[i].id, 1); // allumer        
        } catch (error) {
            return error;
        }
    }
    return true;
}

const startLights = (idKnx, arrayLamp) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    for (i = 0; i < arrayLamp.length; i++) {
        try {
            connection.write(connection.arrayLamp[i].id, 1); // allumer        
        } catch (error) {
            return error;
        }
    }
    return true;
}

const stopLights = (idKnx, arrayLamp) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    for (i = 0; i < arrayLamp.length; i++) {
        try {
            connection.write(connection.arrayLamp[i].id, 0); // eteindre        
        } catch (error) {
            return error;
        }
    }
    return true;
}

exports.startAllLights = startAllLights

const stopAllLights = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        for (i = 0; i < connection.arrayLamp.length; i++) {
            connection.write(connection.arrayLamp[i], 0); // eteindre
        }
        return true;
    } catch (error) {
        return error;
    }
}
exports.stopAllLights = stopAllLights

exports.startChase = async (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        connection.startChain = true;
        while (connection.startChain) {
            var index = 0;
            for (i = 0; i < connection.arrayLamp.length; i++) {
                index = (!connection.sensDirect) ? connection.arrayLamp.length - 1 - i : i; // si connection.sensDirect = true connection.sensDirect normal sinon connection.sensDirect à l envers!
                connection.write(connection.arrayLamp[index], 1); // allumer
                await sleep(connection.interval);
                connection.write(connection.arrayLamp[index], 0); // allumer
            }
        }
        return true;
    } catch (error) {
        return error;
    }

}

exports.stopChase = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        connection.startChain = false;
        return true;
    } catch (error) {
        return error;
    }
}

exports.setInterval = (interval, idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        console.log("INTERVAL : " + connection.interval);
        (connection.interval >= 500) ? connection.interval = interval: connection.interval = 500;
        return true;
    } catch (error) {
        return error;
    }
}

exports.setUpInterval = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        connection.interval += 1000;
        return true;
    } catch (error) {
        return error;
    }

};

exports.setDownInterval = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        if (connection.interval > 1000) connection.interval -= 1000;
        return true;
    } catch (error) {
        return error;
    }

};

exports.reverse = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        connection.sensDirect = (connection.sensDirect) ? false : true;
        return true;
    } catch (error) {
        return error;
    }

}

exports.getAllLight = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        return {
            'success': true,
            'data': connection.arrayLamp
        };
    } catch (error) {
        return error;
    }
}

exports.addLight = (name, idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        connection.arrayLamp.push(name);
        return true;
    } catch (error) {
        return error;
    }
}

exports.removeLight = (name, idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection) return new Error("Knx machine not found")
    try {
        let index = connection.arrayLamp.indexOf(name);
        connection.arrayLamp.splice(index, 1);
        return true;
    } catch (error) {
        return error;
    }
}

getKNXConfig = (idConfigKNX) => {
    return connectionsList.find(function (element) {
        return element._id == idConfigKNX;
    });
}


setCronTime = (scenario, DayInt) => {
    let cronTime = scenario.time.minutes + " " + scenario.time.hours + " * * " + setDayStringCron(scenario.repetition, DayInt)
    return cronTime
}

setDayStringCron = (days, DayInt) => {
    let result = ""
    if (days.indexOf("Jour") != -1) return "*"
    days.forEach((day) => {
        const dayint = DayInt.find((element) => {
            return element.name == day
        })
        if (dayint) result += dayint.int + ","
    })
    if (result.length > 0) return result.substring(0, result.length - 1)
}

exports.connectionsList = connectionsList
exports.scenarioList = scenarioList