import bcrypt from 'bcrypt';

const admin = (sequelize, DataTypes) => {
  const Admin = sequelize.define('admin', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
  });

  Admin.associate = models => {
    Admin.hasMany(models.Job, { onDelete: 'CASCADE' });
    Admin.hasMany(models.Employee, { onDelete: 'CASCADE' });
  };

  Admin.findByLogin = async login => {
    let existingUser = await Admin.findOne({
      where: { username: login },
    });
    if (!existingUser) {
      existingUser = await Admin.findOne({
        where: { email: login },
      });
    }
    return existingUser;
  };

  Admin.beforeCreate(async newAdmin => {
    newAdmin.password = await newAdmin.generatePasswordHash();
  });

  Admin.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    try {
      return await bcrypt.hash(this.password, saltRounds);
    } catch (error) {
      throw new Error(error);
    }
  };

  Admin.prototype.validatePassword = async function(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error(error);
    }
  };

  return Admin;
};
export default admin;
