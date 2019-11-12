const job = (sequelize, DataTypes) => {
  const Job = sequelize.define('job', {
    hours: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'A job has to have a name.',
        },
        min: 4,
        default: 4,
      },
    },
  });
  Job.associate = models => {
    Job.belongsTo(models.Admin);

    Job.belongsToMany(models.Employee, {
      through: 'Employee_Job',
      as: 'employees',
      foreignKey: 'jobId',
      otherKey: 'employeeId',
    });
  };
  return Job;
};
export default job;
