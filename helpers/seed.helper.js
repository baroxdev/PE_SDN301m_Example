const Section = require('../models/section');
const Course = require('../models/course');
const Member = require('../models/member');

async function seedOnInit() {
    // Check whether Sections collection is empty or not
    // If empty, then insert the data from the sections.json file
    const sections = await Section.find({});
    if (sections.length === 0) {
        const sectionsData = require('../data/sections.json');
        await Section.bulkWrite(sectionsData.map(section => ({
            insertOne: {
                document: section
            }
        })));
        console.log('Sections collection is empty. Inserted data from sections.json file')
    }

    // Check whether Members collection is empty or not
    // If empty, then insert the data from the members.json file
    const members = Member.find({});
    if (members.length === 0) {
        const membersData = require('../data/members.json');
        await Member.insertMany(membersData);
        console.log('Members collection is empty. Inserted data from members.json file')
    }

    // Check whether Courses collection is empty or not
    // If empty, then insert the data from the courses.json file
    const courses = await Course.find().toArray();
    if (courses.length === 0) {
        const coursesData = require('../data/courses.json');
        await Course.insertMany(coursesData);
        console.log('Courses collection is empty. Inserted data from courses.json file')
    }
}

module.exports = seedOnInit;