const Subject = require('../models/Subject');

const seedSubjects = async () => {
  try {
    const subjects = [
      'Mathematics',
      'Physics', 
      'Chemistry',
      'Biology',
      'English',
      'Hindi',
      'History',
      'Geography',
      'Economics',
      'Computer Science'
    ];

    for (const subjectName of subjects) {
      const existingSubject = await Subject.findOne({ subject_name: subjectName });
      if (!existingSubject) {
        await Subject.create({ subject_name: subjectName });
        console.log(`✅ Created subject: ${subjectName}`);
      }
    }
    
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Database seeding error:', error);
  }
};

module.exports = { seedSubjects };