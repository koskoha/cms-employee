const employee = (sequelize, DataTypes) => {
  const Employee = sequelize.define('employee', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'A employee has to have a name.',
        },
      },
    },
    position: {
      type: DataTypes.ENUM,
      values: ['DRIVER', 'FOREMAN', 'HELPER'],
      validate: {
        notEmpty: {
          args: true,
          msg: 'A employee has to have a position.',
        },
      },
    },
    rate: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'A employee has to have a position.',
        },
        min: 0,
      },
    },
  });

  Employee.associate = models => {
    Employee.belongsTo(models.Admin);

    Employee.belongsToMany(models.Job, {
      through: 'Employee_Job',
      as: 'jobs',
      foreignKey: 'employeeId',
      otherKey: 'jobId',
    });
  };

  return Employee;
};
export default employee;
