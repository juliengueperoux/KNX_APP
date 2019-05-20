const KNXConfigModel = require('./models/knxConfig');
const ScenarioModel = require('./models/scenario');
const CronJob = require('cron').CronJob;
const knx = require('knx');
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
        const connection = new(require('./connection'))()
        connection.ipPort = config.port
        connection.ipAddr = config.ipAddr
        connection._id = config._id
        const myConnection = new knx.Connection(connection)
        connection.name = config.name
        connection.interval = 1000
        connection.startChain = false
        connection.lights = config.lights
        connection.sensDirect = true
        myConnection.Connect()
        if (myConnection.connected) connection.connect = true
        connectionsList.push({
            params: connection,
            connection: myConnection
        })
    })
}

exports.addConnection = async (config) => {
    const connection = new(require('./connection'))()
    connection.ipPort = config.port
    connection.ipAddr = config.ipAddr
    connection._id = config._id
    const myConnection = new knx.Connection(connection)
    connection.name = config.name
    connection.interval = 1000
    connection.startChain = false
    connection.lights = config.lights
    connection.sensDirect = true
    myConnection.Connect()
    if (myConnection.connected) connection.connect = true
    connectionsList.push({
        params: connection,
        connection: myConnection
    })
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
        if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
        connection.connection.Connect()
        if (connection.connection.connected) connection.params.connect = true
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

exports.deconnectionKnx = (idKnx) => {
    try {
        const connection = getKNXConfig(idKnx)
        if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
        if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
        connection.connection.Disconnect();
        connection.connection.connect = false
        connection.params.connect = false
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

exports.startLight = (id, idKnx) => {
    try {
        const connection = getKNXConfig(idKnx)
        if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
        if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
            connection.connection.write(id, 1);
            connection.params.lights.find(light => light.id === id).state = true
            return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

exports.stopLight = (id, idKnx) => {
    try {
        const connection = getKNXConfig(idKnx)
        if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
        if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
            connection.connection.write(id, 0);
            connection.params.lights.find(light => light.id === id).state = false
            return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

const startAllLights = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    for (i = 0; i < connection.params.lights.length; i++) {
        try {
            connection.connection.write(connection.params.lights[i].id, 1); // allumer
            connection.params.lights.forEach((light) => light.state = true)
        } catch (error) {
             return {success:false, errorMessage:error}
        }
    }
    return true;
}

const startLights = (idKnx, lights) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    for (i = 0; i < lights.length; i++) {
        try {
            connection.connection.write(lights[i].id, 1); // allumer    
            connection.params.lights.forEach((light) => {
                if (lights.some(e => e.id === light.id)) {
                    light.state = true
                }
            })
        } catch (error) {
             return {success:false, errorMessage:error}
        }
    }
    return true;
}

const stopLights = (idKnx, lights) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    for (i = 0; i < lights.length; i++) {
        try {
            connection.connection.write(lights[i].id, 0); // eteindre 
            connection.params.lights.forEach((light) => {
                if (lights.some(e => e.id === light.id)) {
                    light.state = false
                }
            })
        } catch (error) {
             return {success:false, errorMessage:error}
        }
    }
    return true;
}

exports.startAllLights = startAllLights

const stopAllLights = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        for (i = 0; i < connection.lights.length; i++) {
            connection.connection.write(connection.params.lights[i].id, 0); // eteindre
            connection.params.lights.forEach((light) => light.state = false)
        }
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}
exports.stopAllLights = stopAllLights

exports.startChase = async (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        await stopAllLights(idKnx)
        connection.params.startChain = true;
        while (connection.params.startChain) {
            var index = 0;
            for (i = 0; i < connection.params.lights.length; i++) {
                index = (!connection.params.sensDirect) ? connection.params.lights.length - 1 - i : i; // si connection.sensDirect = true connection.sensDirect normal sinon connection.sensDirect à l envers!
                connection.connection.write(connection.params.lights[index].id, 1); // allumer
                await sleep(connection.interval);
                connection.connection.write(connection.params.lights[index].id, 0); // allumer
            }
        }
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }

}

exports.stopChase = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        connection.params.startChain = false;
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

exports.setInterval = (newInterval, idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        newInterval >= 500 ? connection.params.interval = newInterval : connection.params.interval = 500;
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

exports.setUpInterval = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        connection.params.interval += 1000;
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }

};

exports.setDownInterval = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        if (connection.params.interval > 1000) connection.params.interval -= 1000;
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }

};

exports.reverse = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        connection.params.sensDirect = (connection.params.sensDirect) ? false : true;
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }

}

exports.getAllLight = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        return {
            'success': true,
            'data': connection.params.lights
        };
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

exports.addLight = (name, idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        connection.params.lights.push(name);
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

exports.removeLight = (name, idKnx) => {
    const connection = getKNXConfig(idKnx)
    if (!connection.connection) return {success:false, errorMessage:"Knx machine not found"}
    if (!connection.connection.connect) return {success:false, errorMessage:"Knx machine not connected"}
    try {
        let index = connection.params.lights.indexOf(name);
        connection.params.lights.splice(index, 1);
        return true;
    } catch (error) {
         return {success:false, errorMessage:error}
    }
}

getKNXConfig = (idConfigKNX) => {
    return connectionsList.find(function (element) {
        return element.connection._id == idConfigKNX;
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