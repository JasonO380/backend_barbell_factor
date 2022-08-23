const HttpError = require('../models/http-error');
const { uuid } = require('uuidv4');

const macroDateEntry = new Date();

const macroData = [
    {
        id:"mac1",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"20",
        dayOfWeek:"Wednesday",
        carbs:"75",
        protein:"185",
        fats:"110"
    },
    {
        id:"mac2",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"21",
        dayOfWeek:"Thursday",
        carbs:"90",
        protein:"200",
        fats:"110"
    },
    {
        id:"mac3",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"22",
        dayOfWeek:"Friday",
        carbs:"80",
        protein:"185",
        fats:"105"
    },
    {
        id:"mac4",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"23",
        dayOfWeek:"Saturday",
        carbs:"160",
        protein:"195",
        fats:"50"
    },
    {
        id:"mac5",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"24",
        dayOfWeek:"Sunday",
        carbs:"140",
        protein:"190",
        fats:"40"
    },
    {
        id:"mac6",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"25",
        dayOfWeek:"Monday",
        carbs:"60",
        protein:"185",
        fats:"50"
    },
    {
        id:"mac7",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"26",
        dayOfWeek:"Tuesday",
        carbs:"90",
        protein:"190",
        fats:"40"
    },
    {
        id:"mac9",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"27",
        dayOfWeek:"Wednesday",
        carbs:"70",
        protein:"190",
        fats:"110"
    },
    {
        id:"mac10",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"28",
        dayOfWeek:"Wednesday",
        carbs:"70",
        protein:"190",
        fats:"110"
    },
    {
        id:"mac11",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"1",
        dayOfWeek:"Wednesday",
        carbs:"70",
        protein:"230",
        fats:"110"
    },
    {
        id:"mac12",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"2",
        dayOfWeek:"Thursday",
        carbs:"60",
        protein:"180",
        fats:"110"
    },
    {
        id:"mac13",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"3",
        dayOfWeek:"Friday",
        carbs:"110",
        protein:"205",
        fats:"90"
    },
    {
        id:"mac14",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"4",
        dayOfWeek:"Saturday",
        carbs:"220",
        protein:"230",
        fats:"50"
    },
    {
        id:"mac15",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"5",
        dayOfWeek:"Sunday",
        carbs:"130",
        protein:"190",
        fats:"45"
    },
]

const getMacrosById = (req, res, next)=>{
    const macroID = req.params.mid;
    const macros = macroData.find(m =>{
        return m.id === macroID
    })
    if(!macros){
        throw new HttpError ('No macro data found', 404);
    }
    res.json({macros: macros});
};

const getMacrosByUserId = (req, res, next)=>{
    const userID = req.params.uid;
    let macroHistory = [];
    const macros = macroData.map(m =>{
        if(m.athlete === userID){
            macroHistory.push(m)
        }
    })
    if(macroHistory.length === 0){
        throw new HttpError('The user ID does not exist or there is no macro data entered', 404);
    }
    res.json({macroHistory});
};

const addMacros = (req, res, next) => {
    const { carbs, protein, fats, athlete, id, dayOfWeek, month, day, year } = req.body;
    const macroInfo = {
        protein,
        carbs,
        fats,
        athlete,
        id:uuid(),
        dayOfWeek: macroDateEntry.toLocaleString("default", { weekday: "long" }),
        month: macroDateEntry.toLocaleString("en-US", { month:"long" }),
        day:macroDateEntry.getDate(),
        year: macroDateEntry.getFullYear()
    };
    macroData.push(macroInfo);
    res.status(201).json({macros: macroInfo})
}

exports.getMacrosById = getMacrosById;
exports.getMacrosByUserId = getMacrosByUserId;
exports.addMacros = addMacros;